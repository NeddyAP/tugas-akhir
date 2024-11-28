import React from "react";

const StatCard = ({ icon, title, value, change, changeType }) => {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
                {icon}
                <div>
                    <h3 className="text-gray-600">{title}</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-semibold">{value}</span>
                        <span
                            className={`text-sm ${
                                changeType === "increase"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {change}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
