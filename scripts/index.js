var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var clearCompleted = document.querySelector("#clearCompleted");
var markAllCompleted = document.querySelector("#markAllCompleted");
var todoIndexValue = 0;
var globalTodoFilter = null;

var showAll = document.querySelector("#showAll");
var showActive = document.querySelector("#showActive");
var showCompleted = document.querySelector("#showCompleted");

var todos = [];

inputText.onkeypress = function(e) {
    if (e.keyCode == 13) {
        todoIndexValue++;
        todos.push({
            text: inputText.value,
            isDone: false,
            index: todoIndexValue
        });
        updateLocalSrorage();
        inputText.value = "";
        renderTodos(globalTodoFilter);
        countActiveTodos();
    }
}

clearCompleted.onclick = function() {
    todos.forEach(function(todo, i) {
        if (todo.isDone == true) {
            var li = document.querySelector("li[todo-index='" + todo.index + "']");
            todosList.removeChild(li);
        }
    });

    todos = todos.filter(function(todo) {
        return todo.isDone == false;
    });
    updateLocalSrorage();
}

markAllCompleted.onclick = function() {
    var activeTodos = todos.filter(function(todo) {
        return todo.isDone == false;
    }).length;

    if (activeTodos == 0) {
        todos.forEach(function(todo) {
            changeTodoStatus(todo, "", false);
        });
    } else {
        todos.forEach(function(todo) {
            changeTodoStatus(todo, "todo-done", true);
        });
    }

    countActiveTodos();
}

function changeTodoStatus(todo, liClass, todoState) {
    var li = document.querySelector("li[todo-index='" + todo.index + "']");
    var checkbox = li.querySelector("input");

    todo.isDone = todoState;
    checkbox.checked = todoState;
    li.setAttribute("class", "list-group-item", liClass);
    updateLocalSrorage();
}

showActive.onclick = function() {
    renderTodos(false);
}

showAll.onclick = function() {
    renderTodos(null);
}

showCompleted.onclick = function() {
    renderTodos(true);
}

function renderTodos(todoFilter) {
    highlightButton(todoFilter);
    globalTodoFilter = todoFilter;

    var filteredTodos = todos;
    todosList.innerHTML = "";
    
    if (todos.length == 0) {
        todosList.innerHTML = "";
        return;
    }

    if (todoFilter != null) {
        todosList.innerHTML = "";
        filteredTodos = filteredTodos.filter(function(todo) {
            return todo.isDone == todoFilter;
        });
    }

    filteredTodos.forEach(function(todo) {
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);

        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", todo.index);

        if(todo.isDone == true) {
            todoElementTemplate.setAttribute("class", "todo-done list-group-item");
            todoElementTemplate.querySelector("input").checked = true;
        }

        todoElementTemplate.querySelector("input").onchange = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo.index == todoIndex;
            });

            todo = todos.indexOf(todo[0]);
            todo = todos[todo];

            if (e.path[0].checked) {
                li.setAttribute("class", "todo-done list-group-item");
                todo.isDone = true;
            } else {
                li.setAttribute("class", "list-group-item");
                todo.isDone = false;
            }
            countActiveTodos();
            updateLocalSrorage();
        }
        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo.index == todoIndex;
            });

            todoIndex = todos.indexOf(todo[0]);
            todos.splice(Number(todoIndex), 1);

            todosList.removeChild(li);
            countActiveTodos();
            updateLocalSrorage();
        }
        todosList.appendChild(todoElementTemplate);
    });
}

function highlightButton(todoFilter) {
    document.querySelectorAll("div.btn-group .btn").forEach(function(button) {
        button.setAttribute("class", "btn btn-default")
    })
    switch(todoFilter) {
        case true:
            showCompleted.setAttribute("class", "btn btn-primary");
            break;
        case false:
            showActive.setAttribute("class", "btn btn-primary");
            break;
        case null:
            showAll.setAttribute("class", "btn btn-primary");
            break;
    }
}

function countActiveTodos() {
    var activeTodos = todos.filter(function(todo) {
        return todo.isDone == false;
    });

    todosLeft.innerText = activeTodos.length;
}

function updateLocalSrorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function init() {
    var localStorageTodos = localStorage.todos;
    if (localStorageTodos != undefined) {
        todos = JSON.parse(localStorageTodos);
    }

    renderTodos(null);
    countActiveTodos();
}

init();