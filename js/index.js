
const buttons = document.querySelectorAll('button');

// Agrega un evento para detectar cuando el usuario presiona un botón
buttons.forEach(button => {
    button.addEventListener('click', e => {
        e.target.classList.add('pressed');
        setTimeout(() => {
            e.target.classList.remove('pressed');
        }, 300);
    });
});

