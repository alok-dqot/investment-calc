// components/Calculator.tsx
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Housing: React.FC = () => {
    const [homePrice, setHomePrice] = useState(300000);
    const [downPayment, setDownPayment] = useState(60000);
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(5);
    const [taxRate, setTaxRate] = useState(1.2); // Default 1.2% tax
    const [insuranceRate, setInsuranceRate] = useState(0.5); // Default 0.5% insurance

    const loanAmount = homePrice - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    const principalPayment =
        (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) /
        (Math.pow(1 + monthlyInterest, totalPayments) - 1);

    const monthlyTaxes = (homePrice * (taxRate / 100)) / 12;
    const monthlyInsurance = (homePrice * (insuranceRate / 100)) / 12;

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Housing Price Calculator</h1>
            <div className="row">
                <div className="col-md-4">
                    <InputField label="Home Price ($)" value={homePrice} onChange={setHomePrice} />
                    <InputField label="Down Payment ($)" value={downPayment} onChange={setDownPayment} />
                    <InputField label="Loan Term (Years)" value={loanTerm} onChange={setLoanTerm} />
                    <InputField label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
                    <InputField label="Property Tax Rate (%)" value={taxRate} onChange={setTaxRate} />
                    <InputField label="Insurance Rate (%)" value={insuranceRate} onChange={setInsuranceRate} />
                </div>
                <div className="col-md-8">
                    <ResultDisplay
                        principal={principalPayment}
                        taxes={monthlyTaxes}
                        insurance={monthlyInsurance}
                    />
                </div>
            </div>
        </div>
    );
};

export default Housing;

interface InputFieldProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    type?: "text" | "number";
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "number" }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
            className="form-control"
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value as any)}
        />
    </div>
);

interface ResultDisplayProps {
    principal: number;
    taxes: number;
    insurance: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ principal, taxes, insurance }) => {
    const data = {
        labels: ["Principal + Interest", "Taxes", "Insurance"],
        datasets: [
            {
                data: [principal, taxes, insurance],
                backgroundColor: ["#0088FE", "#00C49F", "#FFBB28"],
                hoverBackgroundColor: ["#0077DD", "#00B36F", "#FFA726"],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) =>
                        `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`,
                },
            },
        },
    };

    return (
        <div className="card">
            <div className="card-body text-center">
                <h3>Payment Breakdown</h3>
                <div style={{ width: "100%", height: "300px", margin: "0 auto" }}>
                    <Pie data={data} options={options} />
                </div>
                <div className="mt-4">
                    <h5 className="text-primary">
                        Monthly Payment: ${(isNaN((principal + taxes + insurance).toFixed(2) as any) ? 0 : (principal + taxes + insurance).toFixed(2))}
                    </h5>
                </div>
            </div>
        </div>
    );
};
