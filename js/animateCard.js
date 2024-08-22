let isAnimating = false;
let dragDeltaX = 0;
const swipeThreshold = 80;

function startDrag(event) {
    if (isAnimating) return;

    // Encuentra el elemento más cercano al que se hizo clic (o tocó) que sea un <article>.
    // 'event.target' es el elemento específico que disparó el evento. 
    // '.closest('article')' busca el elemento <article> más cercano a este elemento.
    const currentCard = event.target.closest('article');

    // Si no se encuentra ningún elemento <article>, termina la ejecución de la función.
    // 'if (!currentCard)' verifica si 'currentCard' es falso o no existe.
    if (!currentCard) return;


    // Obtiene la posición horizontal inicial, ya sea del mouse o del primer dedo en una pantalla táctil
    const startX = event.pageX ?? event.touches[0].pageX;

    // Agrega un evento para detectar cuando el usuario mueve el mouse en toda la página
    document.addEventListener('mousemove', onMove);

    // Cuando el usuario suelta el botón del mouse en toda la página
    document.addEventListener('mouseup', onEnd);

    // Cuando el usuario mueve un dedo sobre la pantalla táctil
    document.addEventListener('touchmove', onMove, {
        passive: true // Indica que el evento no va a ser preventivo, mejorando el rendimiento en dispositivos táctiles
    });

    // Cuando el usuario levanta el dedo de la pantalla táctil
    document.addEventListener('touchend', onEnd, {
        passive: true
    });


    // Añadir evento mouseleave
    if (currentCard) {
        currentCard.addEventListener('mouseleave', onEnd);
    }

    function onMove(event) {
        // Obtiene la posición horizontal actual
        const currentX = event.pageX ?? event.touches[0].pageX;

        // Calcula cuánto se ha movido desde la posición inicial
        pullDeltaX = currentX - startX;

        if (pullDeltaX === 0) return;
        isAnimating = true;

        // Calcula el ángulo de rotación basado en la distancia movida
        const deg = pullDeltaX / 10;

        if (currentCard) {

            currentCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
            currentCard.style.cursor = 'grabbing';

            // Calcula la opacidad de los indicadores de elección basándose en el movimiento
            const opacity = Math.abs(pullDeltaX) / 100;
            // Determina si el movimiento es hacia la derecha o hacia la izquierda
            const isRight = pullDeltaX > 0;

            // Selecciona el indicador de elección correcto según la dirección del movimiento
            const choice = isRight
                ? currentCard.querySelector('.choice.like')
                : currentCard.querySelector('.choice.nope');

            choice.style.opacity = opacity;
        }
    }


    function onEnd(event) {
        // Elimina los eventos de movimiento del mouse y toques de pantalla
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // Elimina el evento mouseleave de la tarjeta actual si existe
        if (currentCard) {
            currentCard.removeEventListener('mouseleave', onEnd);
        }

        // Determina si la tarjeta debe ir hacia la derecha o la izquierda
        const decisionMade = Math.abs(dragDeltaX) >= swipeThreshold; // Verifica si se ha alcanzado el umbral de decisión
        const goRight = dragDeltaX >= 0; // Determina la dirección basada en el movimiento horizontal

        if (decisionMade) {
            // Si se tomó una decisión, agrega la clase correspondiente para la animación
            currentCard.classList.add(goRight ? 'go-right' : 'go-left');

            // Elimina la tarjeta del DOM una vez que la animación de transición termine
            currentCard.addEventListener('transitionend', () => {
                currentCard.remove();
            }, {
                once: true // Asegura que este evento se ejecute solo una vez
            });

        } else {
            // Si no se tomó una decisión, restablece la tarjeta a su posición original
            if (currentCard) {
                currentCard.classList.remove(goRight ? 'go-right' : 'go-left'); // Elimina las clases de animación si no se tomó una decisión
                currentCard.classList.add('reset'); // Agrega la clase 'reset' para animar la tarjeta de vuelta a su lugar original
            }
        }

        if (currentCard) {
            // Restablece el estado de la tarjeta después de que la transición de restablecimiento termine
            currentCard.addEventListener('transitionend', () => {
                isAnimating = false;
                dragDeltaX = 0; // Resetea la distancia de arrastre
                currentCard.removeAttribute('style'); // Elimina los estilos en línea
                currentCard.classList.remove('reset'); // Elimina la clase 'reset' una vez que la animación termina
                currentCard.style.cursor = '';
            }, {
                once: true // Asegura que este evento se ejecute solo una vez
            });

            // Restablece la opacidad de los indicadores de elección
            currentCard.querySelector('.choice.like').style.opacity = 0;
            currentCard.querySelector('.choice.nope').style.opacity = 0;
        }
    }
}

// Agrega un evento para detectar cuando el usuario presiona el botón del mouse en cualquier parte de la página
document.addEventListener('mousedown', startDrag);
// Agrega un evento para detectar cuando el usuario toca la pantalla en dispositivos táctiles
document.addEventListener('touchstart', startDrag, {
    passive: true
});

