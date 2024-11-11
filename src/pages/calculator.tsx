import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Defining types for the result and form inputs
type ResultData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
    }[];
};

type FormData = {
    initialDeposit: number;
    contribution: number;
    frequency: "Monthly" | "Annually";
    years: number;
    rate: number;
    compoundFrequency: "Annually" | "Monthly";
};

const InvestmentCalculator = () => {
    const [formData, setFormData] = useState<FormData>({
        initialDeposit: 4000,
        contribution: 100,
        frequency: "Monthly",
        years: 30,
        rate: 6,
        compoundFrequency: "Annually",
    });

    const [result, setResult] = useState<ResultData | null>(null);

    useEffect(() => {
        // Default graph result calculation when the component mounts
        const defaultResult = calculateDefaultInvestment();
        setResult(defaultResult);
    }, []);

    const calculateDefaultInvestment = (): ResultData => {
        const initialDeposit = 4000;
        const contribution = 100;
        const frequency = "Monthly";
        const years = 30;
        const rate = 6;
        const compoundFrequency = "Annually";

        let n = compoundFrequency === "Annually" ? 1 : 12;
        let totalValue = initialDeposit;
        let totalPrincipal = initialDeposit;
        let totalInterest = 0;

        const balancePoints: number[] = [];
        const principalPoints: number[] = [];
        const interestPoints: number[] = [];

        for (let i = 1; i <= years; i++) {
            totalValue = totalValue * Math.pow(1 + rate / (100 * n), n);
            if (frequency === "Monthly") {
                totalValue += contribution * 12;
                totalPrincipal += contribution * 12;
            } else {
                totalValue += contribution;
                totalPrincipal += contribution;
            }
            totalInterest = totalValue - totalPrincipal;

            balancePoints.push(totalValue);
            principalPoints.push(totalPrincipal);
            interestPoints.push(totalInterest);
        }

        return {
            labels: Array.from({ length: years }, (_, i) => (new Date().getFullYear() + i).toString()),
            datasets: [
                {
                    label: "Total Balance",
                    data: balancePoints,
                    borderColor: "#28a745",  // Green color for total balance
                    backgroundColor: "rgba(40, 167, 69, 0.2)", // Light green
                    fill: true,
                },
                {
                    label: "Total Principal",
                    data: principalPoints,
                    borderColor: "#007bff",  // Blue color for total principal
                    backgroundColor: "rgba(0, 123, 255, 0.2)", // Light blue
                    fill: true,
                },
                {
                    label: "Total Interest",
                    data: interestPoints,
                    borderColor: "#ffc107",  // Yellow color for total interest
                    backgroundColor: "rgba(255, 193, 7, 0.2)", // Light yellow
                    fill: true,
                },
            ],
        };
    };

    const calculateInvestment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { initialDeposit, contribution, frequency, years, rate, compoundFrequency } = formData;
        let n = compoundFrequency === "Annually" ? 1 : 12;
        let totalValue = initialDeposit;
        let totalPrincipal = initialDeposit;
        let totalInterest = 0;

        const balancePoints: number[] = [];
        const principalPoints: number[] = [];
        const interestPoints: number[] = [];

        for (let i = 1; i <= years; i++) {
            totalValue = totalValue * Math.pow(1 + rate / (100 * n), n);
            if (frequency === "Monthly") {
                totalValue += contribution * 12;
                totalPrincipal += contribution * 12;
            } else {
                totalValue += contribution;
                totalPrincipal += contribution;
            }
            totalInterest = totalValue - totalPrincipal;

            balancePoints.push(totalValue);
            principalPoints.push(totalPrincipal);
            interestPoints.push(totalInterest);
        }

        setResult({
            labels: Array.from({ length: years }, (_, i) => (new Date().getFullYear() + i).toString()),
            datasets: [
                {
                    label: "Total Balance",
                    data: balancePoints,
                    borderColor: "#28a745",
                    backgroundColor: "rgba(40, 167, 69, 0.2)",
                    fill: true,
                },
                {
                    label: "Total Principal",
                    data: principalPoints,
                    borderColor: "#007bff",
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                    fill: true,
                },
                {
                    label: "Total Interest",
                    data: interestPoints,
                    borderColor: "#ffc107",
                    backgroundColor: "rgba(255, 193, 7, 0.2)",
                    fill: true,
                },
            ],
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: type === "number" ? Number(value) : value,
        }));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h2 className="text-center mb-4">AI Investment Calculator</h2>
                    <form onSubmit={calculateInvestment} className="form">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group m-3">
                                    <label htmlFor="initialDeposit">Initial Deposit</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="initialDeposit"
                                        value={formData.initialDeposit}
                                        onChange={handleChange}
                                        placeholder="Enter initial deposit"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group m-3">
                                    <label htmlFor="contribution">Contribution Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="contribution"
                                        value={formData.contribution}
                                        onChange={handleChange}
                                        placeholder="Enter contribution"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group m-3">
                            <label>Contribution Frequency</label>
                            <div>
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        value="Monthly"
                                        checked={formData.frequency === "Monthly"}
                                        onChange={() => setFormData(prev => ({ ...prev, frequency: "Monthly" }))}
                                    /> Monthly
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="Annually"
                                        checked={formData.frequency === "Annually"}
                                        onChange={() => setFormData(prev => ({ ...prev, frequency: "Annually" }))}
                                    /> Annually
                                </label>
                            </div>
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="years">Years of Growth</label>
                            <input
                                type="number"
                                className="form-control"
                                id="years"
                                value={formData.years}
                                onChange={handleChange}
                                placeholder="Enter number of years"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="rate">Estimated Rate of Return (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="rate"
                                value={formData.rate}
                                onChange={handleChange}
                                placeholder="Enter estimated rate of return"
                            />
                        </div>

                        <div className="form-group m-3">
                            <label htmlFor="compoundFrequency">Compound Frequency</label>
                            <select
                                className="form-control"
                                id="compoundFrequency"
                                value={formData.compoundFrequency}
                                onChange={handleChange}
                            >
                                <option value="Annually">Annually</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-success btn-block">
                            Calculate
                        </button>
                    </form>
                </div>
                <div className="col-12 col-md-6">
                    {result && (
                        <div className="mt-4">
                            <h3 className="text-center">Total Balance: ${result.datasets[0].data.slice(-1)[0].toFixed(2)}</h3>
                            <h4 className="text-center">Total Interest: ${(
                                result.datasets[2].data.slice(-1)[0]
                            ).toFixed(2)}</h4>
                            <h4 className="text-center">Total Principal: ${(
                                result.datasets[1].data.slice(-1)[0]
                            ).toFixed(2)}</h4>
                            <Line
                                data={result}
                                options={{
                                    responsive: true,
                                    interaction: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    plugins: {
                                        tooltip: {
                                            mode: 'index',
                                            callbacks: {
                                                title: (tooltipItems) => {
                                                    return `Year: ${tooltipItems[0].label}`;
                                                },
                                                label: (tooltipItem) => {
                                                    const dataset = tooltipItem.dataset;
                                                    const value = dataset.data[tooltipItem.dataIndex] as any;
                                                    return `${dataset.label}: $${value.toFixed(2)}`;
                                                },
                                            },
                                        },
                                    },
                                    elements: {
                                        line: {
                                            tension: 0.4,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: "Year",
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: "Amount ($)",
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

export default InvestmentCalculator;
