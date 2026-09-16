/* ==========================================================================
   TECHFLOW – main.js
   Tema, navigering, intro, effektnivåer, formulär och GSAP-animationer.

   Klassiskt script (laddas med defer) i stället för ES-modul så att sidan
   fungerar när index.html öppnas direkt via file:// utan lokal server.
   Allt ligger i en IIFE – inga globala variabler utom window.TechFlow.
   ========================================================================== */
(() => {
    'use strict';

    const root = document.documentElement;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const STORAGE = {
        theme: 'theme',              // oprefixad för bakåtkompatibilitet i portföljen
        perf: 'tf:perfMode',
        skipSplash: 'tf:skipSplash',
    };

    /* Effektnivån sattes redan före första rendering i <head> */
    const PERF = root.dataset.perf || 'balanced';
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ESSENTIAL = PERF === 'essential' || reduceMotion;
    const CINEMATIC = PERF === 'cinematic' && !reduceMotion;
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

    const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

    /* ----------------------------------------------------------------------
       Toast
       ---------------------------------------------------------------------- */
    const toastEl = $('#toast');
    let toastTimer;

    function showToast(message, { actions = [], duration = 4200 } = {}) {
        if (!toastEl) return;
        clearTimeout(toastTimer);
        toastEl.replaceChildren();

        const text = document.createElement('p');
        text.textContent = message;
        toastEl.append(text);

        if (actions.length) {
            const row = document.createElement('div');
            row.className = 'toast__actions';
            for (const { label, primary, onClick } of actions) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = label;
                if (primary) btn.classList.add('is-primary');
                btn.addEventListener('click', () => {
                    hideToast();
                    onClick?.();
                });
                row.append(btn);
            }
            toastEl.append(row);
        }

        toastEl.classList.add('is-visible');
        if (duration) toastTimer = setTimeout(hideToast, duration);
    }

    function hideToast() {
        toastEl?.classList.remove('is-visible');
    }

    /* ----------------------------------------------------------------------
       Tema (ljust/mörkt) – attributet sattes före paint, här sköts bara växling
       ---------------------------------------------------------------------- */
    function initTheme() {
        const btn = $('#theme-toggle');
        if (!btn) return;
        const label = $('.nav-btn__text', btn);

        const sync = () => {
            const dark = root.dataset.theme === 'dark';
            btn.setAttribute('aria-pressed', String(dark));
            label.textContent = dark ? 'Light mode' : 'Dark mode';
        };

        const setTheme = (theme, persist) => {
            root.dataset.theme = theme;
            if (persist) localStorage.setItem(STORAGE.theme, theme);
            sync();
            emit('tf:themechange', { theme });
        };

        sync();
        btn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

        /* Följ systemet så länge besökaren inte valt själv */
        matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE.theme)) setTheme(e.matches ? 'dark' : 'light', false);
        });
    }

    /* ----------------------------------------------------------------------
       Intro: dela upp namnet i tecken (CSS animerar via --i) och visa
       navigeringen först när intron scrollats förbi
       ---------------------------------------------------------------------- */
    function splitChars(el) {
        const text = el.textContent.trim();
        el.setAttribute('aria-label', text);
        el.textContent = '';
        let index = 0;
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'word';
            for (const ch of word) {
                const charEl = document.createElement('span');
                charEl.className = 'char';
                charEl.textContent = ch;
                charEl.style.setProperty('--i', index++);
                wordEl.append(charEl);
            }
            el.append(wordEl);
            if (wordIndex < words.length - 1) el.append(' ');
        });
    }

    function initSplash() {
        const splash = $('.splash');
        if (!splash) return;

        const name = $('.splash__name', splash);
        const skip = 'skipSplash' in root.dataset;
        if (name && !ESSENTIAL && !skip) splitChars(name);

        const nav = $('#floating-nav');
        if (nav) {
            new IntersectionObserver(([entry]) => {
                nav.classList.toggle('is-visible', !entry.isIntersecting);
            }, { threshold: 0.05 }).observe(splash);
        }
    }

    /* ----------------------------------------------------------------------
       Rullgardinsmeny – riktiga länkar, stängknapp, Escape och klick utanför
       ---------------------------------------------------------------------- */
    function initMenu() {
        const toggle = $('#menu-toggle');
        const menu = $('#dropdown-menu');
        const closeBtn = $('#menu-close');
        if (!toggle || !menu) return;

        const label = $('.nav-btn__text', toggle);
        const items = $$('.menu-item', menu);
        let open = false;

        const animateItems = (show) => {
            if (hasGsap && !ESSENTIAL) {
                if (show) {
                    gsap.fromTo(items, { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1, overwrite: true });
                } else {
                    gsap.to(items, { y: -20, opacity: 0, duration: 0.2, stagger: 0.05, overwrite: true });
                }
            } else {
                items.forEach((item) => { item.style.opacity = show ? '1' : '0'; });
            }
        };

        const setOpen = (next) => {
            if (open === next) return;
            open = next;
            menu.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('menu-open', open);
            label.textContent = open ? 'Close menu' : 'Learn more';
            animateItems(open);

            if (open) {
                setTimeout(() => items[0]?.focus({ preventScroll: true }), 150);
            } else if (menu.contains(document.activeElement)) {
                toggle.focus({ preventScroll: true });
            }
        };

        toggle.addEventListener('click', () => setOpen(!open));
        closeBtn?.addEventListener('click', () => setOpen(false));
        items.forEach((item) => item.addEventListener('click', () => setOpen(false)));

        document.addEventListener('click', (e) => {
            if (open && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && open) setOpen(false);
        });
    }

    /* ----------------------------------------------------------------------
       Effektnivå – väljare + automatisk FPS-kontroll
       ---------------------------------------------------------------------- */
    function applyPerf(mode) {
        if (mode === PERF) return;
        localStorage.setItem(STORAGE.perf, mode);
        sessionStorage.setItem(STORAGE.skipSplash, '1');
        location.reload();
    }

    function initPerfControl() {
        const control = $('#perf-control');
        const toggle = $('#perf-toggle');
        const options = $$('.perf__option');
        if (!control || !toggle) return;

        options.forEach((opt) => opt.setAttribute('aria-checked', String(opt.dataset.perfValue === PERF)));

        const setOpen = (open) => {
            control.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setOpen(!control.classList.contains('is-open'));
        });
        document.addEventListener('click', (e) => {
            if (!control.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
        options.forEach((opt) => opt.addEventListener('click', () => applyPerf(opt.dataset.perfValue)));
    }

    /* Mäter faktisk bildfrekvens när Cinematic valts automatiskt – fångar
       datorer med svagt grafikkort som kärn-/minneskontrollen missar */
    function initFpsProbe() {
        if (!CINEMATIC || !('perfAuto' in root.dataset)) return;

        addEventListener('load', () => {
            setTimeout(() => {
                let frames = 0;
                const start = performance.now();
                const tick = (now) => {
                    frames += 1;
                    if (now - start < 2000) {
                        requestAnimationFrame(tick);
                        return;
                    }
                    const fps = frames / ((now - start) / 1000);
                    if (fps < 45) {
                        showToast('Den här datorn verkar kämpa med alla effekter. Vill du byta till Balanced för mjukare scroll?', {
                            duration: 12000,
                            actions: [
                                { label: 'Behåll', onClick: () => {} },
                                { label: 'Byt', primary: true, onClick: () => applyPerf('balanced') },
                            ],
                        });
                    }
                };
                requestAnimationFrame(tick);
            }, 1500);
        }, { once: true });
    }

    /* ----------------------------------------------------------------------
       Väntelista & prisknappar – demo, inget skickas
       ---------------------------------------------------------------------- */
    function initWaitlist() {
        const form = $('#waitlist-form');
        if (!form) return;
        const input = $('#waitlist-email', form);
        const btn = $('.cta__button', form);
        const original = btn.textContent;

        input.addEventListener('input', () => form.classList.remove('is-invalid'));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!input.checkValidity()) {
                form.classList.remove('is-invalid');
                void form.offsetWidth; // starta om skak-animationen
                form.classList.add('is-invalid');
                input.focus();
                showToast('Skriv en giltig e-postadress.');
                return;
            }
            btn.disabled = true;
            btn.textContent = 'Tack!';
            showToast('Tack! Du står nu på väntelistan. (Demo – inget skickas.)', { duration: 6000 });
            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.textContent = original;
            }, 2500);
        });
    }

    function initPlanButtons() {
        $$('[data-plan]').forEach((btn) => {
            btn.addEventListener('click', () => {
                showToast(`Du har valt ${btn.dataset.plan}. Det här är en demo – inget köp genomförs.`);
            });
        });
    }

    /* ----------------------------------------------------------------------
       GSAP-animationer
       Essential: inga tweens alls (elementen är synliga som standard eftersom
       alla avslöjanden är gsap.from). Balanced: avslöjanden + billiga loopar.
       Cinematic: dessutom scroll-scrubbad introduktion av användarkorten.
       Produktillustrationernas rörelse sköts separat i premium.js.
       ---------------------------------------------------------------------- */

    /* Oändliga loopar pausas när deras sektion är utanför skärmen */
    function pauseOffscreen(trigger, tweens) {
        const st = ScrollTrigger.create({
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => tweens.forEach((t) => t.paused(!self.isActive)),
        });
        tweens.forEach((t) => t.paused(!st.isActive));
    }

    const revealOnce = (trigger, start = 'top 80%') => ({ trigger, start, toggleActions: 'play none none none' });

    function initHeroAnimations() {
        gsap.from('.hero__content > *', {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.15,
            scrollTrigger: revealOnce('.hero', 'top 70%'),
        });
        gsap.from('.hero__layer', {
            y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: revealOnce('.hero', 'top 70%'),
        });
        pauseOffscreen('.hero', [
            gsap.to('.hero__logo', { y: -10, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }),
        ]);
    }

    function initSectionReveals() {
        $$('.section-badge').forEach((badge) => {
            gsap.from(badge, { y: 20, opacity: 0, duration: 0.6, scrollTrigger: revealOnce(badge, 'top 85%') });
        });
        $$('main h2').forEach((heading) => {
            gsap.from(heading, { y: 50, opacity: 0, duration: 0.8, scrollTrigger: revealOnce(heading) });
        });
        const paragraphs = $$([
            '.end-content p', '.caring-content p', '.circuit-content p', '.stack-content p', '.predictive-content p',
            '.layers-header p', '.lab-intro p', '.rive-demo-header p', '.chart-demo-header p', '.cafe-header p', '.showcase-header p',
        ].join(','));
        paragraphs.forEach((p) => {
            gsap.from(p, { y: 30, opacity: 0, duration: 0.6, delay: 0.2, scrollTrigger: revealOnce(p, 'top 85%') });
        });
    }

    function initCurvedCards() {
        const cards = $$('.curved-card');
        if (!cards.length) return;
        gsap.set(cards, { opacity: 0, y: 100, rotationX: 15 });
        cards.forEach((card, i) => {
            gsap.to(card, {
                opacity: 1, y: 0, rotationX: 0, duration: 0.9, delay: i * 0.2,
                scrollTrigger: { trigger: '.curved-wrapper', start: 'top 80%', toggleActions: 'play none none reverse' },
            });
        });
    }

    function initAnimations() {
        if (!hasGsap || ESSENTIAL) return;

        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: 'power3.out' });

        initHeroAnimations();
        initSectionReveals();
        initCurvedCards();

        /* Typsnitt och expanderbara kort ändrar layouten – räkna om triggers */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
        document.addEventListener('tf:layoutchange', () => ScrollTrigger.refresh());
    }

    /* ----------------------------------------------------------------------
       Start
       ---------------------------------------------------------------------- */
    initTheme();
    initSplash();
    initMenu();
    initPerfControl();
    initFpsProbe();
    initWaitlist();
    initPlanButtons();
    initAnimations();

    /* Litet publikt API för övriga script (chat.js, rive.js) */
    window.TechFlow = Object.freeze({ showToast, perf: PERF, essential: ESSENTIAL, cinematic: CINEMATIC });
})();
