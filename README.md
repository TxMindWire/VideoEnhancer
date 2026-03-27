# Video Control — dodatek do Firefoksa

Kontroluj jasność i kontrast wszystkich elementów `<video>` na dowolnej stronie.

## Pliki

```
video-control-addon/
├── manifest.json   — konfiguracja dodatku (Manifest V2)
├── content.js      — skrypt wstrzykiwany na strony, stosuje filtry CSS
├── popup.html      — interfejs popup
├── popup.css       — style popup
├── popup.js        — logika popup
└── icon.svg        — ikona (zamień na icon.png przed załadowaniem)
```

## Instalacja (tryb deweloperski)

1. Otwórz Firefox i wejdź na `about:debugging`
2. Kliknij **Ten Firefox** (lub **This Firefox**)
3. Kliknij **Załaduj tymczasowy dodatek...**
4. Wskaż plik `manifest.json` z tego folderu

> Uwaga: Plik `icon.svg` zamień na `icon.png` (48×48 px) — Firefox wymaga formatu PNG dla ikon.

## Działanie

- Suwak **Jasność** — zakres 0.5× – 2× (domyślnie 1×)
- Suwak **Kontrast** — zakres 0.5× – 2× (domyślnie 1×)
- Ustawienia są zapisywane w `browser.storage.local`
- Przycisk **Resetuj** przywraca wartości domyślne
- Badge w nagłówku pokazuje liczbę filmów wykrytych na aktywnej stronie

## Jak działa technicznie

`popup.js` wysyła wiadomości do `content.js` przez `browser.tabs.sendMessage`.  
`content.js` ustawia `element.style.filter = "brightness(X) contrast(Y)"` na każdym `<video>`.
