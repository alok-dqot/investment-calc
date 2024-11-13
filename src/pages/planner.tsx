import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinancialGoalPlanner: React.FC = () => {
    // Single state object for all financial data
    const [financialData, setFinancialData] = useState({
        currentMonthlyExpenses: 25000,
        annualExpenses: 25000,
        inflationBeforeRetirement: 8,
        currentAge: 35,
        retirementAge: 60,
        lifeExpectancy: 80,
        inflationDuringRetirement: 8,
        postTaxReturn: 8,
        equityReturn: 14,
        taxableFixedIncomeReturn: 6,
        taxFreeFixedIncomeReturn: 8,
        currentEquityInvestments: 100000,
        currentTaxableFixedIncomeInvestments: 300000,
        currentTaxFreeFixedIncomeInvestments: 300000,
        lumpSumBenefits: 500000,
        monthlyEPFContribution: 8000,
        annualEPFIncrease: 5,
        epfReturnRate: 8,
    });

    // Derived values (Years to Retirement, Years in Retirement, Monthly Expenses in Retirement)
    const yearsToRetirement = financialData.retirementAge - financialData.currentAge;
    const yearsInRetirement = financialData.lifeExpectancy - financialData.retirementAge;
    const monthlyExpensesInRetirement = (financialData.annualExpenses / 12) * Math.pow(1 + financialData.inflationBeforeRetirement / 100, yearsToRetirement);

    // Function to calculate the future value of an investment
    const calculateFutureValue = (amount: number, rate: number, years: number) => {
        return amount * Math.pow(1 + rate / 100, years);
    };

    // Calculate future values for each investment
    const futureEquityValue = calculateFutureValue(financialData.currentEquityInvestments, financialData.equityReturn, yearsToRetirement);
    const futureTaxableValue = calculateFutureValue(financialData.currentTaxableFixedIncomeInvestments, financialData.taxableFixedIncomeReturn, yearsToRetirement);
    const futureTaxFreeValue = calculateFutureValue(financialData.currentTaxFreeFixedIncomeInvestments, financialData.taxFreeFixedIncomeReturn, yearsToRetirement);
    const futureEPFValue = calculateFutureValue(financialData.monthlyEPFContribution * 12, financialData.epfReturnRate, yearsToRetirement);

    // Total corpus required in retirement adjusted for inflation during retirement
    const totalCorpusRequired = monthlyExpensesInRetirement * 12 * yearsInRetirement * Math.pow(1 + financialData.inflationDuringRetirement / 100, yearsInRetirement);

    // Calculate the total future value of investments
    const totalFutureValue = futureEquityValue + futureTaxableValue + futureTaxFreeValue + futureEPFValue + financialData.lumpSumBenefits;

    // Chart data for visualization (showing future value of investments over time)
    const chartData = {
        labels: Array.from({ length: yearsToRetirement + 1 }, (_, i) => financialData.currentAge + i),
        datasets: [
            {
                label: 'Total Future Value',
                data: Array.from({ length: yearsToRetirement + 1 }, (_, i) => {
                    const year = i;
                    return (
                        calculateFutureValue(financialData.currentEquityInvestments, financialData.equityReturn, year) +
                        calculateFutureValue(financialData.currentTaxableFixedIncomeInvestments, financialData.taxableFixedIncomeReturn, year) +
                        calculateFutureValue(financialData.currentTaxFreeFixedIncomeInvestments, financialData.taxFreeFixedIncomeReturn, year) +
                        calculateFutureValue(financialData.monthlyEPFContribution * 12, financialData.epfReturnRate, year) +
                        financialData.lumpSumBenefits
                    );
                }),
                borderColor: '#4F46E5',
                fill: false,
                tension: 0.1,
            },
        ],
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFinancialData({
            ...financialData,
            [name]: value,
        });
    };

    return (
        <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Financial Goal Planner</h2>

            {/* Input Section */}
            <div className="space-y-4 row">
                {Object.keys(financialData).map((key) => {
                    // Skip 'postTaxReturn' as it's not needed to be displayed for direct user input
                    if (key === 'postTaxReturn') return null;
                    return (
                        <div key={key} className='col-4'>
                            <label className="block text-gray-600 font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type="number"
                                name={key}
                                value={financialData[key as keyof typeof financialData]}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Future Value of Investments Chart */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 text-center mb-4">Investment Growth Over Time</h3>
                <Line data={chartData} />
            </div>

            {/* Outputs */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-2">Total Corpus Required for Retirement:</h4>
                <p className="text-lg font-semibold">₹ {totalCorpusRequired.toFixed(2)}</p>

                <h4 className="text-md font-medium text-gray-700 mb-2 mt-4">Total Future Value of Investments:</h4>
                <p className="text-lg font-semibold">₹ {totalFutureValue.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default FinancialGoalPlanner;
