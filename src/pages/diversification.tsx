import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import fileDownload from "js-file-download";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface AssetAllocation {
    stocks: number;
    bonds: number;
    realEstate: number;
    cash: number;
}

const InvestmentDiversificationPlanner: React.FC = () => {
    const [totalInvestment, setTotalInvestment] = useState<number>(10000);
    const [riskTolerance, setRiskTolerance] = useState<string>("Medium");
    const [allocation, setAllocation] = useState<AssetAllocation>({
        stocks: 50,
        bonds: 30,
        realEstate: 10,
        cash: 10,
    });

    // Update allocation dynamically with sliders
    const updateAllocation = (type: keyof AssetAllocation, value: number) => {
        const remaining = 100 - value;
        const otherAllocations = Object.keys(allocation).filter((key) => key !== type) as (keyof AssetAllocation)[];
        const updatedAllocation = { ...allocation, [type]: value };
        const adjustment = remaining / otherAllocations.length;

        otherAllocations.forEach((key) => {
            updatedAllocation[key] = Math.max(0, Math.min(remaining, adjustment)).toFixed(2) as any;
        });

        setAllocation(updatedAllocation);
    };

    // Chart data for visualization
    const chartData = {
        labels: ["Stocks", "Bonds", "Real Estate", "Cash"],
        datasets: [
            {
                data: [allocation.stocks, allocation.bonds, allocation.realEstate, allocation.cash],
                backgroundColor: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"],
                hoverBackgroundColor: ["#4338CA", "#4F46E5", "#6366F1", "#818CF8"],
            },
        ],
    };

    // Export data as JSON
    const exportPlan = () => {
        const data = {
            totalInvestment,
            allocation,
            breakdown: {
                Stocks: (totalInvestment * allocation.stocks) / 100,
                Bonds: (totalInvestment * allocation.bonds) / 100,
                RealEstate: (totalInvestment * allocation.realEstate) / 100,
                Cash: ((totalInvestment * allocation.cash) / 100),
            },
        };
        fileDownload(JSON.stringify(data, null, 2), "investment-plan.json");
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Advanced Investment Diversification Planner
            </h2>

            {/* Input Section */}
            <div className="space-y-4">
                {/* Total Investment */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1">
                        Total Investment Amount ($):
                    </label>
                    <input
                        type="number"
                        value={totalInvestment}
                        onChange={(e) => setTotalInvestment(Number(e.target.value))}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Risk Tolerance */}
                <div>
                    <label className="block text-gray-600 font-medium mb-1">
                        Risk Tolerance:
                    </label>
                    <select
                        value={riskTolerance}
                        onChange={(e) => setRiskTolerance(e.target.value)}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            {/* Slider Section */}
            <div className="mt-6 space-y-4">
                {["stocks", "bonds", "realEstate", "cash"].map((key) => (
                    <div key={key}>
                        <label className="block text-gray-600 font-medium mb-1 capitalize">
                            {key}
                        </label>
                        <input
                            type="range"
                            value={allocation[key as keyof AssetAllocation]}
                            onChange={(e) =>
                                updateAllocation(key as keyof AssetAllocation, Number(e.target.value))
                            }
                            min="0"
                            max="100"
                            step="1"
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${allocation[key as keyof AssetAllocation]
                                    }%, #e5e7eb ${allocation[key as keyof AssetAllocation]}%, #e5e7eb 100%)`,
                            }}
                        />

                        <p className="text-gray-600 mt-2">{allocation[key as keyof AssetAllocation]}%</p>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="mt-6 col-12 col-md-7 m-auto">
                <h3 className="text-lg font-medium text-gray-700 text-center mb-4">
                    Allocation Visualization
                </h3>
                <Pie data={chartData} />
            </div>

            {/* Export Section */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={exportPlan}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Export Plan
                </button>
            </div>
        </div>
    );
};

export default InvestmentDiversificationPlanner;
