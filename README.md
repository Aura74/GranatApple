# TechFlow – Intelligent Technology (GranatApple)

Premium landningssida inspirerad av [pomegranate.health](https://pomegranate.health/), byggd i ren HTML, CSS och JavaScript med GSAP-scrollanimationer. Sidan består av två delar: själva **landningssidan** (intro → hero → berättande sektioner → interaktiv telefonfinal och väntelista) och ett **Tech Lab** med egna SVG-illustrationer, Lottie, ett interaktivt datalandskap och interaktiva kort. Allt är demo – inget skickas eller köps på riktigt.

## Tech Stack

| Del | Val | Kommentar |
|-----|-----|-----------|
| Markup/stil/logik | Vanilla HTML5, CSS, ES2022 | Inga ramverk, inga byggverktyg |
| Animation | [GSAP 3.15](https://gsap.com) + ScrollTrigger | Enda biblioteket som laddas direkt |
| Vektoranimation | Egna SVG-scener + [lottie-web 5.13](https://airbnb.io/lottie/) | Lottie-runtime finns lokalt och lazy-laddas tillsammans med den egna animationen |
| Datalandskap | Egen SVG + vanilla JavaScript | Vecka/månad/kvartal med exempeldata, utan diagrambibliotek |
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
│   ├── premium.css     # Telefoner, nätverk, kretskort och rörelsestudier
│   ├── atelier.css     # Ljusringar, kinetisk mobil och Flow Observatory
│   └── studio.css      # Caring, flödesberättelse, 3D-scen, kort, prisplaner och sidfot
├── js/
│   ├── main.js         # Tema, meny, intro, effektväljare, FPS-probe, formulär, GSAP
│   ├── premium.js      # Produktanimationer, SVG-kopplingar och synlighetspaus
│   ├── rive.js         # Lottie-spelare (historiskt filnamn): lazy-load, hastighet, paus
│   ├── vendor/         # Lokal Lottie 5.13.0 + MIT-licens
│   ├── atelier.js      # Valbara ljusringar och datalandskap med periodval
│   ├── studio.js       # Dygnsväxling, materialval, paus och expanderbara kort
│   ├── chat.js         # "Flow" – Gemini-chatt med lokal reservhjärna
│   └── apikey.js       # GITIGNORAD – window.GEMINI_API_KEY
├── images/             # Lokala foton + egen tredimensionell SVG-skulptur
├── animations/         # flow-orbit.json/.js + äldre demoanimationer som arkiv
├── scripts/            # build-orbit.cjs + build-sculpture.cjs: egen grafik
└── README.md
```

## Sektioner

| # | Sektion (id) | Innehåll |
|---|--------------|----------|
| 1 | Intro `#intro` | Helskärm "Lars Asplund" – teckenavslöjande i DM Serif Display, spelas en gång |
| 2 | Hero `#hero` | Lagrade kort, badge, H1, beskrivning |
| 3 | Telefoner `#phones` | Tre metallramade telefoner med kameraö, levande diagram och mjuk svävning |
| 4 | The end of… `#end` | Arbetsplatsdiagram med precisa SVG-kopplingar och animerade signaler |
| 5 | Caring `#caring` | Pärlemorsblomma med svävande notiser. Morning / Afternoon / Evening ändrar tid, text och stämning |
| 6 | Circuit `#circuit` | Mörkt kretskort med chip, kontaktstift, genomföringar och ljuspulser längs banorna |
| 7 | Flow story `#layers` | En sammanhållen illustration: signaler blir ordning genom ett glasprisma. Ersätter de elva diagramkorten |
| 8 | Ecosystem `#stack` | Fem svävande ljusringar, valbara lager och beskrivningar i en gräddvit/mörkgrön miljö |
| 9 | Predictive `#predictive` | Tre mindre telefoner med samma levande skärmgränssnitt |
| 10 | Tech Lab `#lab` | Egen 3D-knut i SVG, belyst i Warm porcelain eller Moonlight silver. Pausbar rörelse |
| 11 | Rörelsestudier `#rive-demo` | Egna SVG-scener: kinetisk mobil i terrakotta/mässing, elbil och citrusglas; varsin pausknapp |
| 12 | Lottie `#lottie-demo` | Orbital Intelligence: egen ljusskulptur med 29 lager, hastighetsval och paus |
| 13 | Flow Observatory `#observatory` | Grönt SVG-datalandskap, tidsfördelning och nyckeltal; periodval uppdaterar all exempeldata |
| 18 | Explore `#explore` | Tre skulpturkort: Analyze, Automate och Connect. Native details/summary för touch och tangentbord |
| 19 | Capabilities `#capabilities` | Asymmetrisk komposition med en ljussfär, molnplattform och metallsköld |
| 20 | Pricing `#pricing` | Tydliga prisplaner med innehållslistor och Pro markerad. Oförändrade priser, demoknappar → toast |
| 21 | What Sets Us Apart `#why` | Böjda gradientkort |
| 22 | Väntelista `#cta` | E-postformulär (demo → toast) + levande telefoner med Focus / Flow / Unwind |
| – | Sidfot `#footer` | Redaktionell avslutning, sektionsnavigering, väntelistelänk och avsändare. Inga platshållarlänkar |

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
| **Essential** | Inga GSAP-tweens. Lottie börjar pausad och kan startas manuellt. SVG-scener och telefoner är stilla. Datalandskap och periodval fungerar utan kontinuerlig animation. Explore-kort fungerar med native details/summary. |
| **Balanced** (standard på svag hårdvara) | Avslöjanden + billiga transform-loopar (svävande kort, pulser). Ingen scroll-scrubbad parallax. |
| **Cinematic** | Samma produktanimationer som Balanced, dessutom sidans scrollavslöjanden. Fri scroll utan scroll-snap. |

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

Sidan fungerar även om `index.html` öppnas direkt (`file://`). Den egna Lottie-kompositionen laddas som ett lokalt script (`animations/flow-orbit.js`) och använder den lokala spelaren i `js/vendor/`; inga fetch-anrop krävs för den. Internet krävs fortfarande för sidans externa typsnitt och GSAP.

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
| Sidfotslänkar | `.footer-navigation` i `index.html` länkar till sidans verkliga sektioner |
| Bygga om 3D-skulpturen | Kör `node scripts/build-sculpture.cjs`; matematiskt renderad geometri sparas som `images/curiosity-sculpture.svg` |

## Mobil / responsivt

Desktop-first med brytpunkter **1200 / 1024 / 768 / 480**; produktillustrationerna anpassas även vid **600 / 360**. Under 1024 px blir tvåkolumnssektionerna en kolumn med texten först; under 768 px blir menyn ett toppark med egen stängknapp och pillerknapparna göms medan den är öppen. Alla tre telefoner visas även vid 320 px. Skärminnehållet skalar med container-enheter (`cqw`); sekundära notiser döljs på små skärmar. Chatten blir fullskärm under 480 px. Explore-korten använder native `details`/`summary`: klick, touch, Enter och mellanslag fungerar utan extra bibliotek.

## Tillgänglighet

Hopplänk, `<main>`, en `<h1>`, rubriker i ordning, `aria-labelledby` på sektioner, riktiga `<a>`/`<button>`, `aria-expanded`/`aria-pressed`/`role="radiogroup"`, `:focus-visible`-ringar, `prefers-reduced-motion` respekteras (både CSS och GSAP), `role="img"` med beskrivningar på SVG-grafik. Ecosystem och Observatory har namngivna knappgrupper, `aria-pressed` och uppläsning av ändrat innehåll.

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

### 2.4 (2026-09-16) – en sammanhängande skulptural kollektion

- Caring har fått en egen pärlemorsblomma, svävande vardagsnotiser och valbara stämningar för morgon, eftermiddag och kväll.
- Diagramväggen ersatt av en lugn flödesberättelse: Gather → Understand → Make room, med ljustrådar genom ett glasprisma.
- Tech Lab har fått en egen geometriskt renderad 3D-knut på sockel. Warm porcelain och Moonlight silver ändrar ljus och material; rörelsen går att pausa.
- Explore använder tre egna skulpturer och native details/summary. Funktionskorten har ersatts av en asymmetrisk komposition med sfär, skivor och sköld.
- Prisplanerna har tydlig hierarki, funktionslistor och en markerad Pro-plan. Priserna är oförändrade. Sidfoten har riktiga sektionslänkar och en tydlig avsändare.
- Gamla animationsfunktioner för borttagna kort rensade. Rörelse pausas utanför skärmen och respekterar Essential och reducerad rörelse.


### 2.3 (2026-09-16) – ljusskulpturer och datalandskap

- "Five vertically integrated layers" ersatt av TechFlow Ecosystem: fem ljusringar med valbara lager, markerad ring och tillhörande beskrivning.
- Skåpbilen ersatt av The art of balance, en egen kinetisk SVG-mobil i terrakotta, mässing och salviagrönt. Paus, synlighet och reducerad rörelse följer sidans gemensamma logik.
- Fyra diagrambibliotek och jämförelsetabellen ersatta av Flow Observatory. Vecka, månad och kvartal uppdaterar landskapet, tidsfördelningen, nyckeltalen och beskrivningarna tillsammans. All data är tydligt märkt som exempeldata.
- Diagrammens externa beroenden och gamla laddningsscript borttagna. Ingen ny runtime eller backend tillagd. Den tidigare Rive-guiden borttagen från rörelsestudierna.
- Kontrollerat i Chrome vid 1440, 768, 390 och 320 px samt i mörkt läge, med reducerad rörelse och via lokal filöppning.


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
