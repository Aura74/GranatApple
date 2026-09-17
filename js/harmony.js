/* An optional design collection, also reachable through existing deep links. */
(() => {
    'use strict';
    const collection = document.getElementById('tech-lab');
    if (!collection) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const revealTarget = (hash, scroll = false) => {
        if (!hash || hash === '#') return;
        let id;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target || target === collection || !collection.contains(target)) return;
        collection.open = true;
        if (scroll) requestAnimationFrame(() => target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' }));
    };
    collection.addEventListener('toggle', () => document.dispatchEvent(new Event('tf:layoutchange')));
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (link) revealTarget(link.getAttribute('href'));
    });
    window.addEventListener('hashchange', () => revealTarget(location.hash, true));
    revealTarget(location.hash, true);
})();
