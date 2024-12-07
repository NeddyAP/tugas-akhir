import React from "react";

const TaskCard = ({ icon, title, status, duration }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "text-orange-500";
            case "On hold":
                return "text-blue-500";
            case "Done":
                return "text-green-500";
            default:
                return "text-gray-500 dark:text-gray-400";
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium dark:text-white">{title}</h3>
                    <span className={`text-sm ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500 dark:text-gray-400">
                    {duration}
                </span>
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    ...
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
