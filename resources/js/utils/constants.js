import { formatDate } from "./helpers";

export const renderStatusBadge = (status) => {
    const colors = {
        pending: "bg-yellow-100 text-yellow-800",
        active: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
};

export const DOWNLOAD_OPTIONS = [
    { label: "Excel (.xlsx)", format: "excel" },
    { label: "PDF (.pdf)", format: "pdf" },
    { label: "Word (.docx)", format: "word" },
    { label: "Salin ke Clipboard", format: "copy" },
];

export const getTableConfigs = (logbooks, bimbingans, formatDate) => ({
    Logbook: {
        columns: [
            {
                Header: "Tanggal Pelaksanaan",
                accessor: "tanggal",
                Cell: ({ value }) => formatDate(value),
            },
            { Header: "Catatan Kegiatan", accessor: "catatan" },
            { Header: "Keterangan Kegiatan", accessor: "keterangan" },
        ],
        modalFields: [
            { name: "tanggal", label: "Tanggal", type: "date", required: true },
            {
                name: "catatan",
                label: "Catatan Kegiatan",
                type: "textarea",
                required: true,
            },
            {
                name: "keterangan",
                label: "Keterangan Kegiatan",
                type: "textarea",
                required: true,
            },
        ],
        data: logbooks.data || [],
        pagination: logbooks,
    },
    Bimbingan: {
        columns: [
            {
                Header: "Tanggal Bimbingan",
                accessor: "tanggal",
                Cell: ({ value }) => formatDate(value),
            },
            { Header: "Keterangan Bimbingan", accessor: "keterangan" },
            { Header: "Tanda Tangan Dosen Pembimbing", accessor: "status" },
        ],
        modalFields: [
            {
                name: "tanggal",
                label: "Tanggal Bimbingan",
                type: "date",
                required: true,
            },
            {
                name: "keterangan",
                label: "Keterangan Bimbingan",
                type: "textarea",
                required: true,
            },
        ],
        data: bimbingans.data || [],
        pagination: bimbingans,
    },
});

export const USER_TYPES = {
    ADMIN: "admin",
    DOSEN: "dosen",
    MAHASISWA: "mahasiswa",
    ALL: "all",
};

export const USER_ROLES = {
    ADMIN: "admin",
    SUPERADMIN: "superadmin",
    DOSEN: "dosen",
    MAHASISWA: "mahasiswa",
};

export const USER_TABS = [
    { type: USER_TYPES.ADMIN, label: "Admin" },
    { type: USER_TYPES.DOSEN, label: "Dosen" },
    { type: USER_TYPES.MAHASISWA, label: "Mahasiswa" },
    { type: USER_TYPES.ALL, label: "Semua User" },
];

export const USER_COMMON_COLUMNS = [
    {
        Header: "Nama",
        accessor: "name",
        sortable: true,
    },
    {
        Header: "Email",
        accessor: "email",
        sortable: true,
    },
    {
        Header: "No. Telepon",
        accessor: (row) => row.profilable?.phone || "-",
        sortable: true,
        id: "phone",
    },
    {
        Header: "Alamat",
        accessor: (row) => row.profilable?.address || "-",
        sortable: true,
        id: "address",
    },
];

export const USER_SPECIFIC_COLUMNS = {
    [USER_TYPES.ADMIN]: [
        {
            Header: "Role",
            accessor: "role",
            sortable: true,
        },
    ],
    [USER_TYPES.DOSEN]: [
        {
            Header: "NIP",
            accessor: (row) => row.profilable?.nip || "-",
            sortable: true,
            id: "nip",
        },
    ],
    [USER_TYPES.MAHASISWA]: [
        {
            Header: "NIM",
            accessor: (row) => row.profilable?.nim || "-",
            sortable: true,
            id: "nim",
        },
    ],
    [USER_TYPES.ALL]: [
        {
            Header: "Role",
            accessor: "role",
            sortable: true,
        },
        {
            Header: "NIM/NIP",
            accessor: (row) =>
                row.profilable?.nim || row.profilable?.nip || "-",
            sortable: true,
            id: "identifier",
        },
    ],
};

export const USER_COMMON_FIELDS = [
    {
        name: "name",
        label: "Nama",
        type: "text",
        required: true,
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        required: false,
    },
    {
        name: "phone",
        label: "No. Telepon",
        type: "tel",
        required: false,
    },
    {
        name: "address",
        label: "Alamat",
        type: "textarea",
        rows: 3,
        required: false,
    },
];

export const USER_SPECIFIC_FIELDS = {
    [USER_TYPES.ADMIN]: [
        {
            name: "role",
            label: "Role",
            type: "select",
            options: [
                { value: USER_ROLES.ADMIN, label: "Admin" },
                { value: USER_ROLES.SUPERADMIN, label: "Superadmin" },
            ],
            required: true,
        },
    ],
    [USER_TYPES.DOSEN]: [
        {
            name: "nip",
            label: "NIP",
            type: "text",
            required: true,
        },
    ],
    [USER_TYPES.MAHASISWA]: [
        {
            name: "nim",
            label: "NIM",
            type: "text",
            required: true,
        },
    ],
};

export const LAPORAN_CONFIG = {
    KKL: {
        columns: [
            {
                Header: "Mahasiswa",
                accessor: (row) =>
                    `${row.mahasiswa.name} (${row.mahasiswa.profilable.nim})`,
                sortable: true,
            },
            {
                Header: "Pembimbing",
                accessor: (row) =>
                    `${row.pembimbing.name} (${row.pembimbing.profilable.nip})`,
                sortable: true,
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => ({
                    value,
                    className: `px-2 py-1 rounded-full text-xs ${renderStatusBadge(
                        value
                    )}`,
                }),
            },
            {
                Header: "Tanggal Mulai",
                accessor: "tanggal_mulai",
                Cell: ({ value }) => formatDate(value),
                sortable: true,
            },
            {
                Header: "Tanggal Selesai",
                accessor: "tanggal_selesai",
                Cell: ({ value }) => formatDate(value),
                sortable: true,
            },
            {
                Header: "File Laporan",
                accessor: "laporan.file",
                Cell: ({ row }) => ({
                    type: "link",
                    href: row.original.laporan?.file
                        ? `/storage/${row.original.laporan.file}`
                        : null,
                    text: row.original.laporan?.file
                        ? "Lihat Laporan"
                        : "Belum ada laporan",
                    className: row.original.laporan?.file
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400",
                }),
            },
            {
                Header: "Keterangan Laporan",
                accessor: "laporan.keterangan",
                Cell: ({ row }) =>
                    row.original.laporan?.keterangan || "Belum ada keterangan",
            },
        ],
        modalFields: [
            {
                name: "user_id",
                label: "Mahasiswa",
                type: "searchableSelect",
                options: [],
                required: true,
            },
            {
                name: "dosen_id",
                label: "Pembimbing",
                type: "searchableSelect",
                options: [],
                required: true,
            },
            {
                name: "tanggal_mulai",
                label: "Tanggal Mulai",
                type: "date",
                required: true,
            },
            {
                name: "tanggal_selesai",
                label: "Tanggal Selesai",
                type: "date",
                required: true,
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "active", label: "Active" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                ],
                required: true,
            },
            {
                name: "file",
                label: "File Laporan (PDF)",
                type: "file",
                accept: ".pdf,.doc,.docx",
            },
            {
                name: "keterangan",
                label: "Keterangan Laporan",
                type: "textarea",
                rows: 3,
            },
        ],
    },
};

export const getLaporanConfig = (mahasiswas, dosens) => ({
    columns: [
        {
            Header: "Mahasiswa",
            accessor: (row) =>
                `${row.mahasiswa.name} (${row.mahasiswa.profilable.nim})`,
            sortable: true,
        },
        {
            Header: "Pembimbing",
            accessor: (row) =>
                `${row.pembimbing.name} (${row.pembimbing.profilable.nip})`,
            sortable: true,
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => ({
                value,
                className: `px-2 py-1 rounded-full text-xs ${renderStatusBadge(
                    value
                )}`,
            }),
        },
        {
            Header: "Tanggal Mulai",
            accessor: "tanggal_mulai",
            Cell: ({ value }) => formatDate(value),
            sortable: true,
        },
        {
            Header: "Tanggal Selesai",
            accessor: "tanggal_selesai",
            Cell: ({ value }) => formatDate(value),
            sortable: true,
        },
        {
            Header: "File Laporan",
            accessor: "laporan.file",
            Cell: ({ row }) => row.original.laporan?.file || null,
        },
        {
            Header: "Keterangan Laporan",
            accessor: "laporan.keterangan",
            Cell: ({ row }) =>
                row.original.laporan?.keterangan || "Belum ada keterangan",
        },
    ],
    modalFields: [
        {
            name: "user_id",
            label: "Mahasiswa",
            type: "searchableSelect",
            options: mahasiswas.map((m) => ({
                value: m.id,
                label: `${m.name} (${m.profilable.nim})`,
            })),
            required: true,
        },
        {
            name: "dosen_id",
            label: "Pembimbing",
            type: "searchableSelect",
            options: dosens.map((d) => ({
                value: d.id,
                label: `${d.name} (${d.profilable.nip})`,
            })),
            required: true,
        },
        {
            name: "tanggal_mulai",
            label: "Tanggal Mulai",
            type: "date",
            required: true,
        },
        {
            name: "tanggal_selesai",
            label: "Tanggal Selesai",
            type: "date",
            required: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "pending", label: "Pending" },
                { value: "active", label: "Active" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
            ],
            required: true,
        },
        {
            name: "file",
            label: "File Laporan (PDF)",
            type: "file",
            accept: ".pdf,.doc,.docx",
        },
        {
            name: "keterangan",
            label: "Keterangan Laporan",
            type: "textarea",
            rows: 3,
        },
    ],
});
