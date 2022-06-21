const main = document.getElementById("main_container")
const add_btn = document.querySelectorAll(".title .material-icons")
let check_input = document.querySelectorAll(".todo input")
let close_btn = document.querySelectorAll(".todo i")
const ids = ['monthly', 'weekly', 'daily', 'today']
const containers = document.querySelectorAll('.containers')

window.onload = () => {
    if (localStorage.getItem('todo_list')) {
        const todo_list = JSON.parse(localStorage.getItem('todo_list'))
        
        for (const [key, value] of Object.entries(todo_list)) {
            const now_wrapper = document.getElementById(`${key}`)
            for (val of value) {
                if (val[1]) {
                    now_wrapper.insertAdjacentHTML("beforeend", `
                    <div class="todo" draggable="true">
                        <input type="checkbox" checked>
                        <span>${val[0]}</span>
                        <i class="material-icons">close</i>
                    </div>
                `)
                } else {
                    now_wrapper.insertAdjacentHTML("beforeend", `
                    <div class="todo" draggable="true">
                        <input type="checkbox">
                        <span>${val[0]}</span>
                        <i class="material-icons">close</i>
                    </div>
                `)
                }
            }
        }
    }
    time_check()
}

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
    
    localStorage.setItem('todo_list', JSON.stringify(todo_list))
}

function time_check() {
    const date = new Date()
    const now_date = date.getDate()
    const now_day = date.getDay()
    if (localStorage.getItem('time')) {
        const old_time = JSON.parse(localStorage.getItem('time'))
        if (old_time['date'] !== now_date && now_date === 1) {
            const monthly_todos = document.querySelectorAll("#monthly .todo input")
            monthly_todos.forEach(todo => todo.checked = false)
        }
        if (old_time['day'] !== now_day && now_day === 0) {
            const weekly_todos = document.querySelectorAll("#weekly .todo input")
            weekly_todos.forEach(todo => todo.checked = false)
        }
        if (old_time['date'] !== now_date) {
            const daily_todos = document.querySelectorAll("#daily .todo input")
            daily_todos.forEach(todo => todo.checked = false)
        }
        save_all()
    }
    let time = {}
    time['date'] = now_date
    time['day'] = now_day
    localStorage.setItem('time', JSON.stringify(time))
}

main.addEventListener('mouseover', () => {
    const todos = document.querySelectorAll('.todo')
    
    todos.forEach(todo => {
        todo.addEventListener('dragstart', () => {
            todo.classList.add('dragging')
      })
    
      todo.addEventListener('dragend', () => {
        todo.classList.remove('dragging')
      })
    })
})

containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
  container.addEventListener('dragend', e => {
    e.preventDefault()
    save_all()
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.todo:not(.dragging)')]
  return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element : child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

chrome.alarms.create({ when:Date.now(), periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(() => {
  time_check()
})