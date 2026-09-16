/* Small, local interactions. No chart libraries or continuous render loop. */
(() => {
    'use strict';
    const ecosystem = document.querySelector('#stack');
    const layers = [
        { name: 'Experience', title: 'Made to feel second nature.', copy: 'A thoughtful workspace that puts your day in focus. Less searching, fewer distractions, more room to do your thing.' },
        { name: 'Intelligence', title: 'A little ahead. Always.', copy: 'Patterns become possibilities. Thoughtful insights help you see your next step, before you need to take it.' },
        { name: 'Automation', title: 'The little things, handled.', copy: 'Let everyday tasks take care of themselves. Your time belongs to the ideas, people and projects that need you most.' },
        { name: 'Connection', title: 'Everything in conversation.', copy: 'Your tools, your team and your ideas, in the same rhythm. A natural connection from one part of your day to the next.' },
        { name: 'Foundation', title: 'Quietly holding it all together.', copy: 'A considered foundation beneath every interaction. Built to support your work as it grows, changes and becomes something new.' }
    ];
    if (ecosystem) {
        const detail = ecosystem.querySelector('.ecosystem-detail');
        ecosystem.querySelectorAll('[data-ecosystem]').forEach(button => button.addEventListener('click', () => {
            const index = Number(button.dataset.ecosystem);
            const layer = layers[index];
            ecosystem.querySelectorAll('[data-ecosystem]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
            ecosystem.querySelectorAll('[data-ring]').forEach(ring => ring.classList.toggle('is-active', Number(ring.dataset.ring) === index));
            detail.querySelector('.ecosystem-detail-number').textContent = `0${index + 1} / ${layer.name.toUpperCase()}`;
            detail.querySelector('h3').textContent = layer.title;
            detail.querySelector('p').textContent = layer.copy;
            ecosystem.querySelector('.sculpture-caption').textContent = `${layer.name}, illuminated.`;
            ecosystem.querySelector('.ecosystem-sculpture').setAttribute('aria-label', `Fem svävande ljusringar i persika, lavendel och grönt. ${layer.name} är markerad.`);
        }));
    }

    const observatory = document.querySelector('#observatory');
    if (!observatory) return;
    const periods = {
        week: { hours: '32.5', change: '18.2', label: 'this week', caption: '16 — 22 SEPTEMBER', saved: '8.4', tasks: '142', shares: [68, 24, 8], word: 'Effortless.', insight: 'Your strongest flow was on Friday.', title: 'Din veckorytm', phase: 0 },
        month: { hours: '128.0', change: '12.6', label: 'this month', caption: '01 — 30 SEPTEMBER', saved: '34.2', tasks: '586', shares: [72, 19, 9], word: 'In rhythm.', insight: 'A little more focus, week after week.', title: 'Din månadsrytm', phase: 1.3 },
        quarter: { hours: '386.5', change: '24.8', label: 'this quarter', caption: 'JULY — SEPTEMBER', saved: '106', tasks: '1,824', shares: [76, 18, 6], word: 'Flourishing.', insight: 'Small moments. A season of progress.', title: 'Din kvartalsrytm', phase: 2.7 }
    };
    const namespace = 'http://www.w3.org/2000/svg';
    const lineGroup = document.getElementById('landscape-lines');
    const lines = Array.from({ length: 27 }, (_, i) => {
        const path = document.createElementNS(namespace, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#landscape-ink)');
        path.setAttribute('stroke-width', i === 0 ? '2' : '1.15');
        path.setAttribute('stroke-opacity', String(.9 - i * .024));
        lineGroup.append(path);
        return path;
    });
    function landscape(phase) {
        lines.forEach((path, row) => {
            const points = [];
            for (let step = 0; step <= 100; step++) {
                const t = step / 100;
                const hill = Math.exp(-(((t - (.26 + phase * .035)) / .15) ** 2)) * 95
                    + Math.exp(-(((t - (.67 - phase * .035)) / .17) ** 2)) * 165;
                const ripple = Math.sin(t * 15 + row * .1 + phase) * 9 * Math.sin(t * Math.PI);
                const x = 20 + t * 720;
                const y = 245 - hill * (1 - row * .022) + row * 1.8 + ripple;
                points.push(`${step ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`);
            }
            path.setAttribute('d', points.join(' '));
        });
    }
    function selectPeriod(key, announce = true) {
        const state = periods[key];
        if (!state) return;
        observatory.dataset.period = key;
        observatory.querySelectorAll('[data-period]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.period === key)));
        observatory.querySelector('[data-momentum]').textContent = state.hours;
        observatory.querySelector('[data-change]').textContent = `↗ ${state.change}% ${state.label}`;
        observatory.querySelector('[data-period-caption]').textContent = state.caption;
        observatory.querySelector('[data-saved]').firstChild.textContent = `${state.saved} `;
        observatory.querySelector('[data-tasks]').firstChild.textContent = `${state.tasks} `;
        observatory.querySelector('[data-focus]').firstChild.textContent = state.shares[0];
        observatory.querySelector('[data-word]').textContent = state.word;
        observatory.querySelector('[data-insight]').textContent = state.insight;
        observatory.querySelector('#landscape-chart-title').textContent = state.title;
        observatory.querySelector('#landscape-chart-desc').textContent = `Illustrativa exempeldata: ${state.hours} timmar i fokus, en ökning med ${state.change} procent. ${state.shares[0]} procent fokustid, ${state.shares[1]} procent samarbete och ${state.shares[2]} procent återhämtning.`;
        const labels = key === 'week' ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] : key === 'month' ? ['01', '05', '10', '15', '20', '25', '30'] : ['JUL 01', 'JUL 15', 'AUG 01', 'AUG 15', 'SEP 01', 'SEP 15', 'SEP 30'];
        observatory.querySelectorAll('.landscape-axis span').forEach((span, i) => span.textContent = labels[i]);
        let offset = 0;
        ['focus', 'collaboration', 'space'].forEach((name, i) => {
            observatory.querySelector(`[data-share="${name}"]`).textContent = `${state.shares[i]}%`;
            const arc = observatory.querySelector(`.rhythm-arc--${name}`);
            arc.setAttribute('stroke-dasharray', `${state.shares[i] - 3} ${103 - state.shares[i]}`);
            arc.setAttribute('stroke-dashoffset', String(-offset));
            offset += state.shares[i];
        });
        landscape(state.phase);
        if (announce) observatory.querySelector('#observatory-announcement').textContent = `${state.title}: ${state.hours} timmar i fokus. ${state.saved} timmar frigjorda och ${state.tasks} uppgifter hanterade. Illustrativa exempeldata.`;
    }
    observatory.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => selectPeriod(button.dataset.period)));
    selectPeriod('week', false);
})();
