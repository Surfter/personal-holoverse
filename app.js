console.log("App.js is running");
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
function showScreen(screenId) {
  const screen = document.getElementById(screenId);
  
  // Clear any previous instances that might be in the DOM
  const allScreens = document.querySelectorAll('.notepad-screen, .screen');
  allScreens.forEach(s => {
    // First hide all screens
    s.style.display = 'none';
    
    // If this is a duplicate of our target screen that got added to menu, remove it
    if (s.id === screenId && s !== screen) {
      s.parentNode.removeChild(s);
    }
  });
  
  // Now show the real screen with proper display property
  screen.style.display = screenId === 'todo-screen' ? 'flex' : 
                         screenId === 'stat-screen' ? 'flex' : 'block';
  
  screen.classList.add('screen-animate');
  setTimeout(() => screen.classList.remove('screen-animate'), 400);
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
  // Hide all screens
  document.querySelectorAll('.notepad-screen, .screen').forEach(screen => {
    screen.style.display = 'none';
  });
  
  // Show menu
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

// Radial menu logic
document.addEventListener("DOMContentLoaded", () => {
  const logoButton = document.getElementById("logo-button");
  const radialMenu = document.getElementById("radial-menu");
  const items = radialMenu.querySelectorAll(".menu-item");

  // Distribute buttons evenly in a circle
  const angleStep = 360 / items.length;
  items.forEach((item, index) => {
    const angle = index * angleStep;
    item.style.setProperty('--angle', `${angle}deg`);
  });

  logoButton.addEventListener("click", () => {
    radialMenu.classList.toggle("active");
  });

  items.forEach(btn => {
    const target = btn.dataset.target;
    if (target) {
      btn.addEventListener('click', () => {
        radialMenu.classList.remove('active');
        setTimeout(() => {
          if (target === 'notepad-screen') goToNotepad();
          if (target === 'todo-screen') goToTodo();
          if (target === 'stat-screen') {
            document.getElementById('menu-screen').style.display = 'none';
            showScreen('stat-screen');
          }
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
  const statElement = document.querySelector(`stat[data-stat="${stat}"] span`);
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
  // Grabs all radial menu buttons with a 'data-target' attribute
  const menuButtons = document.querySelectorAll(".menu-item");

  // Add click event listeners to each button
  menuButtons.forEach(button => {
    const targetId = button.dataset.target;

    // Ensure the button actually has a target screen ID
    if (targetId) {
      button.addEventListener("click", () => {
        // Step 1: Hide all screens (notepad, stats, etc.)
        const allScreens = document.querySelectorAll(".notepad-screen, .screen");
        allScreens.forEach(screen => {
          screen.style.display = "none";
        });

        // Step 2: Show the target screen by ID
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
          targetScreen.style.display = "flex"; // Or 'block' depending on your layout
        } else {
          console.warn(`No screen found with ID "${targetId}"`);
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Handle stat increments
  const statScreen = document.getElementById('stat-screen');
  if (statScreen) {
    const incrementButtons = statScreen.querySelectorAll('.increment-btn');
    
    incrementButtons.forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        let value = parseInt(input.value) || 0;
        input.value = value + 1;
        
        // Add a brief highlight effect
        button.classList.remove('clicked');
        void button.offsetWidth; // Trigger reflow
        button.classList.add('clicked');
      });
    });
  }
});

function goToStatScreen() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('todo-screen').style.display = 'none';
  
  showScreen('stat-screen');
}
// Update the event listener for stat screen button if needed
document.addEventListener("DOMContentLoaded", function() {
  const statButton = document.querySelector('.menu-item[data-target="stat-screen"]');
  if (statButton) {
    statButton.addEventListener('click', function() {
      goToStatScreen();
    });
  }
});


// Stats saving and loading functionality - Mobile Optimized

// Function to save all stats to local storage
function saveStats() {
  try {
    const statRows = document.querySelectorAll('.stat-row');
    const stats = {};
    
    statRows.forEach(row => {
      // Extract stat name from the label (remove the colon)
      const statName = row.querySelector('.stat-label').textContent.replace(':', '');
      const statValue = row.querySelector('.stat-input').value;
      stats[statName] = statValue;
    });
    
    // Save to localStorage
    localStorage.setItem('characterStats', JSON.stringify(stats));
    console.log('Stats saved:', stats);
    return true;
  } catch (error) {
    // Handle potential localStorage errors (quota exceeded, private browsing mode, etc.)
    console.error('Error saving stats:', error);
    return false;
  }
}

// Function to load stats from local storage
function loadStats() {
  try {
    const savedStats = localStorage.getItem('characterStats');
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      const statRows = document.querySelectorAll('.stat-row');
      
      statRows.forEach(row => {
        const statName = row.querySelector('.stat-label').textContent.replace(':', '');
        const input = row.querySelector('.stat-input');
        
        // If we have a saved value for this stat, use it
        if (stats[statName] !== undefined) {
          input.value = stats[statName];
        }
      });
      
      console.log('Stats loaded:', stats);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading stats:', error);
    return false;
  }
}

// Function to handle increment button clicks
function setupStatIncrements() {
  const incrementButtons = document.querySelectorAll('.increment-btn');
  
  // Use touchend for better mobile performance
  incrementButtons.forEach(button => {
    // Remove any existing event listeners to prevent duplicates
    button.removeEventListener('click', handleIncrement);
    button.removeEventListener('touchend', handleIncrement);
    
    // Add both click (desktop) and touchend (mobile) events
    button.addEventListener('click', handleIncrement);
    button.addEventListener('touchend', handleIncrement);
  });
  
  // Also save when input values are changed directly
  const statInputs = document.querySelectorAll('.stat-input');
  statInputs.forEach(input => {
    // Remove existing listeners to prevent duplicates
    input.removeEventListener('change', saveStats);
    input.removeEventListener('blur', saveStats);
    
    // Add listeners
    input.addEventListener('change', saveStats);
    input.addEventListener('blur', saveStats);
  });
}

// Separate handler function for increment buttons
function handleIncrement(event) {
  // Prevent ghost clicks on mobile
  event.preventDefault();
  
  const button = this;
  const input = button.previousElementSibling;
  let value = parseInt(input.value) || 0;
  input.value = value + 1;
  
  // Add a brief highlight effect
  button.classList.remove('clicked');
  void button.offsetWidth; // Trigger reflow
  button.classList.add('clicked');
  
  // Save stats after incrementing
  saveStats();
}

// Initialize stats functionality when the document is ready
document.addEventListener("DOMContentLoaded", function() {
  // Set up event listeners for the stat screen
  const statScreen = document.getElementById('stat-screen');
  if (statScreen) {
    // First load saved stats
    loadStats();
    
    // Then set up increment buttons
    setupStatIncrements();
  }
});

// Add event listener when stat screen becomes visible
// This ensures the stats load properly even if DOMContentLoaded already fired
function onStatScreenShow() {
  loadStats();
  setupStatIncrements();
}

// Update the existing showScreen function to call onStatScreenShow
const originalShowScreen = window.showScreen || function() {};
window.showScreen = function(screenId) {
  originalShowScreen(screenId);
  
  if (screenId === 'stat-screen') {
    // Small timeout to ensure the screen is fully displayed
    setTimeout(onStatScreenShow, 50);
  }
};

// Add listeners for app visibility changes (important for iOS)
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    const statScreen = document.getElementById('stat-screen');
    if (statScreen && window.getComputedStyle(statScreen).display !== 'none') {
      loadStats(); // Reload stats when coming back to the app
    }
  }
});


function calculatePlayerLevel() {
  try {
    const savedStats = localStorage.getItem('characterStats');
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      let total = 0;
      let count = 0;
      
      // Calculate sum of all stats
      Object.values(stats).forEach(value => {
        const statValue = parseInt(value);
        if (!isNaN(statValue)) {
          total += statValue;
          count++;
        }
      });
      
      // Calculate the mean (average) if we have stats
      if (count > 0) {
        const level = Math.floor(total / count);
        return level;
      }
    }
    
    // Default level if no stats found
    return 1;
  } catch (error) {
    console.error('Error calculating player level:', error);
    return 1; // Default level on error
  }
}

// Determine player rank based on level
function determinePlayerRank(level) {
  if (level >= 90) return "S Rank";
  if (level >= 75) return "A Rank";
  if (level >= 60) return "B Rank";
  if (level >= 45) return "C Rank";
  if (level >= 30) return "D Rank";
  if (level >= 15) return "E Rank";
  return "F Rank";
}

// Update profile information
function updateProfileInfo() {
  const level = calculatePlayerLevel();
  const rank = determinePlayerRank(level);
  
  // Update DOM elements
  document.getElementById('player-level').textContent = level;
  document.getElementById('player-rank').textContent = rank;
}

// Title management
function showTitleInput() {
  document.getElementById('show-title-input-button').style.display = 'none';
  document.getElementById('title-input-wrapper').style.display = 'flex';
  document.getElementById('title-input').focus();
}

function hideTitleInput() {
  document.getElementById('title-input-wrapper').style.display = 'none';
  document.getElementById('show-title-input-button').style.display = 'inline-block';
}

function addTitle() {
  const input = document.getElementById('title-input');
  const title = input.value.trim();
  
  if (title) {
    const titles = JSON.parse(localStorage.getItem('playerTitles') || '[]');
    titles.push({ text: title });
    localStorage.setItem('playerTitles', JSON.stringify(titles));
    
    input.value = '';
    hideTitleInput();
    loadTitles();
  }
}

function loadTitles() {
  const list = document.getElementById('titles-list');
  list.innerHTML = '';
  const titles = JSON.parse(localStorage.getItem('playerTitles') || '[]');

  titles.forEach((title, index) => {
    const li = document.createElement('li');
    li.classList.add('title-pop-in');

    const icon = document.createElement('span');
    icon.className = 'title-icon';
    icon.textContent = '🎖';

    const span = document.createElement('span');
    span.className = 'title-text';
    span.textContent = title.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-title-btn';
    delBtn.textContent = '×';
    delBtn.onclick = () => {
      li.classList.add('title-pop-out');
      setTimeout(() => {
        titles.splice(index, 1);
        localStorage.setItem('playerTitles', JSON.stringify(titles));
        loadTitles();
      }, 300);
    };

    li.appendChild(icon);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function goToProfileScreen() {
  // Hide all other screens
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('todo-screen').style.display = 'none';
  document.getElementById('stat-screen').style.display = 'none';
  
  // Show profile screen
  showScreen('profile-screen');
  
  // Update profile information
  updateProfileInfo();
  
  // Load titles
  loadTitles();
}

// Add profile screen to radial menu
document.addEventListener("DOMContentLoaded", function() {
  // Set up the gear icon to go to profile
  const gearButton = document.querySelector('.menu-item:nth-child(4)');
  if (gearButton) {
    gearButton.dataset.target = 'profile-screen';
    gearButton.addEventListener('click', function() {
      setTimeout(() => {
        goToProfileScreen();
      }, 300);
    });
  }

  // Prepare profile input event handlers
  const profileScreen = document.getElementById('profile-screen');
  if (profileScreen) {
    // Add any specific event handlers for the profile screen here
    document.getElementById('show-title-input-button').addEventListener('click', showTitleInput);
    
    // Set up title input keypress handler for adding with Enter key
    const titleInput = document.getElementById('title-input');
    titleInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addTitle();
      }
    });
  }
});

  //NEW CHANGES

function showScreen(screenId) {
  const screen = document.getElementById(screenId);
  
  // Clear any previous instances that might be in the DOM
  const allScreens = document.querySelectorAll('.notepad-screen, .screen');
  allScreens.forEach(s => {
    // First hide all screens
    s.style.display = 'none';
    
    // If this is a duplicate of our target screen that got added to menu, remove it
    if (s.id === screenId && s !== screen) {
      s.parentNode.removeChild(s);
    }
  });
  
  // Now show the real screen with proper display property
  // Added profile-screen to flex display type screens
  screen.style.display = (screenId === 'todo-screen' || 
                          screenId === 'stat-screen' || 
                          screenId === 'profile-screen') ? 'flex' : 'block';
  
  screen.classList.add('screen-animate');
  setTimeout(() => screen.classList.remove('screen-animate'), 400);
}
