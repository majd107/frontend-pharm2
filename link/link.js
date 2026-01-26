
document.querySelectorAll('.icon-link').forEach(link => {
    link.addEventListener('click', (e) => {
        console.log('Navigating to:', link.href);
    });
});