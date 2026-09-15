/* Illustration motion is independent of scroll reveals. All loops pause offscreen. */
(() => {
    'use strict';
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = [...document.querySelectorAll('#phones, #end, #circuit, #layers, #stack, #predictive, #rive-demo, #cta')];
    const loops = new Map();
    const visible = new Set();
    const allowed = () => root.dataset.perf !== 'essential' && !reduced.matches && !document.hidden;
    function sync() {
        sections.forEach(section => {
            const playing = visible.has(section) && allowed();
            section.classList.toggle('is-visible', playing);
            (loops.get(section) || []).forEach(animation => playing ? animation.play() : animation.pause());
        });
    }
    function float(selector, frames, timing) {
        document.querySelectorAll(selector).forEach((element, i) => {
            const section = element.closest('[data-motion]');
            if (!section || !element.animate) return;
            const animation = element.animate(frames, { duration: 6000 + i * 450, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', ...timing });
            animation.pause();
            animation.currentTime = i * 650;
            loops.set(section, [...(loops.get(section) || []), animation]);
        });
    }
    sections.forEach(section => section.dataset.motion = '');
    document.querySelectorAll('.scene-toggle').forEach(button => {
        const card = button.closest('.scene-card');
        const title = card.querySelector('h3').textContent;
        button.addEventListener('click', () => {
            const paused = card.classList.toggle('is-paused');
            button.setAttribute('aria-pressed', String(paused));
            button.setAttribute('aria-label', `${paused ? 'Spela' : 'Pausa'} ${title}`);
            button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
        });
    });
    float('.phone .phone-frame, .pred-phone .phone-frame', [{ transform: 'translateY(4px)' }, { transform: 'translateY(-9px)' }]);
    float('.cta-phone .phone-frame', [{ translate: '0 4px' }, { translate: '0 -10px' }]);
    const finale = document.querySelector('.finale');
    const modes = {
        focus: { label: 'Deep focus', status: 'Distractions on pause', agenda: 'Your next big idea', hint: 'A little room to think. A little space to create.' },
        flow: { label: 'Flow state', status: 'All systems in flow', agenda: 'Deep work', hint: "Find your rhythm. We'll take care of the rest." },
        unwind: { label: 'Time to unwind', status: 'Everything is taken care of', agenda: 'A slower start', hint: 'Close the tabs. Open up a little space for you.' },
    };
    document.querySelectorAll('[data-final-mode]').forEach(button => button.addEventListener('click', () => {
        const mode = button.dataset.finalMode;
        const state = modes[mode];
        if (!finale || !state) return;
        finale.dataset.mode = mode;
        finale.querySelector('.final-mode-label').textContent = state.label;
        finale.querySelector('.final-status-label').textContent = state.status;
        finale.querySelector('[data-final-agenda]').firstChild.textContent = state.agenda;
        finale.querySelector('.final-hint').textContent = state.hint;
        finale.querySelectorAll('[data-final-mode]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    }));
    float('.architecture-layer', [{ translate: '0 0' }, { translate: '0 -7px' }], { duration: 5000 });
    // Measure real card edges into the SVG coordinate system. Resize and font changes
    // reuse the same geometry; no DOM measurements or path morphing per animation frame.
    const network = document.querySelector('.floating-profiles');
    if (network) {
        const svg = network.querySelector('.connection-lines');
        const node = network.querySelector('.main-node');
        const cards = [...network.querySelectorAll('.profile-card')];
        const paths = [...svg.querySelectorAll('.connection-line')];
        const signals = paths.map((path, i) => {
            const signal = path.cloneNode();
            signal.setAttribute('class', 'connection-signal');
            signal.setAttribute('pathLength', '100');
            signal.style.setProperty('--delay', `${i * -.7}s`);
            svg.append(signal);
            return signal;
        });
        function connect() {
            const box = svg.getBoundingClientRect();
            if (!box.width || !box.height) return;
            const hub = node.getBoundingClientRect();
            const x = (hub.right - box.left) * 500 / box.width;
            const y = (hub.top + hub.height / 2 - box.top) * 500 / box.height;
            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const endX = (rect.left - box.left) * 500 / box.width;
                const endY = (rect.top + rect.height / 2 - box.top) * 500 / box.height;
                const mid = x + (endX - x) * .5;
                const d = `M${x} ${y} C${mid} ${y} ${mid} ${endY} ${endX} ${endY}`;
                paths[i].setAttribute('d', d);
                signals[i].setAttribute('d', d);
            });
        }
        new ResizeObserver(connect).observe(network);
        document.fonts?.ready.then(connect);
        connect();
        // Animate inner content only, preserving the exact attachment points.
        float('.profile-avatar', [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], { duration: 3200 });
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(({target, isIntersecting}) => isIntersecting ? visible.add(target) : visible.delete(target));
        sync();
    }, { threshold: .05 });
    sections.forEach(section => observer.observe(section));
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => {
        if (reduced.matches) loops.forEach(animations => animations.forEach(animation => { animation.pause(); animation.currentTime = 0; }));
        sync();
    });
    sync();
})();
