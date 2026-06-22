document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;
    
    let currentTheme = localStorage.getItem('dashTheme') || 'light';
    htmlEl.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    let chartInstances = [];

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', currentTheme);
        localStorage.setItem('dashTheme', currentTheme);
        themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        updateChartTheme(currentTheme);
    });

    // Formatting Utilities
    const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    const formatNumber = (val) => new Intl.NumberFormat('es-CO').format(val);

    // Global Chart Config
    Chart.defaults.font.family = "'Poppins', sans-serif";

    // Load Data
    fetch('dashboard_data.json')
        .then(res => res.json())
        .then(data => {
            renderKPIs(data.kpis);
            renderCharts(data);
            renderTable(data.top_prestamos);
        })
        .catch(err => {
            console.error('Error cargando JSON', err);
        });

    function renderKPIs(kpis) {
        animateValue('kpi-prestado', 0, kpis.total_prestado, formatCurrency);
        animateValue('kpi-intereses', 0, kpis.total_intereses, formatCurrency);
        animateValue('kpi-restante', 0, kpis.saldo_restante, formatCurrency);
        animateValue('kpi-cantidad', 0, kpis.cantidad, formatNumber);
    }

    function animateValue(id, start, end, formatter) {
        const obj = document.getElementById(id);
        const duration = 1500;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * (end - start) + start);
            obj.innerHTML = formatter(current);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = formatter(end);
        };
        window.requestAnimationFrame(step);
    }

    function renderCharts(data) {
        const textColor = currentTheme === 'dark' ? '#9ca3af' : '#6b7280';
        const gridColor = currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

        // 1. Temporal Chart
        const ctxTemp = document.getElementById('chartTemporal').getContext('2d');
        const gradientBlue = ctxTemp.createLinearGradient(0, 0, 0, 400);
        gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        gradientBlue.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        const temporalChart = new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: data.grafico_temporal.labels,
                datasets: [{
                    label: 'Monto Prestado',
                    data: data.grafico_temporal.valores,
                    borderColor: '#3b82f6',
                    backgroundColor: gradientBlue,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.raw) } }
                },
                scales: {
                    y: { ticks: { color: textColor, callback: (v) => formatCurrency(v) }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });

        // 2. Pagos Chart
        const ctxPagos = document.getElementById('chartPagos').getContext('2d');
        const pagosChart = new Chart(ctxPagos, {
            type: 'doughnut',
            data: {
                labels: data.grafico_estado_pagos.labels,
                datasets: [{
                    data: data.grafico_estado_pagos.valores,
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true } },
                    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.raw)}` } }
                }
            }
        });

        chartInstances.push(temporalChart, pagosChart);
    }

    function renderTable(top) {
        const tbody = document.querySelector('#topTable tbody');
        tbody.innerHTML = '';
        top.forEach((row, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.nombre_completo}</td>
                <td>${row.fecha}</td>
                <td><span class="badge-monto">${formatCurrency(row.monto_prestamo)}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function updateChartTheme(theme) {
        const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
        const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        
        chartInstances.forEach(chart => {
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = textColor;
                    chart.options.scales.x.grid.color = gridColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = textColor;
                    chart.options.scales.y.grid.color = gridColor;
                }
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        });
    }
});
