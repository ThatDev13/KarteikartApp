const cards = [
    { question: '1', answer: 'uno'},
    { question: '2', answer: 'dos'},
    { question: '2', answer: 'dos'},
    { question: '3', answer: 'tres'},
    { question: '4', answer: 'cuatro'},
    { question: '5', answer: 'cinco'},
    { question: '6', answer: 'seis'},
    { question: '7', answer: 'siete'},
    { question: '8', answer: 'ocho'},
    { question: '9', answer: 'nueve'},
    { question: '10', answer: 'diez'},
    { question: '11', answer: 'once'},
    { question: '12', answer: 'doce'},
    { question: '13', answer: 'trece'},
    { question: '14', answer: 'catorce'},
    { question: '15', answer: 'quince'},
    { question: '16', answer: 'dieciséis'},
    { question: '17', answer: 'diecisiete'},
    { question: '18', answer: 'dieciocho'},
    { question: '19', answer: 'diecinueve'},
    { question: '20', answer: 'veinte'},
];

let currentCard = 0;

const cardFront = document.querySelector('.card-front p');
const cardBack = document.querySelector('.card-back p');
const flipBtn = document.getElementById('flip-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function showCard() {
    cardFront.textContent = cards[currentCard].question;
    cardBack.textContent = cards[currentCard].answer;
}

function flipCard() {
    const card = document.querySelector('.card');
    card.classList.toggle('flipped');
}

function nextCard() {
    currentCard = (currentCard + 1) % cards.length;
    showCard();
    const card = document.querySelector('.card');
    card.classList.remove('flipped');
}

function prevCard() {
    currentCard = (currentCard - 1 + cards.length) % cards.length;
    showCard();
}

flipBtn.addEventListener('click', flipCard);
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleCards(cards);
showCard();
