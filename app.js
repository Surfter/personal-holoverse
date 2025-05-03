
window.addEventListener('load', () => {
   setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
  }, 1200); // 1.2 second delay
});

const textarea = document.getElementById('note');

// Load saved note
textarea.value = localStorage.getItem('myNote') || '';

// Save note whenever changed
textarea.addEventListener('input', () => {
    localStorage.setItem('myNote', textarea.value);
});

// PWA install stuff
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('splash').classList.add('fade-out');
    }, 1200);
  });

  function goToNotepad() {
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('notepad-screen').style.display = 'block';
  }

  function goToMenu() {
    document.getElementById('notepad-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'block';
  }
</script>
