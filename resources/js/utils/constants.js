import { formatDate } from './helpers';

const renderStatusBadge = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        active: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

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
    dosen: [{
        Header: "NIP",
        accessor: row => row.profilable?.nip,
        sortable: true,
        id: "nip"
    }],
    mahasiswa: [{
        Header: "NIM",
        accessor: row => row.profilable?.nim,
        sortable: true,
        id: "nim"
    }],
    semua: [
        { Header: "Role", accessor: "role", sortable: true },
        {
            Header: "NIM/NIP",
            accessor: row => row.profilable?.nim || row.profilable?.nip,
            sortable: true,
            id: "identifier"
        },
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

export const LAPORAN_CONFIG = {
    KKL: {
        columns: [
            {
                Header: "Mahasiswa",
                accessor: row => `${row.mahasiswa.name} (${row.mahasiswa.profilable.nim})`,
                sortable: true
            },
            {
                Header: "Pembimbing",
                accessor: row => `${row.pembimbing.name} (${row.pembimbing.profilable.nip})`,
                sortable: true
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => ({ value, className: `px-2 py-1 rounded-full text-xs ${renderStatusBadge(value)}` })
            },
            {
                Header: "Tanggal Mulai",
                accessor: "tanggal_mulai",
                Cell: ({ value }) => formatDate(value),
                sortable: true
            },
            {
                Header: "Tanggal Selesai",
                accessor: "tanggal_selesai",
                Cell: ({ value }) => formatDate(value),
                sortable: true
            },
            {
                Header: "File Laporan",
                accessor: "laporan.file",
                Cell: ({ row }) => ({
                    type: 'link',
                    href: row.original.laporan?.file ? `/storage/${row.original.laporan.file}` : null,
                    text: row.original.laporan?.file ? 'Lihat Laporan' : 'Belum ada laporan',
                    className: row.original.laporan?.file ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
                })
            },
            {
                Header: "Keterangan Laporan",
                accessor: "laporan.keterangan",
                Cell: ({ row }) => row.original.laporan?.keterangan || 'Belum ada keterangan'
            }
        ],
        modalFields: [
            {
                name: "user_id",
                label: "Mahasiswa",
                type: "searchableSelect",
                options: [],
                required: true
            },
            {
                name: "dosen_id",
                label: "Pembimbing",
                type: "searchableSelect",
                options: [],
                required: true
            },
            { name: "tanggal_mulai", label: "Tanggal Mulai", type: "date", required: true },
            { name: "tanggal_selesai", label: "Tanggal Selesai", type: "date", required: true },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "active", label: "Active" },
                    { value: "completed", label: "Completed" },
                    { value: "rejected", label: "Rejected" }
                ],
                required: true
            },
            {
                name: "file",
                label: "File Laporan (PDF/DOC/DOCX)",
                type: "file",
                accept: ".pdf,.doc,.docx"
            },
            {
                name: "keterangan",
                label: "Keterangan Laporan",
                type: "textarea",
                rows: 3
            }
        ]
    }
};

export const getLaporanConfig = (mahasiswas, dosens) => ({
    columns: [
        {
            Header: "Mahasiswa",
            accessor: row => `${row.mahasiswa.name} (${row.mahasiswa.profilable.nim})`,
            sortable: true
        },
        {
            Header: "Pembimbing",
            accessor: row => `${row.pembimbing.name} (${row.pembimbing.profilable.nip})`,
            sortable: true
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => ({ value, className: `px-2 py-1 rounded-full text-xs ${renderStatusBadge(value)}` })
        },
        {
            Header: "Tanggal Mulai",
            accessor: "tanggal_mulai",
            Cell: ({ value }) => formatDate(value),
            sortable: true
        },
        {
            Header: "Tanggal Selesai",
            accessor: "tanggal_selesai",
            Cell: ({ value }) => formatDate(value),
            sortable: true
        },
        {
            Header: "File Laporan",
            accessor: "laporan.file",
            Cell: ({ row }) => row.original.laporan?.file || null
        },
        {
            Header: "Keterangan Laporan",
            accessor: "laporan.keterangan",
            Cell: ({ row }) => row.original.laporan?.keterangan || 'Belum ada keterangan'
        }
    ],
    modalFields: [
        {
            name: "user_id",
            label: "Mahasiswa",
            type: "searchableSelect",
            options: mahasiswas.map(m => ({
                value: m.id,
                label: `${m.name} (${m.profilable.nim})`
            })),
            required: true
        },
        {
            name: "dosen_id",
            label: "Pembimbing",
            type: "searchableSelect",
            options: dosens.map(d => ({
                value: d.id,
                label: `${d.name} (${d.profilable.nip})`
            })),
            required: true
        },
        {
            name: "tanggal_mulai",
            label: "Tanggal Mulai",
            type: "date",
            required: true
        },
        {
            name: "tanggal_selesai",
            label: "Tanggal Selesai",
            type: "date",
            required: true
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "pending", label: "Pending" },
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "rejected", label: "Rejected" }
            ],
            required: true
        },
        {
            name: "file",
            label: "File Laporan (PDF/DOC/DOCX)",
            type: "file",
            accept: ".pdf,.doc,.docx"
        },
        {
            name: "keterangan",
            label: "Keterangan Laporan",
            type: "textarea",
            rows: 3
        }
    ]
});