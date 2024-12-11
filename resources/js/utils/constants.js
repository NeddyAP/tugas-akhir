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

export const getTableConfigs = (logbooks, bimbingans, formatDate) => {
    const emptyPagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    };

    const getMahasiswaInfo = (row) => {
        if (row.kkl?.mahasiswa || row.kkn?.mahasiswa) {
            const mahasiswa = row.kkl?.mahasiswa || row.kkn?.mahasiswa;
            return `${mahasiswa.name} (${mahasiswa.profilable.nim})`;
        }
        return row.user?.name || "-";
    };

    return {
        Logbook: {
            columns: [
                {
                    Header: "Mahasiswa",
                    accessor: "mahasiswa_info",
                    Cell: ({ row }) => getMahasiswaInfo(row.original),
                    show: ({ user }) => user.role === "dosen",
                },
                { Header: "Tanggal", accessor: "tanggal" },
                { Header: "Catatan", accessor: "catatan" },
                { Header: "Keterangan", accessor: "keterangan" },
                {
                    Header: "Tipe",
                    accessor: "type",
                    Cell: ({ row }) =>
                        row.original.kkl
                            ? "KKL"
                            : row.original.kkn
                                ? "KKN"
                                : "-",
                },
            ],
            data: logbooks?.data || [],
            pagination: logbooks || emptyPagination,
            modalFields: [
                {
                    name: "type",
                    label: "Tipe",
                    type: "select",
                    options: [
                        { value: "KKL", label: "KKL" },
                        { value: "KKN", label: "KKN" },
                    ],
                    required: true,
                },
                { name: "tanggal", label: "Tanggal", type: "date" },
                { name: "catatan", label: "Catatan", type: "textarea" },
                { name: "keterangan", label: "Keterangan", type: "textarea" },
            ],
        },
        Bimbingan: {
            columns: [
                {
                    Header: "Mahasiswa",
                    accessor: "mahasiswa_info",
                    Cell: ({ row }) => getMahasiswaInfo(row.original),
                    show: ({ user }) => user.role === "dosen",
                },
                { Header: "Keterangan", accessor: "keterangan" },
                { Header: "Status", accessor: "status" },
                {
                    Header: "Tipe",
                    accessor: "type",
                    Cell: ({ row }) =>
                        row.original.kkl
                            ? "KKL"
                            : row.original.kkn
                                ? "KKN"
                                : "-",
                },
            ],
            data: bimbingans?.data || [],
            pagination: bimbingans || emptyPagination,
            modalFields: [
                {
                    name: "type",
                    label: "Tipe",
                    type: "select",
                    options: [
                        { value: "KKL", label: "KKL" },
                        { value: "KKN", label: "KKN" },
                    ],
                    required: true,
                },
                { name: "tanggal", label: "Tanggal", type: "date" },
                { name: "keterangan", label: "Keterangan", type: "textarea" },
            ],
        },
    };
};

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
        accessor: "profilable.phone",
        Cell: ({ row }) => row.original.profilable?.phone || "-",
        sortable: true,
    },
    {
        Header: "Alamat",
        accessor: "profilable.address",
        Cell: ({ row }) => row.original.profilable?.address || "-",
        sortable: true,
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
            accessor: "profilable.nip",
            Cell: ({ row }) => row.original.profilable?.nip || "-",
            sortable: true,
        },
    ],
    [USER_TYPES.MAHASISWA]: [
        {
            Header: "NIM",
            accessor: "profilable.nim",
            Cell: ({ value }) => value || "-",
            sortable: true,
        },
        {
            Header: "Angkatan",
            accessor: "profilable.angkatan",
            Cell: ({ value }) => value || "-",
            sortable: true,
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
            accessor: "profilable.identifier",
            Cell: ({ row }) =>
                row.original.profilable?.nim ||
                row.original.profilable?.nip ||
                "-",
            sortable: true,
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

const generateYearOptions = (() => {
    let cachedOptions = null;
    return () => {
        if (cachedOptions) return cachedOptions;

        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 2021; year--) {
            years.push({ value: year, label: year.toString() });
        }
        cachedOptions = years;
        return cachedOptions;
    };
})();

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
        {
            name: "angkatan",
            label: "Angkatan",
            type: "select",
            options: generateYearOptions(),
            required: true,
            parse: (value) => parseInt(value, 10),
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
                        value,
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
                className: `px-2 py-1 rounded-full text-xs ${renderStatusBadge(value)}`,
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
