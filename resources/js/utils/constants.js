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

export const USER_TABS = {
    MAHASISWA: 'mahasiswa',
    DOSEN: 'dosen',
    ADMIN: 'admin',
    ALL: 'semua',
};

export const USER_COMMON_COLUMNS = [
    { Header: "Nama", accessor: "name", sortable: true },
    { Header: "Email", accessor: "email", sortable: true },
];

export const USER_SPECIFIC_COLUMNS = {
    admin: [{ Header: "Role", accessor: "role", sortable: true }],
    dosen: [{ Header: "NIP", accessor: "nip", sortable: true }],
    mahasiswa: [{ Header: "NIM", accessor: "nim", sortable: true }],
    semua: [
        { Header: "Role", accessor: "role", sortable: true },
        { Header: "NIM/NIP", accessor: "identifier", sortable: true },
    ],
};

export const USER_COMMON_FIELDS = [
    { name: "name", label: "Nama", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Telepon", type: "tel" },
    { name: "address", label: "Alamat", type: "textarea", rows: 3 },
    { name: "password", label: "Password", type: "password" },
];

export const USER_SPECIFIC_FIELDS = {
    admin: [{
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { value: "admin", label: "Admin" },
            { value: "superadmin", label: "Superadmin" },
        ],
    }],
    dosen: [{ name: "nip", label: "NIP", type: "text" }],
    mahasiswa: [{ name: "nim", label: "NIM", type: "text" }],
};