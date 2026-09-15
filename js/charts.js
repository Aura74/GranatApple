/* ==========================================================================
   TECHFLOW – charts.js
   Demo av fyra diagrambibliotek. Varje bibliotek (~1,5 MB tillsammans)
   laddas först när dess sektion är på väg in i bild, färgerna läses från
   sidans CSS-variabler och ritas om när temat växlar. I Essential-läge
   ritas diagrammen utan animation.
   ========================================================================== */
(() => {
    'use strict';

    const root = document.documentElement;
    const ESSENTIAL = root.dataset.perf === 'essential'
        || matchMedia('(prefers-reduced-motion: reduce)').matches;

    const LIBS = {
        chartjs: 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.js',
        d3:      'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
        apex:    'https://cdn.jsdelivr.net/npm/apexcharts@7.3.0/dist/apexcharts.min.js',
        frappe:  'https://cdn.jsdelivr.net/npm/frappe-charts@1.6.2/dist/frappe-charts.min.umd.js',
    };

    const scriptCache = new Map();
    function loadScript(src) {
        if (!scriptCache.has(src)) {
            scriptCache.set(src, new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Kunde inte ladda ${src}`));
                document.head.append(script);
            }));
        }
        return scriptCache.get(src);
    }

    /* light-dark() löses först när variabeln används på ett element, så
       färgerna läses av via ett osynligt prob-element i stället för direkt */
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
    document.body.append(probe);

    function palette() {
        const resolve = (variable) => {
            probe.style.color = `var(${variable})`;
            return getComputedStyle(probe).color;
        };
        return {
            text: resolve('--text'),
            muted: resolve('--text-muted'),
            grid: resolve('--border'),
            primary: resolve('--primary'),
            pink: resolve('--accent-pink'),
            dark: root.dataset.theme === 'dark',
            font: getComputedStyle(root).getPropertyValue('--font-body').trim() || 'Inter, sans-serif',
        };
    }

    const layoutChanged = () => document.dispatchEvent(new CustomEvent('tf:layoutchange'));

    /* ----------------------------------------------------------------------
       1. Chart.js
       ---------------------------------------------------------------------- */
    let chartJsInstance = null;

    function initChartJs() {
        const canvas = document.getElementById('chartjs-demo');
        if (!canvas || typeof Chart === 'undefined') return;
        const p = palette();

        Chart.defaults.font.family = p.font;
        Chart.defaults.color = p.muted;

        chartJsInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'],
                datasets: [{
                    label: 'Användare',
                    data: [1200, 1900, 3000, 5000, 4200, 6800],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.12)',
                    pointBackgroundColor: '#6366f1',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                }, {
                    label: 'Konverteringar',
                    data: [400, 600, 1200, 1800, 1400, 2400],
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.10)',
                    pointBackgroundColor: '#ec4899',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: ESSENTIAL ? false : { duration: 900, easing: 'easeOutQuart' },
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 20, color: p.text } },
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: p.grid }, ticks: { color: p.muted } },
                    x: { grid: { display: false }, ticks: { color: p.muted } },
                },
            },
        });
    }

    function themeChartJs() {
        if (!chartJsInstance) return;
        const p = palette();
        const { options } = chartJsInstance;
        options.plugins.legend.labels.color = p.text;
        options.scales.y.grid.color = p.grid;
        options.scales.y.ticks.color = p.muted;
        options.scales.x.ticks.color = p.muted;
        chartJsInstance.update('none');
    }

    /* ----------------------------------------------------------------------
       2. D3.js
       ---------------------------------------------------------------------- */
    const d3Data = [
        { name: 'React', value: 85 },
        { name: 'Vue', value: 72 },
        { name: 'Angular', value: 58 },
        { name: 'Svelte', value: 45 },
        { name: 'Next.js', value: 68 },
    ];

    let d3Drawn = false;

    function drawD3(animate) {
        if (typeof d3 === 'undefined' || typeof d3.select !== 'function') return;
        const svg = d3.select('#d3-demo');
        if (svg.empty()) return;
        d3Drawn = true;
        const p = palette();
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = 400 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().domain(d3Data.map((d) => d.name)).range([0, width]).padding(0.3);
        const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

        const gradient = svg.append('defs').append('linearGradient')
            .attr('id', 'd3-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#f89d42');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b');

        const bars = g.selectAll('.bar').data(d3Data).enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d.name))
            .attr('width', x.bandwidth())
            .attr('rx', 6)
            .attr('fill', 'url(#d3-gradient)');

        const labels = g.selectAll('.label').data(d3Data).enter().append('text')
            .attr('class', 'label')
            .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
            .attr('y', (d) => y(d.value) - 8)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', p.text)
            .text((d) => `${d.value}%`);

        if (animate) {
            bars.attr('y', height).attr('height', 0)
                .transition().duration(800).delay((d, i) => i * 100)
                .attr('y', (d) => y(d.value)).attr('height', (d) => height - y(d.value));
            labels.style('opacity', 0)
                .transition().duration(800).delay((d, i) => i * 100 + 400).style('opacity', 1);
        } else {
            bars.attr('y', (d) => y(d.value)).attr('height', (d) => height - y(d.value));
        }

        g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
            .selectAll('text').style('font-size', '11px').style('fill', p.muted);
        g.append('g').call(d3.axisLeft(y).ticks(5))
            .selectAll('text').style('font-size', '11px').style('fill', p.muted);

        g.selectAll('.domain').remove();
        g.selectAll('.tick line').attr('stroke', p.grid);
    }

    /* ----------------------------------------------------------------------
       3. ApexCharts
       ---------------------------------------------------------------------- */
    let apexInstance = null;

    function apexThemeOptions() {
        const p = palette();
        return {
            theme: { mode: p.dark ? 'dark' : 'light' },
            chart: { background: 'transparent', fontFamily: p.font },
            grid: { borderColor: p.grid, strokeDashArray: 4 },
            xaxis: { labels: { style: { colors: p.muted, fontSize: '12px' } } },
            yaxis: { labels: { style: { colors: p.muted, fontSize: '12px' } } },
            legend: { labels: { colors: p.text } },
        };
    }

    function initApex() {
        const container = document.getElementById('apex-demo');
        if (!container || typeof ApexCharts === 'undefined') return;
        const themed = apexThemeOptions();

        apexInstance = new ApexCharts(container, {
            series: [
                { name: 'Försäljning', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
                { name: 'Intäkter',    data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
            ],
            chart: {
                type: 'bar',
                height: 280,
                ...themed.chart,
                toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
                animations: { enabled: !ESSENTIAL, speed: 800 },
            },
            theme: themed.theme,
            plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 6, borderRadiusApplication: 'end' } },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            colors: ['#008ffb', '#00e396'],
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep'], ...themed.xaxis },
            yaxis: themed.yaxis,
            fill: { opacity: 1 },
            tooltip: { y: { formatter: (val) => `${val}K SEK` } },
            legend: { position: 'top', horizontalAlign: 'left', markers: { shape: 'circle', size: 6 }, ...themed.legend },
            grid: themed.grid,
        });
        apexInstance.render();
    }

    function themeApex() {
        apexInstance?.updateOptions(apexThemeOptions(), false, !ESSENTIAL);
    }

    /* ----------------------------------------------------------------------
       4. Frappe Charts (färger på text/rutnät sköts i CSS)
       ---------------------------------------------------------------------- */
    function initFrappe() {
        const container = document.getElementById('frappe-demo');
        if (!container || typeof frappe === 'undefined') return;

        new frappe.Chart(container, {
            title: 'Veckostatistik',
            type: 'bar',
            height: 280,
            animate: !ESSENTIAL,
            colors: ['#7cd6fd', '#743ee2'],
            data: {
                labels: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
                datasets: [
                    { name: 'Besökare', values: [25, 40, 30, 35, 8, 52, 17] },
                    { name: 'Klick',    values: [12, 25, 18, 22, 5, 38, 10] },
                ],
            },
            barOptions: { spaceRatio: 0.4 },
            axisOptions: { xAxisMode: 'tick', xIsSeries: true },
            tooltipOptions: {
                formatTooltipX: (d) => String(d).toUpperCase(),
                formatTooltipY: (d) => `${d} st`,
            },
        });
    }

    /* ----------------------------------------------------------------------
       Lazy-init: ladda biblioteket när sektionen är ~400 px från bild
       ---------------------------------------------------------------------- */
    const INITIALIZERS = {
        chartjs: () => loadScript(LIBS.chartjs).then(initChartJs),
        d3:      () => loadScript(LIBS.d3).then(() => drawD3(!ESSENTIAL)),
        apex:    () => loadScript(LIBS.apex).then(initApex),
        frappe:  () => loadScript(LIBS.frappe).then(initFrappe),
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            const key = entry.target.dataset.chart;
            INITIALIZERS[key]?.()
                .then(layoutChanged)
                .catch((err) => console.warn(`Diagram "${key}" kunde inte visas:`, err.message));
        }
    }, { rootMargin: '400px 0px' });

    document.querySelectorAll('[data-chart]').forEach((section) => observer.observe(section));

    /* Rita om i nya färger när temat växlar */
    document.addEventListener('tf:themechange', () => {
        themeChartJs();
        if (d3Drawn) drawD3(false);
        themeApex();
    });
})();
