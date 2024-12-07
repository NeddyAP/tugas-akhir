import React from "react";

const StatCard = ({ icon, title, value, change, changeType }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
                {icon}
                <div>
                    <h3 className="text-gray-600 dark:text-gray-300">
                        {title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-semibold dark:text-white">
                            {value}
                        </span>
                        <span
                            className={`text-sm ${
                                changeType === "increase"
                                    ? "text-green-500 dark:text-green-400"
                                    : "text-red-500 dark:text-red-400"
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
