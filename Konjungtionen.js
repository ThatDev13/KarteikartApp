const cards = [
    { question: 'denn', answer: 'kausal' },
    { question: 'da', answer: 'kausal' },
    { question: 'weil', answer: 'kausal' },
    { question: 'sodass', answer: 'konsekutiv' },
    { question: 'also', answer: 'konsekutiv' },
    { question: 'deshalb', answer: 'konsekutiv' },
    { question: 'folglich', answer: 'konsekutiv' },
    { question: 'dass', answer: 'konsekutiv' },
    { question: 'damit', answer: 'final' },
    { question: 'um...zu', answer: 'final' },
    { question: 'wenn', answer: 'konditional' },
    { question: 'falls', answer: 'konditional' },
    { question: 'sofern', answer: 'konditional' },
    { question: 'obwohl', answer: 'konzessiv' },
    { question: 'obgleich', answer: 'konzessiv' },
    { question: 'wenngleich', answer: 'konzessiv' },
    { question: 'während', answer: 'adversativ' },
    { question: 'anstatt', answer: 'adversativ' },
    { question: 'außer', answer: 'adversativ' },
    { question: 'jedoch', answer: 'adversativ' },
    { question: 'hingegen', answer: 'adversativ' },
    { question: 'indem', answer: 'modal' },
    { question: 'dadurch, dass', answer: 'modal' },
    { question: 'als', answer: 'temporal' },
    { question: 'nachdem', answer: 'temporal' },
    { question: 'bevor', answer: 'temporal' },
    { question: 'seit', answer: 'temporal' },
    { question: 'bis', answer: 'temporal' },
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
}

function prevCard() {
    currentCard = (currentCard - 1 + cards.length) % cards.length;
    showCard();
}

flipBtn.addEventListener('click', flipCard);
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);

showCard();
