function parse(val) {
    try {
        val = JSON.parse(val)
    } catch{
    }
    return val
}

function stringify(val) {
    try {
        val = JSON.stringify(val)
    } catch {
        val = ''
    }
    return val
}

export const useLocalStorage = () => {
    function setItem(key, val) {
        val = stringify(val)
        window.localStorage.setItem(key, val)
    }

    function getItem(key) {
        let val = window.localStorage.getItem(key)
        if (val) {
            val = parse(val)
        }
        return val
    }
    return {
        setItem,
        getItem
    }
}