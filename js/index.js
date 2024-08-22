
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', e => {
        e.target.classList.add('pressed');
        setTimeout(() => {
            e.target.classList.remove('pressed');
        }, 300);
    });
});

