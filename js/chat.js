/* ==========================================================================
   TECHFLOW – chat.js
   "Flow" – AI-assistent driven av Google Gemini med lokal reservhjärna.

   Nyckeln läses från js/apikey.js (GITIGNORAD). Saknas den, eller svarar
   inte API:t, kör Flow i offline-läge med färdiga svar om sidan.
   Mönstret är samma som i portföljens övriga chattar (LALilaTech/Cullen):
   flash-lite först, 12 s timeout per modell, ingen thinkingConfig.
   ========================================================================== */
(() => {
    'use strict';

    /* ---------- Gemini ---------- */
    const GEMINI_API_KEY = window.GEMINI_API_KEY || '';
    const GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
    const geminiUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const REQUEST_TIMEOUT = 12000;

    const SYSTEM_PROMPT = `Du är Flow – en vänlig, kunnig och kortfattad AI-assistent på TechFlow-sidan.

Om sidan:
- TechFlow är en fiktiv produkt på en demo-/portfoliosida byggd av Lars Asplund, en svensk webbutvecklare. Sidan är inspirerad av pomegranate.health och visar upp premium webbdesign – den säljer inget på riktigt.
- Konceptet TechFlow: "A little more room to live" – en personlig planeringsapp för dagens prioriteringar, fokustid, gemensamma planer och återhämtning. Funktionerna presenteras som ett koncept, inte en lanserad produkt.
- Konceptpriser: **Daily gratis** (tre dagliga prioriteringar, dagsplan och kvällsreflektion), **Flow $9/mån** (Daily, fokuspass, rutiner och veckoöversikt), **Together $15/mån för två** (Flow för två, gemensamma planer och egna rutiner). Knapparna är demoknappar.
- Väntelistan längst ner är också en demo – inget skickas.

Tekniken bakom sidan (fråga gärna om den):
- Ren HTML, CSS och JavaScript – inga ramverk, inga byggverktyg.
- GSAP + ScrollTrigger för scrollanimationer, egna SVG-skulpturer och Lottie för vektoranimationer. TechFlow Ecosystem har fem valbara ljusringar. Flow Observatory visar ett eget SVG-datalandskap med vecka, månad och kvartal samt tydligt märkta exempeldata. Inga externa diagrambibliotek behövs.
- Modern CSS: light-dark(), :is(), clamp(), logiska egenskaper, CSS-variabler för hela designsystemet.
- Mörkt läge (knappen uppe till höger) och tre effektnivåer – **Essential**, **Balanced** och **Cinematic** – via reglaget nere till vänster, så att äldre datorer kan skruva ner animationerna.
- Du själv körs via Google Gemini; utan API-nyckel kör du i offline-läge.

Regler:
- Svara på samma språk som användaren (svenska eller engelska).
- Var kort: 1–4 meningar om inte användaren ber om mer. Använd **fetstil** för viktiga ord.
- Var ärlig om att TechFlow är en demo. Hitta inte på funktioner, priser eller kontaktuppgifter som inte nämns här.
- Håll tonen varm, professionell och aldrig säljig.`;

    /* ---------- DOM ---------- */
    const fab = document.getElementById('chat-fab');
    const widget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('chat-close');
    const clearBtn = document.getElementById('chat-clear');
    const messagesEl = document.getElementById('messages');
    const chatBox = document.getElementById('chat-box');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingEl = document.getElementById('typing-indicator');
    const suggestionsEl = document.getElementById('suggestions');
    const statusText = document.getElementById('chat-status-text');

    if (!fab || !widget || !messagesEl || !form || !input || !sendBtn) return;

    /* ---------- Tillstånd ---------- */
    let isTyping = false;
    let history = [];
    let messageCount = 0;
    let apiAvailable = GEMINI_API_KEY.length > 0;
    let hasOpened = false;
    const instant = document.documentElement.dataset.perf === 'essential'
        || matchMedia('(prefers-reduced-motion: reduce)').matches;

    messagesEl.setAttribute('aria-live', 'polite');

    function setStatus() {
        widget.classList.toggle('is-offline', !apiAvailable);
        if (statusText) statusText.textContent = apiAvailable ? 'Online' : 'Offline-läge';
    }

    /* ---------- Gemini-anrop med modellkedja + timeout ---------- */
    async function callAI(userMessage) {
        history.push({ role: 'user', parts: [{ text: userMessage }] });

        const body = {
            contents: history,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.8, topP: 0.95, topK: 40, maxOutputTokens: 1024 },
        };

        let lastError = null;
        for (const model of GEMINI_MODELS) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
            try {
                const response = await fetch(geminiUrl(model), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
                    body: JSON.stringify(body),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const err = await response.json().catch(() => null);
                    lastError = new Error(err?.error?.message || `HTTP ${response.status}`);
                    continue;
                }
                const data = await response.json();
                /* Tänkande/MAX_TOKENS-svar kan sakna parts – parsa defensivt */
                const parts = data.candidates?.[0]?.content?.parts || [];
                const text = parts.map((p) => p.text || '').join('').trim();
                if (!text) {
                    lastError = new Error('Tomt svar');
                    continue;
                }
                history.push({ role: 'model', parts: [{ text }] });
                if (history.length > 40) {
                    history = history.slice(-40);
                    while (history.length && history[0].role !== 'user') history.shift();
                }
                return text;
            } catch (err) {
                lastError = err;
            } finally {
                clearTimeout(timer);
            }
        }

        history.pop();
        throw lastError || new Error('Okänt fel');
    }

    /* ---------- Lokal reservhjärna ---------- */
    const localBrain = [
        {
            triggers: ['hej', 'hallå', 'tjena', 'hello', 'hi', 'hey', 'god morgon', 'good morning'],
            responses: [
                'Hej! Jag är **Flow**. Fråga mig om TechFlow, priserna eller hur sidan är byggd.',
                'Hello! I\'m **Flow** – ask me about TechFlow, the plans, or the tech behind this page.',
            ],
        },
        {
            triggers: ['vad är techflow', 'what is techflow', 'techflow', 'om sidan', 'about'],
            responses: [
                'TechFlow är ett **appkoncept för lugnare vardagsplanering** av Lars Asplund. Planera dagen, hitta fokustid och gör plats för återhämtning. Sidan är en demo.',
                'TechFlow is a **personal planning app concept** by Lars Asplund. Plan your day, find your focus and make room to unwind. This is a demo.',
            ],
        },
        {
            triggers: ['pris', 'kostar', 'plan', 'price', 'cost', 'how much', 'prenumeration', 'subscription'],
            responses: [
                'Konceptpriserna är **Daily gratis**, **Flow $9/mån** och **Together $15/mån för två**. Se prisplanerna på sidan. Knapparna är demo och startar ingen prenumeration.',
                'The concept plans are **Daily free**, **Flow $9/mo** and **Together $15/mo for two**. See the plans on this page. The buttons are demos and do not start a subscription.',
            ],
        },
        {
            triggers: ['byggd', 'teknik', 'kod', 'gsap', 'rive', 'lottie', 'ramverk', 'built', 'tech', 'stack', 'framework', 'chart', 'diagram'],
            responses: [
                'Ren **HTML, CSS och JavaScript** – inga ramverk. **GSAP + ScrollTrigger** sköter scrollanimationerna, och egna **SVG-skulpturer** och **Lottie** ger rörelse. Utforska fem ljusringar i **TechFlow Ecosystem** eller byt tidsperiod i **Flow Observatory**, ett eget datalandskap med exempeldata.',
                'Plain **HTML, CSS and JavaScript** – no frameworks. **GSAP + ScrollTrigger** drive the scroll animations, with custom **SVG sculptures** and **Lottie** for motion. Explore five light rings in **TechFlow Ecosystem** or change the period in **Flow Observatory**, a custom data landscape with illustrative data.',
            ],
        },
        {
            triggers: ['mörkt', 'dark', 'ljust', 'light mode', 'tema', 'theme'],
            responses: [
                'Knappen **Dark mode** uppe till höger växlar tema. Valet sparas i webbläsaren och sidan följer annars systemets inställning.',
                'Use the **Dark mode** button in the top-right corner. Your choice is remembered; otherwise the page follows your system setting.',
            ],
        },
        {
            triggers: ['effekt', 'prestanda', 'laggar', 'seg', 'hackar', 'animation', 'performance', 'slow', 'essential', 'balanced', 'cinematic'],
            responses: [
                'Reglaget nere till vänster har tre effektnivåer: **Essential** (nästan stilla), **Balanced** (mjuka avslöjanden) och **Cinematic** (allt inklusive parallax). Känns sidan seg – välj Essential eller Balanced.',
                'The slider button in the bottom-left offers **Essential**, **Balanced** and **Cinematic**. If the page feels sluggish, pick Essential or Balanced.',
            ],
        },
        {
            triggers: ['lars', 'vem har', 'who made', 'who built', 'utvecklare', 'developer'],
            responses: [
                'Sidan är byggd av **Lars Asplund**, svensk webbutvecklare, som en del av hans portfolio med premium demo-sajter.',
                'This page was built by **Lars Asplund**, a Swedish web developer, as part of his portfolio of premium demo sites.',
            ],
        },
        {
            triggers: ['kontakt', 'väntelista', 'waiting list', 'contact', 'e-post', 'email', 'mail'],
            responses: [
                'Längst ner finns **väntelistan** – men den är en demo och skickar inget. I en riktig lansering kopplas den till t.ex. Klaviyo eller Mailchimp.',
                'There\'s a **waiting list** at the bottom – it\'s a demo and doesn\'t send anything. In production it would connect to Klaviyo or Mailchimp.',
            ],
        },
        {
            triggers: ['tack', 'tackar', 'thanks', 'thank you'],
            responses: ['Varsågod! Hör av dig om du undrar något mer.', 'You\'re welcome – anything else, just ask.'],
        },
    ];

    const localFallbacks = [
        'Jag kör just nu i **offline-läge** och kan svara på frågor om TechFlow, priserna, effektlägena och tekniken bakom sidan.',
        'I\'m in **offline mode** right now – I can answer questions about TechFlow, the plans, the effect levels and the tech behind this page.',
    ];

    function localResponse(text) {
        const normalized = text.toLowerCase().replace(/[?!.,]/g, '');
        for (const entry of localBrain) {
            if (entry.triggers.some((t) => normalized.includes(t))) {
                return entry.responses[Math.floor(Math.random() * entry.responses.length)];
            }
        }
        return localFallbacks[Math.floor(Math.random() * localFallbacks.length)];
    }

    /* ---------- Rendering ---------- */
    /* HTML-escapa först – modell-/felsvar får aldrig injicera taggar */
    function formatText(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    const timestamp = () => new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

    function iconSvg(id) {
        return `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;
    }

    function addMessage(text, sender) {
        document.getElementById('chat-welcome')?.remove();

        const group = document.createElement('div');
        group.className = `chat__msg chat__msg--${sender}`;

        const meta = document.createElement('div');
        meta.className = 'chat__msg-meta';
        meta.innerHTML = `${iconSvg(sender === 'bot' ? 'i-bot' : 'i-user')}<span>${sender === 'bot' ? 'Flow' : 'Du'}</span>`;

        const bubble = document.createElement('div');
        bubble.className = 'chat__bubble';
        if (sender === 'bot') bubble.innerHTML = formatText(text);
        else bubble.textContent = text;

        const time = document.createElement('div');
        time.className = 'chat__time';
        time.textContent = timestamp();

        group.append(meta, bubble, time);
        messagesEl.append(group);
        scrollToBottom();

        messageCount += 1;
        if (sender === 'user' && messageCount >= 2 && suggestionsEl) suggestionsEl.hidden = true;
        return bubble;
    }

    function typewriter(element, text) {
        return new Promise((resolve) => {
            const html = formatText(text);
            if (instant) {
                element.innerHTML = html;
                scrollToBottom();
                resolve();
                return;
            }

            /* Dela upp i tecken men håll HTML-taggar hela */
            const tokens = [];
            let inTag = false;
            let tag = '';
            for (const ch of html) {
                if (ch === '<') { inTag = true; tag = '<'; }
                else if (ch === '>' && inTag) { tag += '>'; tokens.push(tag); inTag = false; tag = ''; }
                else if (inTag) tag += ch;
                else tokens.push(ch);
            }

            const cursor = document.createElement('span');
            cursor.className = 'chat__cursor';
            const speed = Math.max(6, Math.min(20, 1200 / tokens.length));
            let html2 = '';
            let i = 0;

            const step = () => {
                if (i >= tokens.length) {
                    cursor.remove();
                    resolve();
                    return;
                }
                html2 += tokens[i];
                element.innerHTML = html2;
                element.append(cursor);
                scrollToBottom();
                const delay = tokens[i].startsWith('<') ? 0 : speed;
                i += 1;
                setTimeout(step, delay);
            };
            step();
        });
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function setTyping(on) {
        isTyping = on;
        typingEl.hidden = !on;
        document.querySelectorAll('.chat__chip').forEach((chip) => { chip.disabled = on; });
        if (on) scrollToBottom();
    }

    /* ---------- Skicka ---------- */
    async function sendMessage(raw) {
        const message = raw.trim();
        if (!message || isTyping) return;

        addMessage(message, 'user');
        input.value = '';
        autoResize();
        updateSendButton();
        setTyping(true);

        let reply;
        if (apiAvailable) {
            try {
                reply = await callAI(message);
            } catch (err) {
                console.error('Gemini API error:', err);
                apiAvailable = false;
                setStatus();
                reply = 'Jag når inte min AI-tjänst just nu och har bytt till **offline-läge**. Fråga gärna ändå – jag kan grunderna om sidan, och försöker igen nästa gång du öppnar chatten.';
            }
        } else {
            await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
            reply = localResponse(message);
        }

        setTyping(false);
        const bubble = addMessage('', 'bot');
        await typewriter(bubble, reply);
    }

    /* ---------- Välkomstskärm ---------- */
    function showWelcome() {
        const welcome = document.createElement('div');
        welcome.className = 'chat__welcome';
        welcome.id = 'chat-welcome';
        welcome.innerHTML = `
            <div class="chat__welcome-orb" aria-hidden="true"></div>
            <p class="chat__welcome-title">Hej, jag är Flow</p>
            <p class="chat__welcome-text">Fråga mig om TechFlow, prisplanerna, effektlägena eller hur den här sidan är byggd.</p>`;
        messagesEl.append(welcome);
    }

    function clearChat() {
        messagesEl.replaceChildren();
        history = [];
        messageCount = 0;
        if (suggestionsEl) suggestionsEl.hidden = false;
        if (GEMINI_API_KEY) apiAvailable = true;
        setStatus();
        showWelcome();
    }

    /* ---------- Öppna/stäng ---------- */
    function openWidget() {
        widget.hidden = false;
        fab.classList.add('is-hidden');
        if (GEMINI_API_KEY) apiAvailable = true;
        setStatus();
        if (!hasOpened) {
            showWelcome();
            hasOpened = true;
        }
        setTimeout(() => input.focus(), 300);
    }

    function closeWidget() {
        widget.hidden = true;
        fab.classList.remove('is-hidden');
        fab.focus();
    }

    /* ---------- Inmatning ---------- */
    function updateSendButton() {
        sendBtn.disabled = input.value.trim().length === 0;
    }

    function autoResize() {
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
    }

    /* ---------- Händelser ---------- */
    fab.addEventListener('click', openWidget);
    closeBtn?.addEventListener('click', closeWidget);
    clearBtn?.addEventListener('click', clearChat);

    input.addEventListener('input', () => {
        updateSendButton();
        autoResize();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim() && input.value.length <= 500) sendMessage(input.value);
    });

    document.querySelectorAll('.chat__chip').forEach((chip) => {
        chip.addEventListener('click', () => sendMessage(chip.dataset.msg || chip.textContent));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !widget.hidden) closeWidget();
    });

    setStatus();
})();
