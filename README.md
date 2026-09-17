# TechFlow – A little more room to live

Ett koncept för en personlig planeringsapp: **planera dagen, hitta fokustid och gör plats för återhämtning**. Sidan är byggd i ren HTML, CSS och JavaScript. Den varma paletten i elfenben, skogsgrönt, salvia och champagne återkommer i navigation, telefoner, illustrationer och mörkt läge.

Huvudflödet visar appen direkt, följt av dygnsrytmen, tre enkla steg, veckoöversikt, prisplaner och designfilosofi. Experimenten finns kvar i en öppningsbar **Tech Lab**-samling. Köp och väntelista är demo; inga betalningar eller anmälningar genomförs. **Daily** är gratis i konceptet, **Flow** kostar $9/mån och **Together** $15/mån för två. Detta är föreslagna konceptpriser, inte en lanserad tjänst.

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
| Språk | Engelska i innehåll och gränssnitt (`lang="en"`) | Kodkommentarer på svenska |

Alla CDN-versioner är pinnade (jsDelivr). Ingen Lenis – vanlig scroll känns bäst på svag hårdvara.

## Projektstruktur

```
GranatApple/
├── index.html          # Hela sidan, semantisk struktur, SVG-sprite, before-paint-script
├── css/
│   ├── style.css       # EN stilmall: tokens, bas, nav, alla illustrationer och sektioner i kaskadordning (TOC i toppen)
│   └── chat.css        # Chattwidgeten
├── js/
│   ├── main.js         # Tema, meny, intro, effektväljare, FPS-probe, formulär, GSAP
│   ├── premium.js      # Produktanimationer, SVG-kopplingar och synlighetspaus
│   ├── rive.js         # Lottie-spelare (historiskt filnamn): lazy-load, hastighet, paus
│   ├── vendor/         # Lokal Lottie 5.13.0 + MIT-licens
│   ├── atelier.js      # Valbara ljusringar och datalandskap med periodval
│   ├── studio.js       # Dygnsväxling, materialval, paus och expanderbara kort
│   ├── harmony.js      # Tech Lab, sektionslänkar och layoutuppdateringar
│   ├── chat.js         # "Flow" – Gemini-chatt med lokal reservhjärna
│   └── apikey.js       # GITIGNORAD – window.GEMINI_API_KEY
├── images/             # Lokala foton + egen tredimensionell SVG-skulptur
├── animations/         # flow-orbit.json/.js + äldre demoanimationer som arkiv
├── scripts/            # build-orbit.cjs + build-sculpture.cjs: egen grafik
└── README.md
```

## Sektioner

| Ordning | Sektion | Innehåll |
|---|---|---|
| 1 | Hero `#hero` med `#phones` | Appens budskap, huvudknapp och tre telefoner i samma första vy. Ingen helskärmsintro. |
| 2 | `#caring` | Morgon, eftermiddag och kväll; pärlemorsblomma och växlande exempeltexter. |
| 3 | `#layers` | Plan → Focus → Unwind, illustrerat som tre strömmar genom ett prisma. |
| 4 | `#observatory` | Vecko-, månads- och kvartalsvy med tydligt märkta exempeldata. |
| 5 | `#pricing` | Daily, Flow och Together; demoknappar utan betalning. |
| 6 | `#why` | Designfilosofi, illustrerad i salvia, champagne och silver. |
| 7 | `#tech-lab` | Native details/summary, stängd från början. Innehåller `#lab`, `#stack`, `#explore`, `#capabilities`, `#end`, `#circuit`, `#predictive`, `#rive-demo` och `#lottie-demo`. |
| 8 | `#cta` och `#footer` | Väntelistedemo, interaktiva Focus/Flow/Unwind-telefoner och navigation. |

Länkar till en sektion inne i Tech Lab öppnar samlingen automatiskt, även vid direktlänk eller hashbyte. Öppning/stängning räknar om scrollanimationernas positioner. Dolda rubriker i samlingen får inga scrollavslöjanden; de förblir läsbara när samlingen öppnas.

## Designsystem

Alla tokens och komponenter finns i `css/style.css`; blocket HARMONY längst ner samordnar palett och layout och vinner i kaskaden. `light-dark()` följer `color-scheme` på `<html data-theme>`. Illustrationerna har egna nyanser inom samma materialpalett.

| Token | Ljust | Mörkt |
|-------|-------|-------|
| `--primary` / `--primary-dark` / `--primary-light` | `#293c35` / `#1e3028` / `#a8b5a0` | samma |
| `--bg` | `#f4f2ea` (elfenben) | `#121d1c` (grönsvart) |
| `--surface` / `--surface-2` | `#fcfbf7` / `#e8ebe1` | `#1b2925` / `#24352d` |
| `--text` / `--text-muted` | `#293c35` / `#58685e` | `#f4f2ea` / `#b1bdb2` |
| `--border` | `#d9ddd1` | `#3b4d42` |
| `--sec-*` (äldre sektionsnamn) | `#eceee5` | `#17241f` |
| `--shadow`, `--shadow-lg` | gröntonade skuggor | svarta, djupare |
| `--gold` / champagne | `#bc9566` (små accenter) | samma |

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

Sidan fungerar även om `index.html` öppnas direkt (`file://`). Den egna Lottie-kompositionen laddas som ett lokalt script (`animations/flow-orbit.js`) och använder den lokala spelaren i `js/vendor/`; inga fetch-anrop krävs för den. Internet krävs fortfarande för sidans externa typsnitt och GSAP. Navigationen och Tech Lab fungerar också utan GSAP.

## Anpassning

| Vill du … | Gör så här |
|-----------|-----------|
| Byta färger | Ändra tokens i `:root` i `css/style.css` (båda värdena i `light-dark()`) |
| Ändra Lottie-skulpturen | Ändra `scripts/build-orbit.cjs` och kör `node scripts/build-orbit.cjs`; JSON och webbläsarscript genereras tillsammans |
| Ändra telefonfinalens lägen | Texter i `modes` i `js/premium.js`, färger och tempo i `.finale[data-mode]` i `css/style.css` (blocket PRODUKTILLUSTRATIONER) |
| Byta chattpersona | `SYSTEM_PROMPT` och `localBrain` i `js/chat.js` |
| Koppla väntelistan på riktigt | `initWaitlist()` i `js/main.js` → Klaviyo / Mailchimp / Beehiiv |
| Koppla prisknapparna | `initPlanButtons()` → Stripe Checkout / Snipcart |
| Sidfotslänkar | `.footer-navigation` i `index.html` länkar till sidans verkliga sektioner |
| Bygga om 3D-skulpturen | Kör `node scripts/build-sculpture.cjs` (128 × 16 segment, ~205 KB); matematiskt renderad geometri sparas som `images/curiosity-sculpture.svg` |

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

### 3.1 (2026-09-17) – städning och ett språk
- Fem stilmallar sammanslagna till `css/style.css` i kaskadordning; 461 döda selektorer (intro, diagrambibliotek, café-, trio-, showcase- och curved-kort m.m.) borttagna, oanvända keyframes rensade.
- SVG-element skrivs i korrekt camelCase (`linearGradient`, `radialGradient`, `clipPath`, `feGaussianBlur`); genererade tal avrundade till två decimaler; de långa enradiga HTML-blocken radbrutna.
- Ett språk i gränssnittet: alla aria-labels, knappar, toasts, chattens UI och effektväljaren är nu på engelska liksom innehållet (`lang="en"`). Kodkommentarer är fortsatt svenska.
- Död intro-kod borttagen ur `main.js` och before-paint-scriptet. 3D-knuten omgenererad med färre segment (390 → 205 KB) utan synlig skillnad. Verktygsmappen `.preview/` (104 MB) borttagen.
- Verifierat i Chrome: desktop ljust/mörkt, mobil 412 px, Tech Lab öppet, menyer, chatt, effektlägen – identisk rendering, inga konsolfel.
- Grafikrecepten dokumenterade i `c:\HEMSIDOR\GRAPHICS-RECIPES.md`.

### 3.0 (2026-09-17) – A little more room to live

- Nytt tydligt produktkoncept: personlig planering, fokus och återhämtning. Telefontexter, navigation, planer och chattbeskrivningar följer konceptet.
- Gemensam palett i elfenben, skogsgrönt, salvia och champagne; även skärmar, SVG-illustrationer och den genererade Lottie-kompositionen har samordnats.
- Första vyn kombinerar budskap, huvudknapp och telefoner. Glasnavigationen syns direkt.
- Kortare huvudflöde; nio experimentsektioner samlade under Tech Lab. Befintliga sektionslänkar fungerar fortfarande.
- Långsam ljusreflex över telefonerna, varsamma knapptryck och stöd för reducerad rörelse.
- Verifierat i Chrome vid 320, 390, 768, 1440 och 1920 px: ingen horisontell scroll och inga JavaScript-fel. Mörkt läge, dygnsval, periodval, prisdemo, väntelistedemo, materialval, ljusringar, Lottie-hastighet, finalens lägen och länkar in i Tech Lab kontrollerade.


### 2.5 (2026-09-16) – The TechFlow Signature

- What Sets Us Apart har fått tre egna SVG-objekt, mjuka metalltoner, rundade underkanter och ljus som följer musen. Tangentbord och touch använder vanliga länkar.
- Lutningen avaktiveras vid Essential och reducerad rörelse. Objektens långsamma svävning pausas när sektionen lämnar skärmen.
- Footertextens negativa nederkant borttagen. Rymligare radbox, lite högre kontrast och plats under hela texten gör att ”a little more flow.” visas utan avklippta bokstäver.
- Verifierat vid 320, 390, 768, 1440 och 1920 px: ingen horisontell scroll, hela footertexten synlig, fungerande tangentbordslänk, återställd lutning och inga JavaScript-fel.

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
