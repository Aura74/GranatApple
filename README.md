# TechFlow – Intelligent Technology (GranatApple)

Premium landningssida inspirerad av [pomegranate.health](https://pomegranate.health/), byggd i ren HTML, CSS och JavaScript med GSAP-scrollanimationer. Sidan består av två delar: själva **landningssidan** (intro → hero → berättande sektioner → interaktiv telefonfinal och väntelista) och ett **Tech Lab** med egna SVG-illustrationer, Lottie, fyra diagrambibliotek och interaktiva kort. Allt är demo – inget skickas eller köps på riktigt.

## Tech Stack

| Del | Val | Kommentar |
|-----|-----|-----------|
| Markup/stil/logik | Vanilla HTML5, CSS, ES2022 | Inga ramverk, inga byggverktyg |
| Animation | [GSAP 3.15](https://gsap.com) + ScrollTrigger | Enda biblioteket som laddas direkt |
| Vektoranimation | Egna SVG-scener + [lottie-web 5.13](https://airbnb.io/lottie/) | Lottie-runtime finns lokalt och lazy-laddas tillsammans med den egna animationen |
| Diagram | Chart.js 4.5, D3 7.9, ApexCharts 7.3, Frappe Charts 1.6 | Lazy-laddas per sektion, följer dark mode |
| AI-chatt | Google Gemini (`gemini-flash-lite-latest` → `gemini-flash-latest`) | Offline-läge utan nyckel |
| Typsnitt | DM Serif Display (400 + italic) + Inter (400/500/600) | Google Fonts, `display=swap` |
| Ikoner | Inline SVG-sprite (Lucide-stil) | Inga ikonfonter |

Alla CDN-versioner är pinnade (jsDelivr). Ingen Lenis – vanlig scroll känns bäst på svag hårdvara.

## Projektstruktur

```
GranatApple/
├── index.html          # Hela sidan, semantisk struktur, SVG-sprite, before-paint-script
├── css/
│   ├── style.css       # Design-tokens, alla sektioner, effektnivåer, responsivt (TOC i toppen)
│   ├── chat.css        # Chattwidgeten
│   └── premium.css     # Telefoner, nätverk, kretskort, lager och rörelsestudier
├── js/
│   ├── main.js         # Tema, meny, intro, effektväljare, FPS-probe, formulär, GSAP
│   ├── premium.js      # Produktanimationer, SVG-kopplingar och synlighetspaus
│   ├── rive.js         # Lottie-spelare (historiskt filnamn): lazy-load, hastighet, paus
│   ├── vendor/         # Lokal Lottie 5.13.0 + MIT-licens
│   ├── charts.js       # Fyra diagram: lazy-load, temafärger från CSS-variabler
│   ├── chat.js         # "Flow" – Gemini-chatt med lokal reservhjärna
│   └── apikey.js       # GITIGNORAD – window.GEMINI_API_KEY
├── images/             # Fem lokala foton (Unsplash, se Bildkällor)
├── animations/         # flow-orbit.json/.js + äldre demoanimationer som arkiv
├── scripts/            # build-orbit.cjs: genererar den egna Lottie-kompositionen
└── README.md
```

## Sektioner

| # | Sektion (id) | Innehåll |
|---|--------------|----------|
| 1 | Intro `#intro` | Helskärm "Lars Asplund" – teckenavslöjande i DM Serif Display, spelas en gång |
| 2 | Hero `#hero` | Lagrade kort, badge, H1, beskrivning |
| 3 | Telefoner `#phones` | Tre metallramade telefoner med kameraö, levande diagram och mjuk svävning |
| 4 | The end of… `#end` | Arbetsplatsdiagram med precisa SVG-kopplingar och animerade signaler |
| 5 | Caring `#caring` | Två svävande användarkort med statistik och taggar |
| 6 | Circuit `#circuit` | Mörkt kretskort med chip, kontaktstift, genomföringar och ljuspulser längs banorna |
| 7 | Layers `#layers` | Elva datakort (grafer, ringar, mätare) med SVG-animationer |
| 8 | Stack `#stack` | Fem namngivna tekniklager med djup och mjuk individuell rörelse |
| 9 | Predictive `#predictive` | Tre mindre telefoner med samma levande skärmgränssnitt |
| 10 | Tech Lab `#lab` | Introduktion till komponentlabbet |
| 11 | Rörelsestudier `#rive-demo` | Egna SVG-scener: skåpbil i trekvartsperspektiv, elbil och citrusglas; varsin pausknapp |
| 12 | Lottie `#lottie-demo` | Orbital Intelligence: egen ljusskulptur med 29 lager, hastighetsval och paus |
| 13–16 | Chart.js / D3 / ApexCharts / Frappe | Ett diagram per bibliotek + för- och nackdelar |
| 17 | Jämförelse `#comparison` | Tabell över biblioteken |
| 18 | Hover to Explore `#explore` | Tre kort: Analyze, Automate och Connect (tangentbord + touch stöds) |
| 19 | Built for the Future `#capabilities` | Tre mörka funktionskort |
| 20 | Choose Your Plan `#pricing` | Tre prisplaner (demoknappar → toast) |
| 21 | What Sets Us Apart `#why` | Böjda gradientkort |
| 22 | Väntelista `#cta` | E-postformulär (demo → toast) + levande telefoner med Focus / Flow / Unwind |
| – | Sidfot | Logotyp, ikonlänkar (platshållare), länkar, copyright |

## Designsystem

Alla tokens ligger i `:root` i `css/style.css` och definieras en gång med `light-dark()`; temat växlas med `color-scheme` på `<html data-theme>`.

| Token | Ljust | Mörkt |
|-------|-------|-------|
| `--primary` / `--primary-dark` / `--primary-light` | `#6366f1` / `#4f46e5` / `#818cf8` | samma |
| `--bg` | `#faf8f5` (cream) | `#0d0b1a` |
| `--surface` / `--surface-2` | `#ffffff` / `#f1f5f9` | `#161333` / `#1a1740` |
| `--text` / `--text-muted` | `#1e1b4b` / `#64748b` | `#e0e7ff` / `#94a3b8` |
| `--border` | `#e5e7eb` | `#2d2a5e` |
| `--sec-indigo … --sec-lavender` | sju pastella sektionsbakgrunder | djupa motsvarigheter |
| `--shadow`, `--shadow-lg` | indigo-tonade flerlagersskuggor | svarta, djupare |
| `--gold` | `#fbbf24` (CTA-knapp, café-titlar) | samma |

Typografi: `--font-display` (DM Serif Display) för rubriker, `--font-body` (Inter) för allt annat, rem-baserade storlekar med `clamp()`. Radier: piller (`999px`), kort `1.5rem`, medium `1rem`. Rörelse: `--ease-out: cubic-bezier(.22,1,.36,1)`.

## Effektnivåer (Essential / Balanced / Cinematic)

Reglaget nere till vänster sätter `data-perf` på `<html>` (sparas i `localStorage` som `tf:perfMode`). Väljs inget läge avgör before-paint-scriptet automatiskt: `prefers-reduced-motion` → Essential, ≤4 kärnor / ≤4 GB / Save-Data → Balanced, annars Cinematic. I automatiskt Cinematic mäts bildfrekvensen i 2 s efter laddning; under 45 fps erbjuds Balanced via en toast.

| Nivå | Vad händer |
|------|------------|
| **Essential** | Inga GSAP-tweens. Lottie börjar pausad och kan startas manuellt. SVG-scener och telefoner är stilla. Diagram utan animation. Café-kort via CSS-hover. |
| **Balanced** (standard på svag hårdvara) | Avslöjanden + billiga transform-loopar (svävande kort, pulser). Ingen scroll-scrubbad parallax. |
| **Cinematic** | Samma produktanimationer som Balanced, dessutom scrollstyrd introduktion av användarkorten. Fri scroll utan scroll-snap. |

GSAP-loopar pausas via ScrollTrigger när deras sektion är utanför skärmen. Produktillustrationerna i `premium.js` använder Web Animations API och CSS; de pausas med IntersectionObserver, när fliken döljs och vid reducerad rörelse. SVG-linjerna i nätverket mäts från de verkliga kortkanterna med ResizeObserver, utan layoutmätningar i animationsloopen. Byte av nivå laddar om sidan (intron hoppas då över via `sessionStorage`).

## AI-chatten "Flow"

`js/chat.js` följer portföljens standardmönster: nyckeln läses från gitignorade `js/apikey.js` (`window.GEMINI_API_KEY`), modellkedjan provar `gemini-flash-lite-latest` före `gemini-flash-latest`, varje anrop har 12 s `AbortController`-timeout, ingen `thinkingConfig` skickas, och svaren HTML-escapas innan `**fetstil**` renderas. Saknas nyckeln eller svarar API:t inte går chatten i **offline-läge** med färdiga svar om sidan (statuspricken blir guld). Systemprompten beskriver TechFlow som demo, prisplanerna, effektlägena och tekniken.

Ny nyckel: <https://aistudio.google.com/apikey> → klistra in i `js/apikey.js`. Publicerad på GitHub Pages/Azure körs chatten i offline-läge eftersom `apikey.js` aldrig deployas (en riktig publik chatt kräver en backend-proxy).

## Hur man kör

```bash
# Rekommenderat – lokala .riv/.json-filer kräver http://
npx serve .
# eller
npx live-server
```

Sidan fungerar även om `index.html` öppnas direkt (`file://`). Den egna Lottie-kompositionen laddas som ett lokalt script (`animations/flow-orbit.js`) och använder den lokala spelaren i `js/vendor/`; inga fetch-anrop krävs för den. Internet krävs fortfarande för sidans externa typsnitt, GSAP och diagrambibliotek.

## Anpassning

| Vill du … | Gör så här |
|-----------|-----------|
| Byta färger | Ändra tokens i `:root` i `css/style.css` (båda värdena i `light-dark()`) |
| Byta namn i intron | `.splash__name` i `index.html` – JS delar upp texten i tecken automatiskt |
| Ändra Lottie-skulpturen | Ändra `scripts/build-orbit.cjs` och kör `node scripts/build-orbit.cjs`; JSON och webbläsarscript genereras tillsammans |
| Ändra telefonfinalens lägen | Texter i `modes` i `js/premium.js`, färger och tempo i `.finale[data-mode]` i `css/premium.css` |
| Byta chattpersona | `SYSTEM_PROMPT` och `localBrain` i `js/chat.js` |
| Koppla väntelistan på riktigt | `initWaitlist()` i `js/main.js` → Klaviyo / Mailchimp / Beehiiv |
| Koppla prisknapparna | `initPlanButtons()` → Stripe Checkout / Snipcart |
| Riktiga sidfotslänkar | `.footer__icons` och `.footer__links` i `index.html` är platshållare (`href="#"`) |

## Mobil / responsivt

Desktop-first med brytpunkter **1200 / 1024 / 768 / 480**; produktillustrationerna anpassas även vid **600 / 360**. Under 1024 px blir tvåkolumnssektionerna en kolumn med texten först; under 768 px blir menyn ett toppark med egen stängknapp och pillerknapparna göms medan den är öppen. Alla tre telefoner visas även vid 320 px. Skärminnehållet skalar med container-enheter (`cqw`); sekundära notiser döljs på små skärmar. Chatten blir fullskärm under 480 px. Hover-effekter körs bara på `(hover: hover) and (pointer: fine)`; café-korten öppnas med tryck på touch.

## Tillgänglighet

Hopplänk, `<main>`, en `<h1>`, rubriker i ordning, `aria-labelledby` på sektioner, riktiga `<a>`/`<button>`, `aria-expanded`/`aria-pressed`/`role="radiogroup"`, `:focus-visible`-ringar, `prefers-reduced-motion` respekteras (både CSS och GSAP), `role="img"` + `aria-label` på canvas/SVG-diagram, tabell med `<caption>` och `scope`.

## Bildkällor

Foton från [Unsplash](https://unsplash.com/license) (fri användning, attribution uppskattas), nedladdade lokalt 2026-09-14:

| Fil | Unsplash-id |
|-----|-------------|
| `images/analytics-dashboard.jpg` | photo-1551288049-bebda4e38f71 |
| `images/automation-robot.jpg` | photo-1555255707-c07966088b7b |
| `images/plan-starter.jpg` | photo-1551434678-e076c223a692 |
| `images/plan-pro.jpg` | photo-1460925895917-afdab827c52f |
| `images/plan-enterprise.jpg` | photo-1504384308090-c894fdcc538d |

De äldre Rive-filerna (`vehicles`, `off_road_car_v7`, `juice_v7`) och Lottie-filen `gift.json` är sparade som arkiv och laddas inte längre. De kommer ursprungligen från Rive respektive LottieFiles. `flow-orbit.json` är egen grafik, genererad av `scripts/build-orbit.cjs`. Den lokala Lottie-spelarens MIT-licens finns i `js/vendor/lottie.LICENSE.md`.

## Webbläsarstöd

Chrome/Edge 123+, Firefox 120+, Safari 17.5+ (kräver `light-dark()`). Äldre webbläsare får ljust tema utan mörka varianter men i övrigt fungerande sida.

## Ändringslogg

### 2.2 (2026-09-15) – interaktiv final och rörelsestudier

- Sluttelefonerna har nu egna skärmar med agenda, orbital form, vågform och radar. Focus, Flow och Unwind ändrar innehåll, färger och tempo tillsammans.
- Tredje Explore-kortet Connect använder en befintlig lokal bild och samma hover-, fokus- och touchfunktion som de två andra.
- Lottie-presenten ersatt av en egen komposition med 29 lager och en sömlös sexsekundersloop. Drift / Flow / Pulse styr verklig uppspelningshastighet; pausknappen och reducerad rörelse respekteras.
- Skåpbilen ersatt av en egen SVG-illustration med karossytor, glasreflexer, belysning, skuggor och rörliga hjul.
- Lottie-runtime och bilddata finns lokalt. Inga nya externa konton eller backendfunktioner behövs.
- Kontrollerat i Chrome vid 1440, 768, 390 och 320 px: inga JavaScript-fel eller horisontella överflöden. Lägesväxling, Explore på mobil, Lotties faktiska bildrutor/hastighet/paus, reducerad rörelse och lokal öppning via `file://` verifierade.

### 2.1 (2026-09-15) – produktillustrationer

- Nya telefonramar, kameraö, skärmnavigering och animerade staplar, ringar och kurvor i båda telefongrupperna.
- Nätverksdiagram med responsivt uppmätta kopplingar; stabila kort och signaler som följer linjerna.
- Sammanhängande SVG-kretskort med komponenter och ljuspulser, utan extra animationsbibliotek.
- Lugnare datakort med gemensamma ytor och tydligare etiketter; namngivna tekniklager ersätter de platta isometriska korten.
- Egna animerade SVG-illustrationer av elbil och citrusglas, med tillgängliga pausknappar.
- Telefonernas konkurrerande GSAP-transformer borttagna. Rive/Lottie återupptar synliga animationer efter flikbyte. Dolt Rive-spelreglage respekterar `hidden`.
- Visuellt kontrollerat i Chrome vid 1440, 390 och 320 px, inklusive mörkt tema och reducerad rörelse. Ingen backend tillagd.

### 2.0 (2026-09-14) – omstrukturering
- Ny mappstruktur (`css/`, `js/`, `images/`, `animations/`), semantisk HTML utan inline-stilar, SVG-sprite
- Dark mode via `data-theme` satt före första rendering; alla kort/taggar har mörka varianter
- Effektnivåer Essential/Balanced/Cinematic med FPS-probe; loopar pausas utanför skärmen
- AI-chatten Flow (Gemini + offline-läge)
- Lazy-laddade bibliotek (~2 MB mindre vid start), temamedvetna diagram
- Intron omdesignad i sidans typografi; Splitting.js, Font Awesome, Ionicons och tre extra typsnitt borttagna
- Dubbla sidfötter → en väntelistesektion + en sidfot; väntelisteformulär
- Buggar: `prefers-reduced-motion` gjorde innehåll osynligt, `100vw`-padding gav horisontell scroll, död `juice.riv`, MotionPath utan plugin

### 1.3 – Rive-demo + Lottie · 1.2 – chart-demos, isometriska kort · 1.1 – dropdown-meny · 1.0 – första versionen
