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
    <section class="main">
      <input class="toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <li
          v-for="(todo, index) in todos"
          :key="todo"
          :class="{ editing: todo === editingTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input
            class="edit"
            placeholder="Create a TodoMVC template"
            v-model="todo.text"
            @keyup.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <!-- This footer should be hidden by default and shown when there are todos -->
    <footer class="footer">
      <!-- This should be `0 items left` by default -->
      <span class="todo-count"><strong>0</strong> item left</span>
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <a class="selected" href="#/">All</a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button class="clear-completed">Clear completed</button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="http://todomvc.com">Shibin</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
import { ref } from "vue";
// addTodo
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
    console.log('remove')
    todos.value.splice(index, 1);
  };
  return {
    removeTodo,
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

export default {
  name: "App",
  components: {},
  setup() {
    const todos = ref([]);
    const { removeTodo } = useRemove(todos);
    return {
      todos,
      removeTodo,
      ...useAddTodo(todos),
      ...useEdit(removeTodo),
    };
  },
};
</script>
