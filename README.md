# Lars Asplund - TechFlow Landing Page

En modern landningssida inspirerad av [pomegranate.health](https://pomegranate.health/), byggd med ren HTML, CSS och JavaScript med GSAP-animationer.

## Projektöversikt

| Fil | Beskrivning |
|-----|-------------|
| `index.html` | Hela sidstrukturen med alla sektioner |
| `styles.css` | Alla stilar, färger och layout |
| `script.js` | GSAP + ScrollTrigger animationer |
| `charts-demo.js` | Demo-kod för 4 chart-bibliotek |
| `rive-demo.js` | Rive och Lottie animationsinitiering |
| `.gitignore` | Filer som inte ska laddas upp till GitHub |

## Teknik som pomegranate.health använder

| Effekt | Teknik |
|--------|--------|
| Telefonanimationer | **Rive (.riv)** eller Video (MP4) - innehållet i telefonerna (regnbåge, grafer) är animerade Rive-filer |
| Guppande kort & personkort | Rive (.riv filer) - interaktiva vektoranimationer |
| Elektriska kretsar | Rive-animationer |
| Hälsokort med linjer/hjärtan | Rive-animationer |
| Scroll-effekter | Troligen GSAP + ScrollTrigger |
| Flytande menyknappar | CSS `position: fixed` + Vue.js |

> **OBS:** Telefonerna på pomegranate.health har animerat innehåll inuti (t.ex. regnbågen med rörliga prickar). Detta är troligen **Rive-animationer** inbäddade i telefonerna, inte SVG eller video. Rive är ett modernt animationsformat som tillåter interaktiva vektoranimationer.

## Teknik som används i detta projekt

| Effekt | Teknik |
|--------|--------|
| Telefonanimationer | CSS + GSAP ScrollTrigger |
| Guppande kort & personkort | GSAP med sinusrörelse |
| Profilkort med linjer | SVG-linjer + GSAP |
| Elektriska kretsar | SVG + GSAP-animationer |
| Datakort med linjer/hjärtan | SVG + CSS-animationer |
| Isometriska staplade kort | CSS 3D transforms + GSAP |
| Scroll-effekter | GSAP ScrollTrigger |
| Flytande menyknappar | CSS `position: fixed` + Vanilla JS |
| Dropdown-meny | CSS + GSAP-animationer |
| Chart-demos | Chart.js, D3.js, ApexCharts, Frappe Charts |
| Rive-demo | Rive Runtime (@rive-app/canvas) |
| Lottie-demo | Lottie-web (alternativ till Rive) |

## Färgschema

| Färg | Hex | Användning |
|------|-----|------------|
| Primär (Indigo) | `#6366f1` | Knappar, accenter, bakgrunder |
| Primär mörk | `#4f46e5` | Hover-tillstånd |
| Primär ljus | `#818cf8` | Glöd-effekter |
| Bakgrund (Cream) | `#faf8f5` | Sidans bakgrund |
| Text (Mörk) | `#1e1b4b` | Rubriker och text |
| Text (Dämpad) | `#64748b` | Undertext och labels |

## Implementerade effekter

1. **Flytande menyknappar** - Vit till vänster, lila till höger, följer med vid scroll
2. **Dropdown-meny** - Dyker upp när man klickar på "Learn More"
3. **Rubrik "Lars Asplund"** - I hero-sektionen (följer INTE med vid scroll)
4. **Tre telefoner som åker upp** - Börjar nedanför och glider upp vid scroll
5. **Profilkort med SVG-linjer** - Linjer från cirkeln till varje kort, animeras vid scroll
6. **Guppande användarkort** - Svävande upp/ner-animation
7. **Elektriska pulser i kretsen** - Blinkande noder och rörliga pulser
8. **11 animerade datakort** - Grafer, hjärtan, mätare, CPU, nätverk, etc.
9. **Isometriska staplade kort** - 5 3D-kort som faller ner med bounce-effekt
10. **Hover-effekter på telefoner** - Blir större när man hovrar
11. **Footer-telefoner** - Åker upp från botten
12. **Chart-bibliotek demos** - Interaktiva diagram med 4 olika bibliotek
13. **Rive-demo** - Visar hur man använder Rive-animationer
14. **Lottie-alternativ** - Visar Lottie som alternativ till Rive

## Sektioner på sidan

1. **Hero** - Huvudrubrik "Lars Asplund" med bakgrundslager
2. **Telefoner** - Tre telefoner med app-mockups
3. **The end of...** - Text med flytande profilkort och SVG-linjer
4. **Caring about you** - Användarkort med statistik
5. **Designed by...** - Kretskort med elektriska animationer
6. **Multiple layers** - Grid med 11 datakort
7. **Five vertically integrated** - Isometriska staplade kort (3D)
8. **Predictive, preventive** - Tre hoverbara telefoner
9. **Footer** - CTA och tre telefoner
10. **Chart.js Demo** - Linjediagram med 2 datasets
11. **D3.js Demo** - Animerade staplar
12. **ApexCharts Demo** - Grupperat stapeldiagram
13. **Frappe Charts Demo** - Veckostatistik
14. **Jämförelsetabell** - Översikt av alla chart-bibliotek
15. **Rive Demo** - Tre Rive-animationer + instruktioner
16. **Lottie Alternativ** - Lottie-animation som alternativ

## Beroenden (CDN)

### Animationer
- [GSAP 3.12.2](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)
- [GSAP ScrollTrigger](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js)

### Typsnitt
- [Google Fonts: DM Serif Display & Inter](https://fonts.googleapis.com/)

### Chart-bibliotek (för demo-sektionerna)
- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js)
- [D3.js v7](https://cdn.jsdelivr.net/npm/d3@7)
- [ApexCharts](https://cdn.jsdelivr.net/npm/apexcharts)
- [Frappe Charts](https://cdn.jsdelivr.net/npm/frappe-charts@1.6.2)

### Animationsbibliotek
- [Rive Runtime](https://unpkg.com/@rive-app/canvas@2.7.0) - Spelar upp .riv-filer
- [Lottie-web](https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js) - Spelar upp Lottie JSON-animationer

## Datavisualisering

Datakorten (System Health, CPU Load, Network Traffic, etc.) är byggda med **ren HTML, CSS och SVG** - inget externt bibliotek behövs.

### Chart-bibliotek jämförelse

| Bibliotek | Storlek | Svårighetsgrad | Bäst för |
|-----------|---------|----------------|----------|
| **Chart.js** | ~60KB | Lätt | Nybörjare |
| **D3.js** | ~250KB | Svår | Avancerade visualiseringar |
| **ApexCharts** | ~450KB | Medium | Professionella dashboards |
| **Frappe Charts** | ~25KB | Lätt | Enkla, snabba diagram |

### Andra alternativ
- **ECharts** - Apache, ~1MB, många diagramtyper
- **Recharts** - React-baserat
- **Highcharts** - Kommersiellt, professionellt
- **Plotly.js** - WebGL-stöd för stora datamängder

## Hur man kör projektet

1. Öppna `index.html` i en webbläsare
2. Kräver internetanslutning för att ladda CDN-resurser

## VS Code Auto-save

För att aktivera auto-save i VS Code:
1. Öppna **File** → **Preferences** → **Settings**
2. Sök efter "Auto Save"
3. Ändra till `afterDelay` (sparar efter 1 sekund)

Eller lägg till i `settings.json`:
```json
{
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000
}
```

## Git-konfiguration

Mappen `Bilder för Claude Ai att titta på och ta inspiration från/` är exkluderad från Git via `.gitignore`.

## Anpassning

### Ändra färger
Redigera CSS-variablerna i början av `styles.css`:
```css
:root {
    --primary: #6366f1;      /* Ändra huvudfärg */
    --bg-cream: #faf8f5;     /* Ändra bakgrund */
    --text-dark: #1e1b4b;    /* Ändra textfärg */
}
```

### Ändra namn/rubrik
I `index.html`, ändra texten i `<h1 class="site-title">`:
```html
<h1 class="site-title">Ditt Namn</h1>
```

## Om Rive-animationer

Pomegranate.health använder **Rive** för sina animerade telefon-innehåll. Om du vill skapa liknande animationer:

- **Rive Editor**: [rive.app](https://rive.app/) - gratis att använda
- **Rive Runtime**: JavaScript-bibliotek för att spela upp .riv-filer
- **Alternativ**: Lottie (After Effects → JSON) är enklare men mindre interaktivt

### Så här använder du Rive på din webbplats

1. **Skapa animation** i [Rive Editor](https://rive.app/editor)
2. **Exportera** som .riv-fil
3. **Ladda in** med Rive Runtime:

```javascript
const riveInstance = new rive.Rive({
    src: 'path/to/animation.riv',
    canvas: document.getElementById('canvas'),
    autoplay: true,
    onLoad: () => {
        riveInstance.resizeDrawingSurfaceToCanvas();
    }
});
```

### Gratis Rive-animationer

Hitta färdiga animationer på [Rive Community](https://rive.app/community/) - alla är gratis att använda.

## Webbläsarstöd

- Chrome (rekommenderad)
- Firefox
- Safari
- Edge

## Ändringslogg

### Version 1.3
- Lade till Rive demo-sektion med 3 animationer
- Lade till Lottie som alternativ till Rive
- Skapade `rive-demo.js` för att initiera animationer
- Lade till instruktioner för hur man skapar egna Rive-animationer

### Version 1.2
- Lade till 4 chart-bibliotek demo-sektioner
- Lade till isometriska 3D staplade kort
- Lade till SVG-linjer från cirkel till profilkort
- Skapade `.gitignore`
- Lade till 6 nya datakort (CPU, Network, Storage, Requests, Users)

### Version 1.1
- Lade till dropdown-meny
- Flyttade "Lars Asplund" till hero (inte sticky)
- Förbättrade profilkort-positioner

### Version 1.0
- Initial release med alla grundläggande sektioner

## Skapad

Projektet skapades med hjälp av Claude AI, februari 2026.
