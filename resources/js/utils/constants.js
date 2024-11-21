export const DOWNLOAD_OPTIONS = [
    { label: 'Excel (.xlsx)', format: 'excel' },
    { label: 'PDF (.pdf)', format: 'pdf' },
    { label: 'Word (.docx)', format: 'word' },
    { label: 'Salin ke Clipboard', format: 'copy' },
];

export const getTableConfigs = (logbooks, bimbingans, formatDate) => ({
    Logbook: {
        columns: [
            { Header: 'Tanggal Pelaksanaan', accessor: 'tanggal', Cell: ({ value }) => formatDate(value) },
            { Header: 'Catatan Kegiatan', accessor: 'catatan' },
            { Header: 'Keterangan Kegiatan', accessor: 'keterangan' },
        ],
        modalFields: [
            { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
            { name: 'catatan', label: 'Catatan Kegiatan', type: 'textarea', required: true },
            { name: 'keterangan', label: 'Keterangan Kegiatan', type: 'textarea', required: true },
        ],
        data: logbooks.data || [],
        pagination: logbooks,
    },
    Bimbingan: {
        columns: [
            { Header: 'Tanggal Bimbingan', accessor: 'tanggal', Cell: ({ value }) => formatDate(value) },
            { Header: 'Keterangan Bimbingan', accessor: 'keterangan' },
            { Header: 'Tanda Tangan Dosen Pembimbing', accessor: 'status' },
        ],
        modalFields: [
            { name: 'tanggal', label: 'Tanggal Bimbingan', type: 'date', required: true },
            { name: 'keterangan', label: 'Keterangan Bimbingan', type: 'textarea', required: true },
        ],
        data: bimbingans.data || [],
        pagination: bimbingans,
    }
});