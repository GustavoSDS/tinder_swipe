const cards = document.querySelector('.cards');
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data.cards.forEach(card => {
            const profile = document.createElement('article');

            profile.innerHTML =
                `<img src="${card.image}" alt=${card.name}>                
            <h2>${card.name} 
            <span ${card.active ? 'class="active"' : ''}>
                ${card.active
                    ? 'NOW 🟢'
                    : 'INACTIVE 🔴'
                }
            </span>
           </h2>
            <span class="choice nope">NOPE</span>
            <span class="choice like">LIKE</span>
            `;

            cards.appendChild(profile);
        });
    });

