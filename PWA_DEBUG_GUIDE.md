# PWA-Installierbarkeit auf Pixel debuggen

## Schritt 1: Chrome DevTools Remote Debugging aktivieren

### Auf dem Pixel:
1. Gehe zu **Einstellungen** → **Entwickleroptionen** (7x auf Buildnummer tippen)
2. Aktiviere **USB-Debugging**
3. Verbinde Pixel mit USB-Kabel

### Auf dem PC:
1. Chrome öffnen → **chrome://inspect**
2. Das Pixel sollte auftauchen
3. Starte den Remote Debugger mit "Inspect"

## Schritt 2: Prüfe auf diese Fehler in Chrome DevTools

### Application Tab:
- **Manifest** Tab: Prüfe, ob alle Icons mit Status 200 laden
- **Service Workers** Tab: Prüfe, ob der Service Worker registriert und aktiviert ist
- **Storage** → **Clear All**: Cache clearing, falls alte Daten im Weg sind

### Console Tab:
- Prüfe auf diese Fehler:
  - `404 on ...manifest.json` → Icon/Manifest nicht erreichbar
  - `Manifest: line X ... error` → Syntax-Fehler im Manifest
  - `Failed to register ServiceWorker` → SW-Problem

### Network Tab:
- Prüfe diese Requests:
  - `GET manifest.json` → Status sollte 200 sein, Content-Type `application/json`
  - `GET 192x192.jpg` → Status 200, Content-Type `image/jpeg`
  - `GET 512x512.jpeg` → Status 200, Content-Type `image/jpeg`
  - `GET service-worker.js` → Status 200, Content-Type `text/javascript`

## Schritt 3: Chrome Install-Prompt triggern

Im Chrome DevTools **Console** eingeben:
```javascript
// beforeinstallprompt Event simulieren (nur wenn nicht automatisch erscheint)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt Event fired!');
  window.deferredPrompt = e;
});

// Oder manuell promten:
if (window.deferredPrompt) {
  window.deferredPrompt.prompt();
}
```

## Schritt 4: Service Worker Status prüfen

Im Console eingeben:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    console.log('Service Worker URL:', reg.scope);
    console.log('State:', reg.installing ? 'installing' : reg.waiting ? 'waiting' : 'active');
  });
});
```

## Bekannte Android-Probleme

### Problem: "Add to Home Screen" Button erscheint nicht
- **Lösung 1**: Mindestens 2 Minuten auf der Seite bleiben (Chrome gibt automatisch einen Prompt)
- **Lösung 2**: In Chrome-Menü → "App installieren" manuell versuchen
- **Lösung 3**: Chrome-Cache löschen: Einstellungen → Datenschutz → Browserdaten löschen → "Alle Zeit"

### Problem: Icons laden nicht
- DevTools → Network prüfen: Sind die JPG/JPEG Dateien 200er Status?
- Icons müssen quadratisch sein (192x192, 512x512)
- Icons müssen ohne Transparenz sein (JPG/JPEG)

### Problem: "Diese App kann nicht installiert werden"
- Service Worker ist nicht aktiviert/registered
- Manifest hat Syntax-Fehler
- Icons fehlen oder sind fehlerhaft

## Schritt 5: Seite für Installation optimieren

1. Öffne die App auf `http://YOUR_IP:8000`
2. Warte 2 Minuten
3. Prüfe, ob oben rechts ein "Installieren"-Button erscheint
4. Falls ja: Klick drauf → "Installieren"
5. Falls nein: Chrome-Menü → "Apps" → "App installieren" probieren

## Zusätzliche Tipps

- **PWA testen mit HTTPS**: Manche Browser-Features funktionieren nur mit HTTPS (z. B. auf GitHub Pages)
- **Lighthouse prüfen**: Chrome DevTools → Lighthouse → PWA checken → Report anschauen
- **Neuen Chrome-Tab probieren**: Manche Settings pro Tab
- **Chrome neustarten**: Manchmal hilft das einfach

---

Falls nach all dem immer noch nicht installierbar:
- Überprüfe Chrome Version (sollte >= 67 sein)
- Versuche die PWA in einem anderen Browser (Firefox, Opera) zu installieren
- Kontrolliere, ob dein Pixel genug Speicherplatz hat
