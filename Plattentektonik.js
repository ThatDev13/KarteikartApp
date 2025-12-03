const cards = [
    { question: 'Welche Arten der Plattenverschiebung git es?', answer: 'Subduktion, Transformstörung, Riftvally, Seafloor-Spreeding' },
    { question: 'Was ist die Lithosphäre?', answer: 'Die feste Gesteinshülle der Erde, die aus der Erdkruste und dem obersten Teil des Erdmantels besteht.' },
    { question: 'Woraus bestehen die tektonischen Platten?', answer: 'Aus der Lithosphäre.' },
    { question: 'Was ist die Asthenosphäre?', answer: 'Eine zähplastische Schicht im oberen Erdmantel, auf der die Lithosphärenplatten "schwimmen".' },
    { question: 'Wer hat die Theorie der Plattentektonik maßgeblich entwickelt?', answer: 'Alfred Wegener mit seiner Kontinentalverschiebungstheorie.' },
    { question: 'Was ist Pangäa?', answer: 'Ein Superkontinent, der vor Millionen von Jahren fast alle Landmassen der Erde vereinte.' },
    { question: 'Was treibt die Bewegung der tektonischen Platten an?', answer: 'Konvektionsströme im Erdmantel.' },
    { question: 'Was passiert an einer divergenten Plattengrenze?', answer: 'Zwei Platten bewegen sich voneinander weg, wodurch Magma aufsteigen und neue Kruste bilden kann.' },
    { question: 'Was ist ein Mittelozeanischer Rücken?', answer: 'Ein Unterwasser-Gebirge, an dem Seafloor Spreading (Meeresbodenspreizung) stattfindet.' },
    { question: 'Was passiert an einer konvergenten Plattengrenze?', answer: 'Zwei Platten bewegen sich aufeinander zu.' },
    { question: 'Was ist eine Subduktionszone?', answer: 'Ein Bereich, wo eine ozeanische Platte unter eine andere Platte abtaucht und schmilzt.' },
    { question: 'Was entsteht oft an Subduktionszonen?', answer: 'Tiefseegräben und Vulkanketten.' },
    { question: 'Was geschieht, wenn zwei kontinentale Platten kollidieren?', answer: 'Es falten sich hohe Gebirge auf, wie zum Beispiel der Himalaya.' },
    { question: 'Was ist eine Transformstörung?', answer: 'Eine Grenze, an der sich zwei Platten seitlich aneinander vorbeischieben.' },
    { question: 'Nenne ein berühmtes Beispiel für eine Transformstörung.', answer: 'Die San-Andreas-Verwerfung in Kalifornien.' },
    { question: 'Welche häufige Naturkatastrophe wird durch Plattenbewegungen ausgelöst?', answer: 'Erdbeben.' },
    { question: 'Was ist der "Pazifische Feuerring"?', answer: 'Eine Hufeisenförmige Zone im Pazifik mit sehr vielen Vulkanen und Erdbeben.' },
    { question: 'Wie schnell bewegen sich tektonische Platten ungefähr?', answer: 'Nur wenige Zentimeter pro Jahr, etwa so schnell wie Fingernägel wachsen.' },
    { question: 'Was ist ein Hotspot?', answer: 'Eine besonders heiße Stelle im Erdmantel, die Vulkane mitten auf Platten erzeugen kann, wie bei Hawaii.' },
    { question: 'Wie können Wissenschaftler die Plattenbewegung heute messen?', answer: 'Mit Hilfe von GPS-Satelliten können die Bewegungen auf den Millimeter genau gemessen werden.' },
    { question: 'Was ist Seafloor Spreading?', answer: 'Die Neubildung von ozeanischer Kruste an mittelozeanischen Rücken, die den Meeresboden spreizt.' }
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

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleCards(cards);
showCard();
