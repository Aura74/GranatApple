/* Editorial interactions stay small, keyboard-friendly and local. */
(() => {
    'use strict';
    const care = document.getElementById('caring');
    const day = {
        morning: { time: '09:41', greeting: 'A little room to begin.', note: 'Time for your best idea.', sub: 'Your focus time is protected.', message: "Start with a clear head. We'll take care of the background.", weather: '☀' },
        afternoon: { time: '14:30', greeting: 'Right in your rhythm.', note: 'Everything, coming together.', sub: 'A little room between your plans.', message: 'One thing at a time. Leave a little space between your plans.', weather: '◒' },
        evening: { time: '18:05', greeting: 'A little space to switch off.', note: 'A good place to pause.', sub: 'Tomorrow is already in order.', message: 'Close the day with a little peace of mind. The rest can wait.', weather: '☾' }
    };
    if (care) care.querySelectorAll('[data-care-day]').forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.careDay;
        const state = day[key];
        if (!state) return;
        care.dataset.day = key;
        care.querySelectorAll('[data-care-day]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
        care.querySelector('[data-care-time]').textContent = state.time;
        care.querySelector('[data-care-greeting]').textContent = state.greeting;
        care.querySelector('[data-care-note]').textContent = state.note;
        care.querySelector('[data-care-sub]').textContent = state.sub;
        care.querySelector('.care-message').textContent = state.message;
        care.querySelector('.care-weather').textContent = state.weather;
    }));
    const lab = document.getElementById('lab');
    if (lab) {
        lab.querySelectorAll('[data-material]').forEach(button => button.addEventListener('click', () => {
            const cool = button.dataset.material === 'cool';
            lab.dataset.light = cool ? 'cool' : 'warm';
            lab.querySelectorAll('[data-material]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
            lab.querySelector('.material-label').textContent = cool ? '02 / MOONLIGHT SILVER' : '01 / WARM PORCELAIN';
            lab.querySelector('.curiosity-object').alt = `En tredimensionell, sammanflätad knut i ${cool ? 'svala silvertoner med mjuka ljusreflexer' : 'varm porslinston med mjuka metalliska reflexer'}`;
        }));
        lab.querySelector('[data-studio-pause]')?.addEventListener('click', event => {
            const button = event.currentTarget;
            const paused = lab.querySelector('.curiosity-stage').classList.toggle('studio-is-paused');
            button.setAttribute('aria-pressed', String(paused));
            button.setAttribute('aria-label', `${paused ? 'Spela' : 'Pausa'} skulpturens rörelse`);
            button.textContent = paused ? '▷' : 'Ⅱ';
        });
    }
    document.querySelectorAll('.explore-piece').forEach(piece => piece.addEventListener('toggle', () => {
        document.dispatchEvent(new Event('tf:layoutchange'));
    }));

    // One update per pointer frame; touch, Essential and reduced motion remain still.
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('.signature-card').forEach(card => {
        let frame = 0;
        const reset = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            ['--tilt-x', '--tilt-y', '--light-x', '--light-y'].forEach(name => card.style.removeProperty(name));
        };
        card.addEventListener('pointermove', event => {
            if (!finePointer.matches || reduced.matches || document.documentElement.dataset.perf === 'essential' || event.pointerType === 'touch') return;
            cancelAnimationFrame(frame);
            const { clientX, clientY } = event;
            frame = requestAnimationFrame(() => {
                // Measure the static wrapper so the tilt cannot feed back into itself.
                const rect = card.parentElement.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
                card.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`);
                card.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
                card.style.setProperty('--light-x', `${x * 100}%`);
                card.style.setProperty('--light-y', `${y * 100}%`);
                frame = 0;
            });
        }, { passive: true });
        card.addEventListener('pointerleave', reset);
        card.addEventListener('pointercancel', reset);
        card.addEventListener('blur', reset);
        reduced.addEventListener('change', reset);
        finePointer.addEventListener('change', reset);
        document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
    });
})();
