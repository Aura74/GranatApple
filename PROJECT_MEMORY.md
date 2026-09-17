# Överlämning – GranatApple / TechFlow

Senast uppdaterad: 2026-09-17, Europe/Stockholm.

## Var vi är

Projektet finns i `C:/HEMSIDOR/GranatApple`. Webbplatsen heter **TechFlow – A little more room to live**. Senaste uppdraget med färger, produktkoncept och premiumdesign är genomfört. Användaren bad därefter att spara läget inför en omstart. Det finns ingen beställd återstående implementation från det uppdraget.

## Användarens beslut och önskemål

- En mer enhetlig, exklusiv och personlig design.
- Varmt elfenben `#F4F2EA` som huvudbakgrund.
- Djup skogsgrön `#293C35` för rubriker och primära knappar.
- Salvia `#A8B5A0` för mjuka detaljer och ytor.
- Champagne `#BC9566` för små metalliska accenter.
- Grönsvart `#121D1C` som grund för mörkt tema.
- Starkare första vy med telefoner eller ljusskulptur, kort rubrik och tydlig huvudknapp.
- Samma material genom sidan: pärlemor, borstad metall och salvia.
- Mer luft och ett kortare huvudflöde; samla experimenten under Tech Lab.
- Långsamma ljusreflexer, mjuka knapptryck och diskret glasnavigation.

## Genomförd riktning

Vi valde och implementerade ett **koncept för en personlig planeringsapp**: dagens prioriteringar, fokustid, gemensamma planer och återhämtning. Budskapet är **Plan → Focus → Unwind** och huvudrubriken **A little more room to live.** Merparten av den synliga marknadsföringstexten är på engelska; vissa hjälptexter och demoåterkoppling är på svenska.

- Första vyn kombinerar rubrik, beskrivning, knappen “Find your flow” och tre telefoner. Den gamla helskärmsintron är borttagen och navigationen syns direkt.
- Färgpaletten är samordnad även i telefoner, illustrationer, diagram, chatt och Lottie. Telefonerna har långsamma ljusreflexer som respekterar reducerad rörelse och pausas utanför vyn.
- Huvudordning: `#hero` med `#phones`, `#caring`, `#layers`, `#observatory`, `#pricing`, `#why`, `#tech-lab`, `#cta`, `#footer`.
- Tech Lab är en native `details/summary`, stängd från början. Den innehåller `#lab`, `#stack`, `#explore`, `#capabilities`, `#end`, `#circuit`, `#predictive`, `#rive-demo` och `#lottie-demo`.
- Länkar till innehåll inne i Tech Lab öppnar samlingen automatiskt. Scrollpositioner uppdateras när samlingen öppnas eller stängs. Dolda rubriker använder inte scrollavslöjanden som kan lämna dem osynliga.
- Konceptplaner: **Daily gratis**, **Flow $9/mån**, **Together $15/mån för två**. Texter i prisplaner och chatt har anpassats.
- **Ingen riktig försäljning eller väntelista har kopplats in.** Köpknappar visar demoåterkoppling. E-post i väntelisteformuläret skickas eller sparas inte.

## Viktiga filer

- `index.html`: struktur, texter, telefoner och inline-SVG.
- `css/style.css`: grundtokens och äldre komponentstilar.
- `css/harmony.css`: nya heron, gemensamma material, glasnavigation, Tech Lab och responsiva justeringar; laddas efter övriga stilar.
- `css/premium.css`, `css/atelier.css`, `css/studio.css`, `css/chat.css`: illustrationer och komponenter, med uppdaterade färger.
- `js/harmony.js`: öppning av Tech Lab via sektionslänkar och hash samt layoutuppdatering.
- `js/main.js`: meny, tema, animationer och demoformulär. Meny- och temaknappar har tillgängliga namn även när texten döljs på mobil.
- `js/premium.js`, `js/atelier.js`, `js/studio.js`, `js/rive.js`: befintliga produkt- och demonstrationsinteraktioner.
- `js/chat.js`: uppdaterad konceptbeskrivning och konceptpriser. Offline-reserv finns. `js/apikey.js` är gitignorerad; skriv aldrig nycklar i dokumentation.
- `scripts/build-orbit.cjs`: genererar den egna Lottie-kompositionen till `animations/flow-orbit.json` och `animations/flow-orbit.js`; färgerna har uppdaterats i generatorn också.
- `README.md`: aktuell dokumentation och ändringslogg **3.0, 2026-09-17**.

## Genomförd verifiering

Kontrollerna gjordes med Playwright i installerad Chrome under föregående arbetssteg:

- Bredder 320, 390, 768, 1440 och 1920 px: ingen horisontell scroll i huvudflödet.
- Öppet Tech Lab kontrollerat vid 320, 390, 768 och 1440 px utan horisontell scroll.
- Inga JavaScript-fel i den avslutande kontrollen. Ett fel med `$` i stället för `$$` i scrollavslöjandena hittades och rättades före slutkontrollen.
- En H1 och inga trasiga interna sektionslänkar.
- Ljust/mörkt tema och reducerad rörelse.
- Dygnsval, vecka/månad, prisdemo, väntelistedemo, materialval, ljusringar, Lottie-uppspelning och hastighet samt Focus/Flow/Unwind.
- Direktlänkar in i Tech Lab öppnar samlingen.
- Lokal öppning via `file://`, Enter för att öppna/stänga Tech Lab och Escape för att stänga menyn.
- JavaScript-syntax och `git diff --check` godkända.

Tillfälliga kontrollscript och skärmbilder låg i `C:/Users/larsa/AppData/Local/Temp/techflow-review/`. De är inte projektberoenden och kan försvinna. Inga npm-paket eller testverktyg installerades i projektet.

## Nästa session

1. Läs denna anteckning och kontrollera aktuellt `git status` samt senaste commit.
2. Utgå från att den beställda omarbetningen är klar. Fortsätt med användarens nya önskemål; gör inte om designarbetet från början.
3. Om användaren vill finjustera utseendet, öppna sidan och bedöm aktuell rendering innan ändringar. Skärmbilder från den förra sessionen är bara historik.

Git var rent när denna minnesanteckning började skrivas. Senaste commit var `d7569f3` (`asrta 4`). Designändringarna fanns alltså redan sparade i Git vid det tillfället. Den här sessionen lägger till `AGENTS.md` och `PROJECT_MEMORY.md`; den gör ingen ny designändring och ingen publicering.
