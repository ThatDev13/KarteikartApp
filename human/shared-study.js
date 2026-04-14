const state = {
  index: 0,
  reveal: false,
};

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const hintEl = document.getElementById("hint");
const progressEl = document.getElementById("progress");
const revealBtn = document.getElementById("reveal");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

if (Array.isArray(window.TOPIC_CARDS) && window.TOPIC_CARDS.length) {
  window.TOPIC_CARDS = shuffleCards(window.TOPIC_CARDS.slice());
}

if (!Array.isArray(window.TOPIC_CARDS) || !window.TOPIC_CARDS.length) {
  questionEl.textContent = "Keine Karten gefunden.";
  revealBtn.disabled = true;
  nextBtn.disabled = true;
  prevBtn.disabled = true;
} else {
  render();
  wireControls();
}

function wireControls() {
  revealBtn.addEventListener("click", () => {
    state.reveal = !state.reveal;
    render();
  });

  nextBtn.addEventListener("click", () => {
    state.index = (state.index + 1) % window.TOPIC_CARDS.length;
    state.reveal = false;
    render();
  });

  prevBtn.addEventListener("click", () => {
    state.index = (state.index - 1 + window.TOPIC_CARDS.length) % window.TOPIC_CARDS.length;
    state.reveal = false;
    render();
  });
}

function render() {
  const card = window.TOPIC_CARDS[state.index];
  progressEl.textContent = `Karte ${state.index + 1} von ${window.TOPIC_CARDS.length}`;
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;
  answerEl.hidden = !state.reveal;
  revealBtn.textContent = state.reveal ? "Antwort verbergen" : "Antwort zeigen";

  if (card.hint) {
    hintEl.hidden = false;
    hintEl.textContent = `Hinweis: ${card.hint}`;
  } else {
    hintEl.hidden = true;
    hintEl.textContent = "";
  }
}

function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
