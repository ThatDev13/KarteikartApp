# KarteikartApp

Eine minimalistische PWA zum Lernen mit Karteikarten.

## Features

- Home mit zwei Buttons auf getrennte Seiten: `human.html` und `ai.html`
- Menschliche Themen als einzelne HTML-Dateien in `human/`
- KI-Karten per OpenRouter (Import/Export als JSON)
- Installierbar als PWA (Manifest + Service Worker)
- Offline-Nutzung fuer bereits geoeffnete/cachbare Seiten

## Start

Die App besteht aus statischen Dateien. Oeffne `index.html` in einem lokalen Webserver.

Beispiel:

```bash
python3 -m http.server 8080
```

Dann im Browser auf `http://localhost:8080` gehen.

## KI-Konfiguration

Die KI-Seite nutzt fest die Werte aus `AI.md`:

- Provider: OpenRouter
- API-Key: aus `AI.md`
- Modell: `google/gemma-4-31b-it:free`

Es gibt bewusst kein Eingabefeld fuer API-Key oder Modell.

## Menschliche Karten bearbeiten

Die Karten liegen direkt in den jeweiligen HTML-Dateien:

- `human/mathe.html`
- `human/biologie.html`
- `human/geschichte.html`

Dort einfach das Array `window.TOPIC_CARDS` bearbeiten.
