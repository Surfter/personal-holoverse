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

function goToMenu() {
  document.getElementById('notepad-screen').style.display = 'none';
  document.getElementById('menu-screen').style.display = 'block';
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

