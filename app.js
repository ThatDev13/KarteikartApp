const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "google/gemma-4-31b-it:free";

const form = document.getElementById("ai-form");
const statusText = document.getElementById("status");
const deckRoot = document.getElementById("generated-deck");
const exportButton = document.getElementById("export-btn");
const importInput = document.getElementById("import-file");

let generatedCards = [];

init();

function init() {
  if (!form || !statusText || !deckRoot || !exportButton || !importInput) {
    return;
  }

  wireForm();
  wireImportExport();
}

function wireForm() {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const topic = document.getElementById("topic").value.trim();
    const grade = document.getElementById("grade").value.trim();
    const count = Number(document.getElementById("count").value);

    if (!topic || !grade || Number.isNaN(count)) {
      setStatus("Bitte alle Felder korrekt ausfuellen.");
      return;
    }

    setStatus("Karten werden generiert...");
    deckRoot.innerHTML = "";

    try {
      const cards = await generateCards({ topic, grade, count });
      generatedCards = cards;
      renderCards(cards);
      setStatus(`${cards.length} Karten erfolgreich erstellt.`);
    } catch (error) {
      setStatus(`Fehler bei der Generierung: ${error.message}`);
    }
  });
}

function wireImportExport() {
  exportButton.addEventListener("click", () => {
    if (!generatedCards.length) {
      setStatus("Es gibt noch keine KI-Karten zum Exportieren.");
      return;
    }

    const topic = document.getElementById("topic").value.trim() || "Thema";
    const grade = document.getElementById("grade").value.trim() || "X";

    const payload = {
      source: "ai-generated",
      topic,
      grade,
      model: OPENROUTER_MODEL,
      exportedAt: new Date().toISOString(),
      cards: generatedCards,
    };

    downloadJson(`deck-${slug(topic)}-klasse-${slug(grade)}.json`, payload);
    setStatus("Deck exportiert. Du kannst es im Marktplatz teilen.");
  });

  importInput.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);

      if (!payload.cards || !Array.isArray(payload.cards)) {
        throw new Error("Die Datei enthaelt kein gueltiges Kartenformat.");
      }

      generatedCards = sanitizeCards(payload.cards);
      renderCards(generatedCards);
      setStatus(`Import abgeschlossen: ${generatedCards.length} Karten geladen.`);
    } catch (error) {
      setStatus(`Import fehlgeschlagen: ${error.message}`);
    } finally {
      importInput.value = "";
    }
  });
}

async function generateCards({ topic, grade, count }) {
  const prompt = [
    `Erstelle ${count} Lernkarteikarten als JSON fuer das Thema "${topic}" in Klasse ${grade}.`,
    "Antwortformat: Nur ein JSON-Array ohne Markdown.",
    'Jedes Element soll Felder "question", "answer" und optional "hint" enthalten.',
    "Die Fragen sollen altersgerecht, klar und fachlich korrekt sein.",
  ].join(" ");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Du erzeugst ausschliesslich valides JSON fuer Lernkarten. Keine Erklaerungen, kein Markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter-Fehler (${response.status}): ${text.slice(0, 140)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Leere Antwort von der KI erhalten.");

  const parsed = tryParseCardJson(content);
  return sanitizeCards(parsed);
}

function tryParseCardJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const raw = fencedMatch ? fencedMatch[1] : content;

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Konnte kein JSON-Array in der Antwort finden.");
    }

    return JSON.parse(raw.slice(start, end + 1));
  }
}

function sanitizeCards(cards) {
  if (!Array.isArray(cards)) {
    throw new Error("Das Kartenformat muss ein Array sein.");
  }

  const cleaned = cards
    .filter((card) => card && typeof card === "object")
    .map((card) => ({
      question: String(card.question || "").trim(),
      answer: String(card.answer || "").trim(),
      hint: card.hint ? String(card.hint).trim() : "",
    }))
    .filter((card) => card.question && card.answer);

  if (!cleaned.length) {
    throw new Error("Keine verwertbaren Karten gefunden.");
  }

  return cleaned;
}

function renderCards(cards) {
  deckRoot.innerHTML = "";

  cards.forEach((card, index) => {
    const article = document.createElement("article");
    article.className = "flashcard";

    const title = document.createElement("h3");
    title.textContent = `Karte ${index + 1}: ${card.question}`;

    const revealButton = document.createElement("button");
    revealButton.textContent = "Antwort anzeigen";

    const answer = document.createElement("p");
    answer.className = "answer";
    answer.hidden = true;
    answer.textContent = card.answer;

    revealButton.addEventListener("click", () => {
      answer.hidden = !answer.hidden;
      revealButton.textContent = answer.hidden ? "Antwort anzeigen" : "Antwort verbergen";
    });

    article.append(title, revealButton, answer);

    if (card.hint) {
      const hint = document.createElement("p");
      hint.className = "helper";
      hint.textContent = `Hinweis: ${card.hint}`;
      article.append(hint);
    }

    deckRoot.append(article);
  });
}

function downloadJson(fileName, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function setStatus(message) {
  statusText.textContent = message;
}
