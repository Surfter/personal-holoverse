// Fade out splash and show menu
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    document.getElementById('menu-screen').style.display = 'block';
  }, 1200); // 1.2 second delay
});

// Set up note saving
const textarea = document.getElementById('notes');
if (textarea) {
  textarea.value = localStorage.getItem('myNote') || '';
  textarea.addEventListener('input', () => {
    localStorage.setItem('myNote', textarea.value);
  });
}

// Navigation functions
function goToNotepad() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('notepad-screen').style.display = 'block';
}

function goToTodo() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('todo-screen').style.display = 'flex';
  loadTodos();
}

function goToMenu() {
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('todo-screen').style.display = 'none';
  document.getElementById('menu-screen').style.display = 'block';
}

// To-Do Logic
function showTodoInput() {
  document.getElementById('show-input-btn').style.display = 'none';
  document.getElementById('todo-input-wrapper').style.display = 'flex';
  document.getElementById('todo-input').focus();
}

function hideTodoInput() {
  document.getElementById('todo-input-wrapper').style.display = 'none';
  document.getElementById('show-input-btn').style.display = 'inline-block';
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
      todos.splice(index, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
