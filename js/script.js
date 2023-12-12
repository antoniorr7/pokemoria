document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const totalCards = 10;
    let selectedCards = [];
    let matchedPairs = 0;
    let pokemonPairs = [];

    // Función para obtener datos de la API
    async function fetchPokemonData() {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    }

    // Función para mezclar aleatoriamente un array
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

// Función para cargar los nombres de los Pokémon de forma aleatoria
async function loadRandomPokemonNames() {
    const pokemonData = await fetchPokemonData();
    const allPokemonNames = pokemonData.map(pokemon => pokemon.name);
    const randomNames = [];

    while (randomNames.length < totalCards / 2) {
        const randomIndex = Math.floor(Math.random() * allPokemonNames.length);
        const randomName = allPokemonNames[randomIndex];

        // Evitar duplicados
        if (!randomNames.includes(randomName)) {
            randomNames.push(randomName);
        }
    }
    console.log(allPokemonNames)
    return randomNames;
}
async function generateCards() {
    const pokemonNames = await loadRandomPokemonNames();
    const allCards = shuffleArray([...pokemonNames, ...pokemonNames]);
    const gameContainer = document.getElementById('game-container');
    const pairsBar = document.getElementById('pairs-bar');

    const pokemonData = await fetchPokemonData();

    allCards.forEach(name => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = name;

        const image = document.createElement('img');
        image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.findIndex(pokemon => pokemon.name === name) + 1}.png`;

        card.appendChild(image);
        card.addEventListener('click', flipCard);

        gameContainer.appendChild(card);
    });

    // Mostrar las parejas en la barra superior
    pokemonPairs = pokemonNames.map(name => {
        const pairElement = document.createElement('div');
        pairElement.classList.add('pair');
        const pairImage = document.createElement('img');
        pairImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.findIndex(pokemon => pokemon.name === name) + 1}.png`;
        pairElement.appendChild(pairImage);
        pairsBar.appendChild(pairElement);
        return { name, element: pairElement };
    });
}


    // Función para voltear la carta
    function flipCard() {
        if (selectedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            selectedCards.push(this);
    
            if (selectedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }
    // Función para verificar si las cartas coinciden
    function checkMatch() {
        const [card1, card2] = selectedCards;
    
        if (card1.dataset.name === card2.dataset.name) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
    
            // Actualizar la barra de parejas encontradas
            const foundPair = pokemonPairs.find(pair => pair.name === card1.dataset.name);
            foundPair.element.classList.add('found');
    
            if (matchedPairs === totalCards / 2) {
                alert('¡Has ganado!');
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
    
        selectedCards = [];
    }

    // Inicializar el juego
    generateCards();
});

