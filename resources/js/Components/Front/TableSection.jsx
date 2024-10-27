import React from 'react';
import { Download } from 'lucide-react';
import Table from '@/Components/Front/Table';

const TableSection = React.memo(({ columns, data, onAdd, onDownload }) => (
    <div className="container px-4 py-8 mx-auto my-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="space-x-2">
                <button
                    onClick={onDownload}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    <Download className="inline-block w-4 h-4 mr-2" />
                    Download
                </button>
                <button
                    onClick={onAdd}
                    className="px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700"
                >
                    Tambah Baru
                </button>
            </div>
        </div>
        <Table
            columns={columns}
            data={data}
        />
        <div className="flex items-end justify-end mt-8">
            <div className="text-center">
                <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">Tanda Tangan Kaprodi</h3>
                    <div className="w-48 h-24 p-4 text-center border-2 border-gray-300 border-dashed">
                        <p className="text-gray-500">Tanda tangan akan ditampilkan di sini</p>
                    </div>
                    <p className="mt-2 font-semibold text-center">AISYAH S.KOM .</p>
                </div>
            </div>
        </div>
    </div>
));

TableSection.displayName = 'TableSection';

export default TableSection;