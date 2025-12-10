const cards = [
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "so"?', answer: 'Konsekutivsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "bevor"?', answer: 'Temporalsatz' },
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "welche"?', answer: 'Relativsatz' },
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "weil"?', answer: 'Kausalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "falls"?', answer: 'Konditionalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "damit"?', answer: 'Finalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "nachdem"?', answer: 'Temporalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "da"?', answer: 'Kausalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "wenn"?', answer: 'Konditionalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "als"?', answer: 'Temporalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "um zu"?', answer: 'Finalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "das"?', answer: 'Finalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "während"?', answer: 'Temporal'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "seit"?', answer: 'Temporalsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "dass"?', answer: 'Konsekutivsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "obwohl"?', answer: 'Konzessivsatz'},
    { question: 'Zu welchem Adverbialsatz gehört die Konjunktion "trotz"?', answer: 'Konzessivsatz'},
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
prevBtn.addEventListener('click', prevCard)

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleCards(cards);
showCard();
