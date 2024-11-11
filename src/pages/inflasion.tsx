import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InflationCalculator = () => {
    // Combined state object to manage all inputs
    const [formData, setFormData] = useState({
        initialAmount: 1000,
        inflationRate: 3,
        years: 10,
    });

    const [adjustedValue, setAdjustedValue] = useState<number | null>(null);
    const [chartData, setChartData] = useState<any>(null);

    // Calculate inflation and update chart data
    const calculateInflation = () => {
        const { initialAmount, inflationRate, years } = formData;
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

    // Call calculateInflation on first load and on form change
    useEffect(() => {
        calculateInflation();
    }, [formData]);

    // Handle input changes for all fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: parseFloat(value)
        }));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12 col-md-4">
                    <h2 className="text-center">Inflation Calculator</h2>
                    <form className="form">
                        <div className="form-group m-3">
                            <label htmlFor="initialAmount">Initial Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="initialAmount"
                                name="initialAmount"
                                value={formData.initialAmount}
                                onChange={handleInputChange}
                                placeholder="Enter the initial amount"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="inflationRate">Annual Inflation Rate (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="inflationRate"
                                name="inflationRate"
                                value={formData.inflationRate}
                                onChange={handleInputChange}
                                placeholder="Enter the annual inflation rate"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="years">Number of Years</label>
                            <input
                                type="number"
                                className="form-control"
                                id="years"
                                name="years"
                                value={formData.years}
                                onChange={handleInputChange}
                                placeholder="Enter the number of years"
                            />
                        </div>

                        <button type="button" className="btn btn-primary btn-block my-3" onClick={calculateInflation}>
                            Calculate
                        </button>
                    </form>
                </div>

                <div className="col-12 col-md-8">
                    {adjustedValue !== null && (
                        <div className="mt-4">
                            <h3 className="text-center">
                                Adjusted Value after {formData.years} years: ${adjustedValue.toFixed(2)}
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
                                                    return `Adjusted Value: $${value.toFixed(2)}`;
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
