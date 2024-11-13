import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RiskFactors {
    investmentAmount: number;
    timeHorizon: number;
    riskTolerance: number;
}

const RiskAssessmentCalculator: React.FC = () => {
    const [factors, setFactors] = useState<RiskFactors>({
        investmentAmount: 0,
        timeHorizon: 1,
        riskTolerance: 5,
    });

    const [riskScore, setRiskScore] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFactors((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateRiskScore = () => {
        const score =
            (factors.investmentAmount / 1000) * 0.4 +
            factors.timeHorizon * 0.3 +
            factors.riskTolerance * 0.3;

        setRiskScore(Math.round(score * 10) / 10);
    };

    const chartData = {
        labels: ['Investment Amount', 'Time Horizon', 'Risk Tolerance', 'Risk Score'],
        datasets: [
            {
                label: 'Values',
                data: [
                    factors.investmentAmount / 1000,
                    factors.timeHorizon,
                    factors.riskTolerance,
                    riskScore || 0,
                ],
                backgroundColor: ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Risk Assessment Calculator
            </h2>

            <div className="space-y-4">
                {/* Investment Amount */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1">
                        Investment Amount ($):
                    </label>
                    <input
                        type="number"
                        name="investmentAmount"
                        value={factors.investmentAmount}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Time Horizon */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1">
                        Time Horizon (years):
                    </label>
                    <input
                        type="number"
                        name="timeHorizon"
                        value={factors.timeHorizon}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Risk Tolerance */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1">
                        Risk Tolerance (1 - 10):
                    </label>
                    <input
                        type="number"
                        name="riskTolerance"
                        value={factors.riskTolerance}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <button
                onClick={calculateRiskScore}
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
                Calculate Risk Score
            </button>


            {riskScore !== null && (
                <div className="mt-6">
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Your Risk Score: {riskScore}
                        </h3>
                        <p className="text-gray-600 mt-2">
                            {riskScore < 3
                                ? 'Low Risk'
                                : riskScore < 7
                                    ? 'Moderate Risk'
                                    : 'High Risk'}
                        </p>
                    </div>


                    <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-700 mb-4 text-center">
                            Visual Representation
                        </h4>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskAssessmentCalculator;
