import React from 'react';
import { getStatusColor } from './helpers';

export const StatusBadge = ({ value }) => (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
        {value || 'pending'}
    </span>
);

export const FileLink = ({ file }) => {
    if (!file) return <span className="text-gray-400">Belum ada laporan</span>;
    
    return (
        <a 
            href={`/storage/${file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
        >
            Lihat Laporan
        </a>
    );
};
