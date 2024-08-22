let isAnimating = false;
let pullDeltaX = 0;
const threshold = 80;

function starDrag(event) {
    if (isAnimating) return;

    const actualCard = event.target.closest('article');
    if (!actualCard) return;

    const startX = event.pageX ?? event.touches[0].pageX;

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, {
        passive: true
    });
    document.addEventListener('touchend', onEnd, {
        passive: true
    });

    // Añadir evento mouseleave
    if (actualCard) {
        actualCard.addEventListener('mouseleave', onEnd);
    }

    function onMove(event) {
        const currentX = event.pageX ?? event.touches[0].pageX;
        pullDeltaX = currentX - startX;

        if (pullDeltaX === 0) return;

        isAnimating = true;
        const deg = pullDeltaX / 10;
        if (actualCard) {
            actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
            actualCard.style.cursor = 'grabbing';

            const opacity = Math.abs(pullDeltaX) / 100;
            const isRight = pullDeltaX > 0;

            const choice = isRight
                ? actualCard.querySelector('.choice.like')
                : actualCard.querySelector('.choice.nope');
            
            choice.style.opacity = opacity;
        }
    }

    function onEnd(event) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // Quitar el evento mouseleave cuando se termina la animación
        if (actualCard) {
            actualCard.removeEventListener('mouseleave', onEnd);
        }

        // Restablecer la animación después de un breve retraso
        //TODO: Hacer que el retraso sea variable
        const decisionMade = Math.abs(pullDeltaX) >= threshold;
        const goRight = pullDeltaX >= 0;

        if (decisionMade) {

            actualCard.classList.add(goRight ? 'go-right' : 'go-left');

            actualCard.addEventListener('transitionend', () => {
                actualCard.remove();
            }, {
                once: true
            });

        } else {
            if (actualCard) {
                actualCard.classList.remove(goRight ? 'go-right' : 'go-left');
                actualCard.classList.add('reset');
            }
        }

        if (actualCard) {
            actualCard.addEventListener('transitionend', () => {
                isAnimating = false;
                pullDeltaX = 0;
                actualCard.removeAttribute('style');
                actualCard.classList.remove('reset');
                actualCard.style.cursor = '';
            }, {
                once: true
            });
            actualCard.querySelector('.choice.like').style.opacity = 0;
            actualCard.querySelector('.choice.nope').style.opacity = 0;            
        }

    }

}

document.addEventListener('mousedown', starDrag);
document.addEventListener('touchstart', starDrag, {
    passive: true
});
