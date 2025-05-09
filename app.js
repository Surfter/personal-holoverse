// Splash screen logic
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');

    const menu = document.getElementById('menu-screen');
    menu.style.display = 'block';
    menu.classList.add('screen-animate');

    setTimeout(() => {
      document.getElementById('radial-menu-container').classList.add('visible');
    }, 300); // Short delay helps smooth layout
  }, 1200);
});


// Notepad logic
const textarea = document.getElementById('notes');
if (textarea) {
  textarea.value = localStorage.getItem('myNote') || '';
  textarea.addEventListener('input', () => {
    localStorage.setItem('myNote', textarea.value);
  });
}

// Screen navigation helpers
function showScreen(targetId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    if (screen.id === targetId) {
      screen.classList.remove('hidden');
      screen.classList.add('screen-animate');
    } else {
      screen.classList.add('hidden');
      screen.classList.remove('screen-animate');
    }
  });
}


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

// To-Do logic
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
      setTimeout(() => {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
      }, 300);
    };

    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}



  items.forEach(btn => {
    const target = btn.dataset.target;
    if (target) {
      btn.addEventListener('click', () => {
        radialMenu.classList.remove('active');
        setTimeout(() => {
          if (target === 'notepad-screen') goToNotepad();
          if (target === 'todo-screen') goToTodo();
        }, 300);
      });
    }
  });
});

const logoButton = document.getElementById('logo-button');

logoButton.addEventListener('click', function () {
  this.classList.remove('pulsing');           // remove if it's mid-animation
  void this.offsetWidth;                      // trigger reflow (force redraw)
  this.classList.add('pulsing');              // add class to play animation
});


function changeStat(stat, amount) {
  const statElement = document.querySelector(`.stat[data-stat="${stat}"] span`);
  let currentValue = parseInt(statElement.textContent);
  if (isNaN(amount)) return;
  statElement.textContent = currentValue + parseInt(amount);
}

function promptAmount() {
  let input = prompt("Enter amount to add:");
  return parseInt(input);
}

function toggleStatMenu() {
  const menu = document.getElementById("stat-menu");
  menu.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const logoButton = document.getElementById("logo-button");
  const radialMenu = document.getElementById("radial-menu");
  const menuItems = radialMenu.querySelectorAll(".menu-item");

  // Distribute buttons in a circle
  const angleStep = 360 / menuItems.length;
  menuItems.forEach((item, index) => {
    const angle = index * angleStep;
    item.style.setProperty('--angle', `${angle}deg`);
  });

  // Logo button toggles menu + animation
  logoButton.addEventListener("click", () => {
    radialMenu.classList.toggle("active");
    logoButton.classList.remove("pulsing");
    void logoButton.offsetWidth;
    logoButton.classList.add("pulsing");
  });

  // Click each radial button to switch screens
  menuItems.forEach(btn => {
    const targetId = btn.dataset.target;
    if (targetId) {
      btn.addEventListener("click", () => {
        radialMenu.classList.remove("active");

        // Hide all screens
        const allScreens = document.querySelectorAll(".screen");
        allScreens.forEach(screen => {
          screen.style.display = "none";
        });

        // Show the selected screen
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
          targetScreen.style.display = "flex";
        }
      });
    }
  });
});
