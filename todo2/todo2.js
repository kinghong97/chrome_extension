const add_btn = document.querySelectorAll("#todo_container .material-icons")
const main = document.getElementById("main_container")
let check_input = document.querySelectorAll(".todo input")
let close_btn = document.querySelectorAll(".todo i")
const ids = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']


add_btn.forEach(add => {
    add.addEventListener("click", (e) => {
      input = prompt("일정을 입력해 주세요.")
      if (input) {
          e.target.parentNode.parentNode.children[1].insertAdjacentHTML("beforeend",
            `
              <div class="todo" draggable="true">
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
    let todo_status = []
    document.querySelectorAll(`#todo_container .todo`).forEach(todo => {
        todo_status.push([todo.children[1].innerText, todo.children[0].checked])
    })
    todo_list[`todo`] = todo_status
    localStorage.setItem('todo_list', JSON.stringify(todo_list))
}
