// pages/interest-calculator.tsx
import React, { useState } from "react";

const InterestCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState(1000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(1);
    const [compoundFrequency, setCompoundFrequency] = useState(1);

    // Calculate Simple Interest
    const calculateSimpleInterest = () => {
        return (principal * rate * time) / 100;
    };

    // Calculate Compound Interest
    const calculateCompoundInterest = () => {
        return (
            principal *
            Math.pow(
                1 + rate / (100 * compoundFrequency),
                compoundFrequency * time
            ) -
            principal
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 ">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Interest Calculator
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                {/* Input Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Inputs
                    </h2>
                    <div className="space-y-4">
                        {/* Principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Principal Amount ($)
                            </label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                value={principal}
                                onChange={(e) =>
                                    setPrincipal(Number(e.target.value))
                                }
                            />
                        </div>
                        {/* Annual Interest Rate */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Annual Interest Rate (%)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={rate}
                                    onChange={(e) =>
                                        setRate(Number(e.target.value))
                                    }
                                />
                            </div>
                            {/* Time in Years */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Time (Years)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={time}
                                    onChange={(e) =>
                                        setTime(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                        {/* Compound Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Compound Frequency (Times per Year)
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                value={compoundFrequency}
                                onChange={(e) =>
                                    setCompoundFrequency(Number(e.target.value))
                                }
                            >
                                <option value={1}>Annually</option>
                                <option value={2}>Semi-Annually</option>
                                <option value={4}>Quarterly</option>
                                <option value={12}>Monthly</option>
                                <option value={365}>Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Results
                    </h2>
                    <div className="space-y-4 text-lg">
                        <p>
                            <span className="font-medium">Simple Interest:</span>{" "}
                            <span className="text-blue-600">
                                ${calculateSimpleInterest().toFixed(2)}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">Compound Interest:</span>{" "}
                            <span className="text-green-600">
                                ${calculateCompoundInterest().toFixed(2)}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">
                                Total Amount (Compound):
                            </span>{" "}
                            <span className="text-purple-600">
                                $
                                {(
                                    principal + calculateCompoundInterest()
                                ).toFixed(2)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestCalculator;
