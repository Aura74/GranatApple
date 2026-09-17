/* ==========================================================================
   TECHFLOW – main.js
   Tema, navigering, effektnivåer, formulär och GSAP-avslöjanden.
   Produktillustrationernas rörelse sköts i premium.js.

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
            btn.setAttribute('aria-label', label.textContent);
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
            label.textContent = open ? 'Close menu' : 'Explore';
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Explore menu');
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
                        showToast('This computer seems to struggle with the full effects. Switch to Balanced for smoother scrolling?', {
                            duration: 12000,
                            actions: [
                                { label: 'Keep', onClick: () => {} },
                                { label: 'Switch', primary: true, onClick: () => applyPerf('balanced') },
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
                showToast('Please enter a valid email address.');
                return;
            }
            btn.disabled = true;
            btn.textContent = 'Thank you!';
            showToast('Thank you! This is how signing up would feel. Demo – nothing is sent or stored.', { duration: 6000 });
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
                showToast(`You chose ${btn.dataset.plan}. This is a demo – no purchase is made.`);
            });
        });
    }

    /* ----------------------------------------------------------------------
       GSAP-animationer
       Essential: inga tweens alls (elementen är synliga som standard eftersom
       alla avslöjanden är gsap.from). Balanced: avslöjanden + billiga loopar.
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
    }

    function initSectionReveals() {
        $$('.section-badge').filter(el => !el.closest('.tech-lab')).forEach((badge) => {
            gsap.from(badge, { y: 20, opacity: 0, duration: 0.6, scrollTrigger: revealOnce(badge, 'top 85%') });
        });
        $$('main h2').filter(el => !el.closest('.tech-lab')).forEach((heading) => {
            gsap.from(heading, { y: 50, opacity: 0, duration: 0.8, scrollTrigger: revealOnce(heading) });
        });
        const paragraphs = $$([
            '.end-content p', '.circuit-content p', '.predictive-content p', '.rive-demo-header p',
        ].join(','));
        paragraphs.filter(el => !el.closest('.tech-lab')).forEach((p) => {
            gsap.from(p, { y: 30, opacity: 0, duration: 0.6, delay: 0.2, scrollTrigger: revealOnce(p, 'top 85%') });
        });
    }

    function initAnimations() {
        if (!hasGsap || ESSENTIAL) return;

        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: 'power3.out' });

        initHeroAnimations();
        initSectionReveals();

        /* Typsnitt och expanderbara kort ändrar layouten – räkna om triggers */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
        document.addEventListener('tf:layoutchange', () => ScrollTrigger.refresh());
    }

    /* ----------------------------------------------------------------------
       Start
       ---------------------------------------------------------------------- */
    initTheme();
    initMenu();
    initPerfControl();
    initFpsProbe();
    initWaitlist();
    initPlanButtons();
    initAnimations();

    /* Litet publikt API för övriga script (chat.js, rive.js) */
    window.TechFlow = Object.freeze({ showToast, perf: PERF, essential: ESSENTIAL, cinematic: CINEMATIC });
})();
