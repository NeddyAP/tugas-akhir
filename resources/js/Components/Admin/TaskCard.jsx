// src/components/admin/TaskCard.jsx
import React from 'react';

const TaskCard = ({ icon, title, status, duration }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'In progress': return 'text-orange-500';
            case 'On hold': return 'text-blue-500';
            case 'Done': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <span className={`text-sm ${getStatusColor(status)}`}>{status}</span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">{duration}</span>
                <button className="text-gray-400 hover:text-gray-600">...</button>
            </div>
        </div>
    );
};

export default TaskCard;
