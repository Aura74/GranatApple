/* Original Lottie motion study. Local runtime and data also work via file://.
   Historical filename retained for existing page integrations. */
(() => {
    'use strict';
    const section = document.getElementById('lottie-demo');
    const container = document.getElementById('lottie-animation');
    if (!section || !container) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const toggle = section.querySelector('.orbit-toggle');
    const status = section.querySelector('.orbit-state');
    const speeds = [...section.querySelectorAll('[data-orbit-speed]')];
    const stillPreview = container.firstElementChild?.cloneNode(true);
    let animation = null;
    let ready = false;
    let visible = false;
    let userPaused = reduced.matches || document.documentElement.dataset.perf === 'essential';
    let speed = 1;
    function sync() {
        if (!ready) return;
        const play = visible && !document.hidden && !userPaused;
        if (play) animation.play(); else animation.pause();
        toggle.setAttribute('aria-pressed', String(userPaused));
        toggle.setAttribute('aria-label', `${userPaused ? 'Spela' : 'Pausa'} Lottie-animationen`);
        toggle.firstElementChild.textContent = userPaused ? '▷' : 'Ⅱ';
        status.textContent = userPaused ? 'Paused · a moment of stillness' : `${speed}× / Seamless orbit`;
        section.dataset.lottieState = play ? 'playing' : 'paused';
    }
    toggle.addEventListener('click', () => {
        if (!ready) return;
        userPaused = !userPaused;
        sync();
    });
    speeds.forEach(button => button.addEventListener('click', () => {
        if (!ready) return;
        speed = Number(button.dataset.orbitSpeed);
        animation.setSpeed(speed);
        speeds.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
        section.dataset.lottieSpeed = String(speed);
        sync();
    }));
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
    }, { threshold: .08 }).observe(container);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => {
        if (reduced.matches) userPaused = true;
        sync();
    });
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => { script.remove(); reject(new Error(`Could not load ${src}`)); };
            document.head.append(script);
        });
    }
    function failed() {
        animation?.destroy();
        if (stillPreview) container.replaceChildren(stillPreview.cloneNode(true));
        ready = false;
        toggle.disabled = true;
        speeds.forEach(button => button.disabled = true);
        status.textContent = 'Still preview · motion unavailable';
        section.dataset.lottieState = 'unavailable';
    }
    async function boot() {
        try {
            await Promise.all([
                loadScript('js/vendor/lottie.min.js').catch(() => loadScript('https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie.min.js')),
                loadScript('animations/flow-orbit.js'),
            ]);
            animation = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: false,
                animationData: window.TechFlowOrbit,
                rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false },
            });
            animation.addEventListener('DOMLoaded', () => {
                container.querySelector('.orbit-fallback')?.remove();
                ready = true;
                animation.goToAndStop(60, true);
                toggle.disabled = false;
                speeds.forEach(button => button.disabled = false);
                section.dataset.lottieSpeed = '1';
                sync();
            });
            animation.addEventListener('data_failed', failed);
            animation.addEventListener('error', failed);
        } catch { failed(); }
    }
    const lazy = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
            lazy.disconnect();
            boot();
        }
    }, { rootMargin: '500px 0px' });
    lazy.observe(section);
})();
