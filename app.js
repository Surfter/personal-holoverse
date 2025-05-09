// DOM elements
const splash = document.getElementById("splash");
const menuScreen = document.getElementById("menu-screen");
const notepadScreen = document.getElementById("notepad-screen");
const todoScreen = document.getElementById("todo-screen");
const statScreen = document.getElementById("stat-screen");
const notes = document.getElementById("notes");

const logoButton = document.getElementById("logo-button");
const radialMenuContainer = document.getElementById("radial-menu-container");
const radialMenu = document.getElementById("radial-menu");
const menuItems = document.querySelectorAll(".menu-item");

// Splash screen transition
window.addEventListener("load", () => {
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
      menuScreen.style.display = "block";
    }, 500);
  }, 1000);
});

// Navigation helper
function showScreen(screen) {
  [menuScreen, notepadScreen, todoScreen, statScreen].forEach(s => s.style.display = "none");
  screen.style.display = "flex";
  screen.classList.add("screen-animate");
}

// Back button
function goToMenu() {
  showScreen(menuScreen);
}
window.goToMenu = goToMenu;

// Radial menu toggle
logoButton.addEventListener("click", () => {
  radialMenu.classList.toggle("active");
  radialMenuContainer.classList.toggle("visible");
  logoButton.classList.add("pulsing");
  setTimeout(() => logoButton.classList.remove("pulsing"), 300);
});

// Assign angles to menu items
menuItems.forEach((btn, i) => {
  const angle = (i * 360 / menuItems.length) + "deg";
  btn.style.setProperty("--angle", angle);

  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target) {
      showScreen(document.getElementById(target));
      radialMenu.classList.remove("active");
      radialMenuContainer.classList.remove("visible");
    }
  });
});


// --- Notepad ---
notes.value = localStorage.getItem("notes") || "";
notes.addEventListener("input", () => {
  localStorage.setItem("notes", notes.value);
});


// --- To-Do Logic ---
const todoList = document.getElementById("todo-list");
const todoInputWrapper = document.getElementById("todo-input-wrapper");
const todoInput = document.getElementById("todo-input");

// Load saved tasks
let todos = JSON.parse(localStorage.getItem("todos")) || [];
renderTodos();

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-pop-in";

    const span = document.createElement("span");
    span.className = "todo-text" + (todo.done ? " done" : "");
    span.textContent = todo.text;
    span.onclick = () => toggleDone(index);

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✖";
    del.onclick = () => removeTodo(index, li);

    li.append(span, del);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, done: false });
    localStorage.setItem("todos", JSON.stringify(todos));
    todoInput.value = "";
    renderTodos();
    hideTodoInput();
  }
}

function removeTodo(index, li) {
  li.classList.add("todo-pop-out");
  setTimeout(() => {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }, 300);
}

function toggleDone(index) {
  todos[index].done = !todos[index].done;
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

function showTodoInput() {
  todoInputWrapper.style.display = "flex";
  todoInput.focus();
}
function hideTodoInput() {
  todoInputWrapper.style.display = "none";
}
window.addTodo = addTodo;
window.showTodoInput = showTodoInput;
window.hideTodoInput = hideTodoInput;


// --- Stat Screen (No special logic for now) ---
