const main = document.getElementById("main_container")
const add_btn = document.querySelectorAll(".title .material-icons")
let check_input = document.querySelectorAll(".todo input")
let close_btn = document.querySelectorAll(".todo i")
const ids = ['monthly', 'weekly', 'daily', 'today']

window.onload = () => {
    if (localStorage.getItem('todo_list')) {
        const todo_list = JSON.parse(localStorage.getItem('todo_list'))
        
        for (const [key, value] of Object.entries(todo_list)) {
            const now_wrapper = document.getElementById(`${key}`)
            for (val of value) {
                if (val[1]) {
                    now_wrapper.insertAdjacentHTML("beforeend", `
                    <div class="todo">
                        <input type="checkbox" checked>
                        <span>${val[0]}</span>
                        <i class="material-icons">close</i>
                    </div>
                `)
                } else {
                    now_wrapper.insertAdjacentHTML("beforeend", `
                    <div class="todo">
                        <input type="checkbox">
                        <span>${val[0]}</span>
                        <i class="material-icons">close</i>
                    </div>
                `)
                }
            }
        }
    }
}


add_btn.forEach(add => {
  add.addEventListener("click", (e) => {
    input = prompt("일정을 입력해 주세요.")
    if (input) {
        e.target.parentNode.parentNode.children[1].insertAdjacentHTML("beforeend",
          `
            <div class="todo">
                <input type="checkbox">
                <span>${input}</span>
                <i class="material-icons">close</i>
            </div>
            `
        );
        check_input = document.querySelectorAll(".todo input")
        close_btn = document.querySelectorAll(".todo i")
        save_all()
    }
  })
})

main.addEventListener('click', e => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        save_all()
    } else if (e.target.tagName === "I" && e.target.innerText === "close") {
        e.target.parentNode.remove()
        save_all()
    }
})

function save_all() {
    let todo_list = {}
    ids.forEach(id => {
        const todos = document.querySelectorAll(`#${id} .todo`)
        let todo_status = []
        todos.forEach(todo => {
            todo_status.push([todo.children[1].innerText, todo.children[0].checked])
        })
        todo_list[`${id}`] = todo_status
    })
    
    localStorage.setItem('todo_list', JSON.stringify(todo_list))
}
