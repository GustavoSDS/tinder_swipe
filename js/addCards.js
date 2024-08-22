const cards = document.querySelector('.cards');
// Obtiene los datos de un archivo JSON y los agrega a la página, en el elemento <cards>
fetch('./assets/data.json')
    .then(response => response.json())
    .then(data => {
        data.cards.forEach(card => {
            const profile = document.createElement('article');

            profile.innerHTML =
                `<img src="./assets/photos/${card.image}" alt="${card.name}">
            <div class="info">
                <h2>${card.name} 
                    <span class="age">${card.age}</span>
                </h2>
                <span ${card.active ? 'class="active"' : ''}>
                    ${card.active
                    ? 'NOW 🟢'
                    : 'INACTIVE 🔴'
                }
                </span>
            </div>
            <span class="choice nope">NOPE</span>
            <span class="choice like">LIKE</span>
            `;

            cards.appendChild(profile);
        });
    });

