import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement, // Register PointElement
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const RetirementSavingsCalculator: React.FC = () => {
    const [inputs, setInputs] = useState({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 10000,
        monthlyContribution: 500,
        annualReturnRate: 7,
        inflationRate: 2,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const calculateSavings = () => {
        const years = inputs.retirementAge - inputs.currentAge;
        const months = years * 12;
        const monthlyRate = inputs.annualReturnRate / 100 / 12;

        let futureValue = inputs.currentSavings;
        for (let i = 0; i < months; i++) {
            futureValue += inputs.monthlyContribution;
            futureValue *= 1 + monthlyRate;
        }

        // Adjust for inflation
        const inflationAdjustment = Math.pow(1 + inputs.inflationRate / 100, years);
        const inflationAdjustedSavings = futureValue / inflationAdjustment;

        return {
            futureValue,
            inflationAdjustedSavings,
        };
    };

    const { futureValue, inflationAdjustedSavings } = calculateSavings();

    // Chart Data
    const chartData = {
        labels: Array.from({ length: inputs.retirementAge - inputs.currentAge + 1 }, (_, i) => inputs.currentAge + i),
        datasets: [
            {
                label: 'Savings Over Time ($)',
                data: Array.from({ length: inputs.retirementAge - inputs.currentAge + 1 }, (_, i) => {
                    const age = inputs.currentAge + i;
                    const yearlyRate = inputs.annualReturnRate / 100;
                    const yearlySavings = (prevSavings: number) =>
                        (prevSavings + inputs.monthlyContribution * 12) * (1 + yearlyRate);
                    return yearlySavings(inputs.currentSavings + i * inputs.monthlyContribution * 12);
                }),
                borderColor: '#4F46E5',
                backgroundColor: '#A5B4FC',
                tension: 0.4,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#fff',
            },
        ],
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
                Advanced Retirement Savings Calculator
            </h2>

            {/* Input Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                    { label: 'Current Age', name: 'currentAge', value: inputs.currentAge },
                    { label: 'Retirement Age', name: 'retirementAge', value: inputs.retirementAge },
                    { label: 'Current Savings ($)', name: 'currentSavings', value: inputs.currentSavings },
                    { label: 'Monthly Contribution ($)', name: 'monthlyContribution', value: inputs.monthlyContribution },
                    { label: 'Annual Return Rate (%)', name: 'annualReturnRate', value: inputs.annualReturnRate },
                    { label: 'Inflation Rate (%)', name: 'inflationRate', value: inputs.inflationRate },
                ].map(({ label, name, value }) => (
                    <div key={name} className="flex flex-col">
                        <label className="block text-gray-600 font-medium mb-2">{label}:</label>
                        <input
                            type="number"
                            name={name}
                            value={value}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        />
                    </div>
                ))}
            </div>

            {/* Output Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Results:</h3>
                <div className="space-y-4 text-lg">
                    <p>Total Savings at Retirement: <span className="font-bold">${futureValue.toFixed(2)}</span></p>
                    <p>Inflation-Adjusted Savings: <span className="font-bold">${inflationAdjustedSavings.toFixed(2)}</span></p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Savings Growth Over Time</h3>
                <Line data={chartData} options={{ responsive: true }} />
            </div>
        </div>
    );
};

export default RetirementSavingsCalculator;
