import { useMemo, useState } from "react";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import { useForm } from "@inertiajs/react";
import PropTypes from 'prop-types';

const LaporanTable = ({ data, type, pagination }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const {
        data: formData,
        setData,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        status: "",
        keterangan: "",
    });

    const columns = useMemo(() => [
        {
            Header: "Mahasiswa",
            accessor: "mahasiswa.name",
        },
        {
            Header: "Tanggal Mulai",
            accessor: "tanggal_mulai",
        },
        {
            Header: "Tanggal Selesai",
            accessor: "tanggal_selesai",
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        value === "approved"
                            ? "bg-green-100 text-green-800"
                            : value === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {value?.toUpperCase() || "PENDING"}
                </span>
            ),
        },
        {
            Header: "File",
            accessor: "laporan",
            Cell: ({ value }) => {
                if (!value) return "Belum ada file";

                const fileName = value.file
                    ? value.file.split("/").pop()
                    : null;
                const fileUrl = fileName
                    ? route("files.laporan", fileName)
                    : "#";

                return (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800"
                    >
                        Lihat PDF
                    </a>
                );
            },
        },
        {
            Header: "Keterangan",
            accessor: "laporan.keterangan",
            Cell: ({ value }) => (
                <div className="text-sm text-gray-500">{value || "-"}</div>
            ),
        },
    ]);

    const handleEdit = (rowData) => {
        setEditingData(rowData);
        setData({
            status: rowData.status || "",
            keterangan: rowData.laporan?.keterangan || "",
        });
        setIsModalOpen(true);
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={data || []}
                actions={{
                    handleEdit,
                }}
                pagination={pagination}
            />

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                    setEditingData(null);
                }}
                title={`Update ${type.toUpperCase()} Status`}
                fields={[
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { value: "pending", label: "Pending" },
                            { value: "approved", label: "Approved" },
                            { value: "rejected", label: "Rejected" },
                        ],
                    },
                    {
                        name: "keterangan",
                        label: "Keterangan",
                        type: "textarea",
                        rows: 3,
                    },
                ]}
                data={formData}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={(e) => {
                    e.preventDefault();
                    put(
                        route(`laporan.${type}.update`, { id: editingData.id }),
                        {
                            onSuccess: () => {
                                setIsModalOpen(false);
                                reset();
                                setEditingData(null);
                            },
                        }
                    );
                }}
            />
        </>
    );
};

LaporanTable.propTypes = {
    data: PropTypes.array,
    type: PropTypes.string.isRequired,
    pagination: PropTypes.shape({
        pageIndex: PropTypes.number,
        pageCount: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number,
        from: PropTypes.number,
        to: PropTypes.number,
    }).isRequired,
};

export default LaporanTable;
