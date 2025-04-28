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
