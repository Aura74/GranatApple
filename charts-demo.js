/* ============================================
   CHART LIBRARIES DEMO
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Vänta på att biblioteken laddas
    setTimeout(() => {
        initChartJsDemo();
        initD3Demo();
        initApexDemo();
        initFrappeDemo();
    }, 500);
});

// ============================================
// 1. CHART.JS DEMO
// ============================================
function initChartJsDemo() {
    const ctx = document.getElementById('chartjs-demo');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'],
            datasets: [{
                label: 'Användare',
                data: [1200, 1900, 3000, 5000, 4200, 6800],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#6366f1'
            }, {
                label: 'Konverteringar',
                data: [400, 600, 1200, 1800, 1400, 2400],
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#ec4899'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ============================================
// 2. D3.JS DEMO
// ============================================
function initD3Demo() {
    const svg = d3.select('#d3-demo');
    if (svg.empty() || typeof d3 === 'undefined') return;

    const data = [
        { name: 'React', value: 85 },
        { name: 'Vue', value: 72 },
        { name: 'Angular', value: 58 },
        { name: 'Svelte', value: 45 },
        { name: 'Next.js', value: 68 }
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.3);

    // Y Scale
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // Gradient
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'd3-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#f89d42');

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#f59e0b');

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('rx', 6)
        .attr('fill', 'url(#d3-gradient)')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value));

    // X Axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '11px')
        .style('fill', '#64748b');

    // Y Axis
    g.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .selectAll('text')
        .style('font-size', '11px')
        .style('fill', '#64748b');

    // Remove axis lines
    g.selectAll('.domain').remove();
    g.selectAll('.tick line').attr('stroke', '#e5e7eb');

    // Value labels
    g.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 8)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#1e1b4b')
        .style('opacity', 0)
        .text(d => d.value + '%')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 1);
}

// ============================================
// 3. APEXCHARTS DEMO
// ============================================
function initApexDemo() {
    const container = document.getElementById('apex-demo');
    if (!container || typeof ApexCharts === 'undefined') return;

    const options = {
        series: [{
            name: 'Försäljning',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Intäkter',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        chart: {
            type: 'bar',
            height: 280,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 8,
                borderRadiusApplication: 'end'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep'],
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px'
                }
            }
        },
        fill: {
            opacity: 1,
            colors: ['#008ffb', '#00e396']
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + 'K SEK';
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            markers: {
                radius: 12
            }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4
        }
    };

    const chart = new ApexCharts(container, options);
    chart.render();
}

// ============================================
// 4. FRAPPE CHARTS DEMO
// ============================================
function initFrappeDemo() {
    const container = document.getElementById('frappe-demo');
    if (!container || typeof frappe === 'undefined') return;

    const data = {
        labels: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
        datasets: [
            {
                name: 'Besökare',
                values: [25, 40, 30, 35, 8, 52, 17]
            },
            {
                name: 'Klick',
                values: [12, 25, 18, 22, 5, 38, 10]
            }
        ]
    };

    new frappe.Chart(container, {
        title: 'Veckostatistik',
        data: data,
        type: 'bar',
        height: 280,
        colors: ['#7cd6fd', '#743ee2'],
        barOptions: {
            spaceRatio: 0.4
        },
        axisOptions: {
            xAxisMode: 'tick',
            xIsSeries: true
        },
        tooltipOptions: {
            formatTooltipX: d => (d + '').toUpperCase(),
            formatTooltipY: d => d + ' st'
        }
    });
}
