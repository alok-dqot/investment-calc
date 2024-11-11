import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InflationCalculator = () => {
    const [initialAmount, setInitialAmount] = useState<number>(1000);
    const [inflationRate, setInflationRate] = useState<number>(3);
    const [years, setYears] = useState<number>(10);
    const [adjustedValue, setAdjustedValue] = useState<number | null>(null);
    const [chartData, setChartData] = useState<any>(null);

    // Calculate inflation when the form is submitted or on initial load
    const calculateInflation = () => {
        const inflationFactor = Math.pow(1 + inflationRate / 100, years);
        const result = initialAmount / inflationFactor; // Eroded value due to inflation

        // Generate data points for chart
        const yearsArray = Array.from({ length: years + 1 }, (_, i) => i);
        const initialValuesArray = yearsArray.map(() => initialAmount); // Constant line for initial amount
        const valuesArray = yearsArray.map((year) => initialAmount / Math.pow(1 + inflationRate / 100, year));

        setAdjustedValue(result);

        // Set chart data
        setChartData({
            labels: yearsArray.map((year) => `${year} year${year === 1 ? '' : 's'}`),
            datasets: [

                {
                    label: 'Adjusted Value (Inflation)',
                    data: valuesArray,
                    fill: true,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    tension: 0.4,
                },
            ],
        });
    };


    useEffect(() => {
        calculateInflation();
    }, [initialAmount, inflationRate, years]);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12 col-md-4">
                    <h2 className="text-center">Inflation Calculator</h2>
                    <form onSubmit={calculateInflation} className="form">
                        <div className="form-group m-3">
                            <label htmlFor="initialAmount">Initial Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="initialAmount"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value as any)}
                                placeholder="Enter the initial amount"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="inflationRate">Annual Inflation Rate (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="inflationRate"
                                value={inflationRate}
                                onChange={(e) => setInflationRate(e.target.value as any)}
                                placeholder="Enter the annual inflation rate"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="years">Number of Years</label>
                            <input
                                type="number"
                                className="form-control"
                                id="years"
                                value={years}
                                onChange={(e) => setYears(e.target.value as any)}
                                placeholder="Enter the number of years"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block my-3">
                            Calculate
                        </button>
                    </form>
                </div>
                <div className="col-12 col-md-8">

                    {adjustedValue !== null && (
                        <div className="mt-4">
                            <h3 className="text-center">
                                Adjusted Value after {years} years: ${adjustedValue.toFixed(2)}
                            </h3>
                        </div>
                    )}

                    {chartData && (
                        <div className="mt-4">
                            <h3 className="text-center">Purchasing Power Over Time</h3>
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Inflation Impact on Purchasing Power',
                                        },
                                        tooltip: {
                                            mode: 'nearest',
                                            callbacks: {
                                                title: (tooltipItems) => `Year: ${tooltipItems[0].label}`,
                                                label: (tooltipItem) => {
                                                    const value = tooltipItem.raw as any;
                                                    if (tooltipItem.datasetIndex === 0) {
                                                        // For the Initial Capital dataset
                                                        return `Initial Capital: $${value.toFixed(2)}`;
                                                    } else if (tooltipItem.datasetIndex === 1) {
                                                        // For the Adjusted Value dataset
                                                        return `Adjusted Value: $${value.toFixed(2)}`;
                                                    }
                                                    return '';
                                                },
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Years',
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Amount ($)',
                                            },
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default InflationCalculator;
