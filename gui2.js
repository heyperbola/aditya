document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const nextButton = document.getElementById('nextButton');
    const closeButton = document.getElementById('closeButton');

    startButton.addEventListener('click', () => {
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('inputPage').style.display = 'block';
    });

    nextButton.addEventListener('click', () => {
        currentChartIndex = (currentChartIndex + 1) % charts.length;
        showChart(currentChartIndex);
    });

    closeButton.addEventListener('click', () => {
        document.getElementById('graphView').style.display = 'none';
        document.getElementById('inputPage').style.display = 'block';
        document.getElementById('graphContainer').innerHTML = '';
    });
});

let charts = [];
let currentChartIndex = 0;

function calculateLosses() {
    const primaryVoltage = parseFloat(document.getElementById('primaryVoltage').value);
    const secondaryVoltage = parseFloat(document.getElementById('secondaryVoltage').value);
    const ratedPower = parseFloat(document.getElementById('ratedPower').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    const coreType = document.getElementById('coreType').value;
    const windingResistance = parseFloat(document.getElementById('windingResistance').value);
    const loadLevel = parseFloat(document.getElementById('loadLevel').value);

    // Calculate Iron Losses (Core Losses)
    const ironLosses = calculateIronLosses(coreType, frequency, primaryVoltage);

    // Calculate Copper Losses
    const copperLosses = calculateCopperLosses(windingResistance, loadLevel);

    // Calculate Efficiency
    const efficiency = calculateEfficiency(ratedPower, ironLosses, copperLosses);

    // Generate Charts
    charts = [
        {
            title: 'Iron Losses vs Frequency',
            labels: [50, 60, 70, 80, 90, 100],
            data: [ironLosses, ironLosses * 1.1, ironLosses * 1.2, ironLosses * 1.3, ironLosses * 1.4, ironLosses * 1.5],
            color: '#4CAF50',
            yLabel: 'Iron Losses (W)'
        },
        {
            title: 'Copper Losses vs Load',
            labels: [0, 25, 50, 75, 100],
            data: [0, copperLosses * 0.25, copperLosses * 0.5, copperLosses * 0.75, copperLosses],
            color: '#ff6384',
            yLabel: 'Copper Losses (W)'
        },
        {
            title: 'Efficiency vs Load',
            labels: [0, 25, 50, 75, 100],
            data: [0, efficiency * 0.25, efficiency * 0.5, efficiency * 0.75, efficiency],
            color: '#36a2eb',
            yLabel: 'Efficiency (%)'
        }
    ];

    // Show Graph View
    document.getElementById('inputPage').style.display = 'none';
    document.getElementById('graphView').style.display = 'flex';
    showChart(0);
}

function calculateIronLosses(coreType, frequency, voltage) {
    // Simplified formula for iron losses
    let coreLossConstant = 1.5; // Example constant
    if (coreType === 'Ferrite') coreLossConstant = 1.2;
    if (coreType === 'Amorphous') coreLossConstant = 0.8;
    return coreLossConstant * frequency * voltage;
}

function calculateCopperLosses(resistance, loadLevel) {
    // Simplified formula for copper losses
    const current = (loadLevel / 100) * 10; // Example current calculation
    return current ** 2 * resistance;
}

function calculateEfficiency(ratedPower, ironLosses, copperLosses) {
    const inputPower = ratedPower * 1000; // Convert kVA to W
    const outputPower = inputPower - (ironLosses + copperLosses);
    return (outputPower / inputPower) * 100;
}

function showChart(index) {
    const container = document.getElementById('graphContainer');
    container.innerHTML = '';
    const chartData = charts[index];

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: chartData.title,
                data: chartData.data,
                borderColor: chartData.color,
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: chartData.yLabel
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: chartData.title.includes('Frequency') ? 'Frequency (Hz)' : 'Load (%)'
                    }
                }
            }
        }
    });
}