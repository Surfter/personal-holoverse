// Fade out splash and show menu
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade-out');
    const menu = document.getElementById('menu-screen');
    menu.style.display = 'block';
    menu.classList.add('screen-animate');
  }, 1200);
});

// Set up note saving
const textarea = document.getElementById('notes');
if (textarea) {
  textarea.value = localStorage.getItem('myNote') || '';
  textarea.addEventListener('input', () => {
    localStorage.setItem('myNote', textarea.value);
  });
}

// Helper: show screen with animation
function showScreen(screenId) {
  const screen = document.getElementById(screenId);
  screen.style.display = screenId === 'todo-screen' ? 'flex' : 'block';
  screen.classList.add('screen-animate');
  // Optional: remove the class after animation ends
  setTimeout(() => screen.classList.remove('screen-animate'), 400);
}

// Navigation functions
function goToNotepad() {
  document.getElementById('menu-screen').style.display = 'none';
  showScreen('notepad-screen');
}

function goToTodo() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('notepad-screen').style.display = 'none';
  showScreen('todo-screen');
  loadTodos();
}

function goToMenu() {
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('todo-screen').style.display = 'none';
  showScreen('menu-screen');
}

// To-Do Logic
function showTodoInput() {
  document.getElementById('show-input-button').style.display = 'none';
  document.getElementById('todo-input-wrapper').style.display = 'flex';
  document.getElementById('todo-input').focus();
}

function hideTodoInput() {
  document.getElementById('todo-input-wrapper').style.display = 'none';
  document.getElementById('show-input-button').style.display = 'inline-block';
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const task = input.value.trim();
  if (task) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push({ text: task, done: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    hideTodoInput();
    loadTodos();
  }
}

function loadTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.classList.add('todo-pop-in');

    const icon = document.createElement('span');
    icon.className = 'todo-icon';
    icon.textContent = '📜';

    const span = document.createElement('span');
    span.className = 'todo-text' + (todo.done ? ' done' : '');
    span.textContent = todo.text;
    span.onclick = () => {
      todos[index].done = !todos[index].done;
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '×';
    delBtn.onclick = () => {
      li.classList.add('todo-pop-out');
      requestAnimationFrame(() => {
        setTimeout(() => {
          todos.splice(index, 1);
          localStorage.setItem('todos', JSON.stringify(todos));
          loadTodos();
        }, 300);
      });
    };

    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
