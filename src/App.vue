<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autofocus
        v-model="word"
        @keyup.enter="addTodo"
      />
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main" v-show="count">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <li
          v-for="(todo, index) in filterTodos"
          :key="todo"
          :class="{
            editing: todo === editingTodo,
            completed: todo.completed,
          }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input
            class="edit"
            placeholder="Create a TodoMVC template"
            v-model="todo.text"
            v-editingFocus="todo === editingTodo"
            @keyup.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <!-- This footer should be hidden by default and shown when there are todos -->
    <footer class="footer" v-show="count">
      <!-- This should be `0 items left` by default -->
      <span class="todo-count"
        ><strong>{{ remainingCount }}</strong> item{{
          remainingCount > 1 ? "s" : ""
        }}
        left</span
      >
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <a href="#/" :class="{ selected: type === 'all' }"
            >All</a
          >
        </li>
        <li>
          <a href="#/active" :class="{ selected: type === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: type === 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button
        class="clear-completed"
        v-show="count > remainingCount"
        @click="removeCompleted"
      >
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="https://github.com/shibin-cli">Shibin</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useLocalStorage } from "./utils/storage";

const storage = useLocalStorage();

const useAddTodo = (todos) => {
  const word = ref("");
  const addTodo = () => {
    const text = word.value;
    if (word.value.trim()) {
      todos.value.unshift({
        text,
        completed: false,
      });
      word.value = "";
    }
  };
  return {
    word,
    addTodo,
  };
};

const useRemove = (todos) => {
  const removeTodo = (index) => {
    console.log("remove");
    todos.value.splice(index, 1);
  };
  const removeCompleted = () => {
    todos.value = todos.value.filter((todo) => !todo.completed);
  };
  return {
    removeTodo,
    removeCompleted,
  };
};

const useEdit = (removeTodo) => {
  let beforeEditText = "";
  const editingTodo = ref(null);
  const editTodo = (todo) => {
    beforeEditText = todo.text;
    editingTodo.value = todo;
  };
  const doneEdit = (todo) => {
    if (!editingTodo.value) {
      return;
    }
    todo.text || removeTodo(todo);
    editingTodo.value = null;
  };
  const cancelEdit = (todo) => {
    editingTodo.value = null;
    todo.text = beforeEditText;
  };
  return {
    editingTodo,
    editTodo,
    doneEdit,
    cancelEdit,
  };
};

const useDone = (todos) => {
  const allDone = computed({
    get() {
      return !todos.value.filter((todo) => !todo.completed).length;
    },
    set(val) {
      todos.value.forEach((todo) => {
        todo.completed = val;
      });
    },
  });

  return {
    allDone,
  };
};
const useFilter = (todos) => {
  const type = ref(window.location.hash.replace("#/", "")||"all");
  const filter = {
    all: (todoList) => todoList,
    active: (todoList) => todoList.filter((todo) => !todo.completed),
    completed: (todoList) => todoList.filter((todo) => todo.completed),
  };
  const filterTodos = computed(() => filter[type.value](todos.value));
  const remainingCount = computed(() => filter.active(todos.value).length);
  const count = computed(() => todos.value.length);

  const onHashChange = () => {
    let hash = window.location.hash.replace("#/", "");
    if (filter[hash]) {
      type.value = hash;
      return;
    }
    type.value = "all";
    window.location.hash && (window.location.hash = "");
  };
  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
  });
  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });
  return {
    filterTodos,
    remainingCount,
    count,
    type,
  };
};

const useLocal = () => {
  const KEY = "TODOMVC-VUE3";
  const todos = ref(storage.getItem(KEY) || []);
  watchEffect(() => {
    storage.setItem(KEY, todos.value);
  });
  return {
    todos,
  };
};

export default {
  name: "App",
  components: {},
  setup() {
    const { todos } = useLocal();
    const { removeTodo, removeCompleted } = useRemove(todos);
    return {
      removeTodo,
      removeCompleted,
      ...useAddTodo(todos),
      ...useEdit(removeTodo),
      ...useDone(todos),
      ...useFilter(todos),
    };
  },
  directives: {
    editingFocus(el, binding) {
      binding.value && el.focus();
    },
  },
};
</script>
