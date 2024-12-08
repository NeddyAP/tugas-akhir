import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import DataTable from "@/Components/ui/DataTable";
import GenericModal from "@/Components/ui/GenericModal";
import PropTypes from "prop-types";
import { formatDate2 } from "@/utils/helpers";

const getYouTubeId = (url) => {
    if (!url) return false;
    const match = url.match(
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    );
    return match && match[7].length === 11 ? match[7] : url;
};

const YouTubePreview = React.memo(({ link }) => {
    if (!link)
        return <span className="text-gray-500">No video link provided</span>;

    const videoId = getYouTubeId(link);
    if (!videoId)
        return <span className="text-red-500">Invalid YouTube URL or ID</span>;

    return (
        <div className="relative w-full px-20 pt-36">
            <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
});

export default function Tutorial({ informations }) {
    const { delete: destroy } = useForm();
    const [modalState, setModalState] = useState({
        isOpen: false,
        editingData: null,
    });
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            title: "",
            description: "",
            link: "",
            type: "tutorial",
        });

    const TABLE_CONFIG = useMemo(
        () => ({
            columns: [
                {
                    Header: "Video",
                    accessor: "videoPreview",
                    Cell: ({ row }) => (
                        <YouTubePreview link={row.original.link} />
                    ),
                },
                { Header: "Judul", accessor: "title", sortable: true },
                {
                    Header: "Deskripsi",
                    accessor: "description",
                    sortable: true,
                },
                {
                    Header: "Kode Youtube",
                    accessor: "link",
                    sortable: true,
                    Cell: ({ value }) => getYouTubeId(value) || value,
                },
                {
                    Header: "Tanggal Dibuat",
                    accessor: "created_at",
                    sortable: true,
                    Cell: ({ value }) => formatDate2(value),
                },
            ],
            modalFields: [
                { name: "title", label: "Judul", type: "text" },
                {
                    name: "description",
                    label: "Deskripsi",
                    type: "textarea",
                    rows: 3,
                },
                { name: "link", label: "Link YouTube", type: "text" },
            ],
            defaultSort: "created_at",
        }),
        [],
    );

    useEffect(() => {
        if (modalState.isOpen) {
            if (modalState.editingData) {
                setData({
                    title: modalState.editingData.title,
                    description: modalState.editingData.description,
                    link: modalState.editingData.link,
                    type: "tutorial",
                });
            } else {
                reset();
            }
        } else {
            reset();
            clearErrors();
        }
    }, [modalState.isOpen, modalState.editingData]);

    const handleModalClose = useCallback(() => {
        setModalState({ isOpen: false, editingData: null });
    }, []);

    const tableActions = useMemo(
        () => ({
            handleEdit: (row) =>
                setModalState({ isOpen: true, editingData: row }),
            handleDelete: (row) => {
                if (
                    window.confirm("Kamu yakin ingin menghapus tutorial ini?")
                ) {
                    destroy(
                        route("admin.informations.destroy", row.id) +
                            `?type=tutorial`,
                        {
                            preserveScroll: true,
                            preserveState: true,
                        },
                    );
                }
            },
            handleAdd: () => setModalState({ isOpen: true, editingData: null }),
        }),
        [destroy],
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const videoId = getYouTubeId(data.link);
            if (!videoId) return;

            const formData = {
                title: data.title,
                description: data.description,
                link: videoId,
                type: "tutorial",
            };

            if (modalState.editingData) {
                put(
                    route(
                        "admin.informations.update",
                        modalState.editingData.id,
                    ),
                    {
                        ...formData,
                        preserveScroll: true,
                        onSuccess: () => {
                            setModalState({ isOpen: false, editingData: null });
                            clearErrors();
                        },
                    },
                );
            } else {
                post(route("admin.informations.store"), {
                    ...formData,
                    onSuccess: () => {
                        setModalState({ isOpen: false, editingData: null });
                        clearErrors();
                    },
                });
            }
        },
        [modalState.editingData, data, put, post, clearErrors],
    );

    const pagination = useMemo(
        () => ({
            pageIndex: informations.current_page - 1,
            pageCount: informations.last_page,
            pageSize: informations.per_page,
            total: informations.total,
            from: informations.from,
            to: informations.to,
        }),
        [informations],
    );

    return (
        <div className="grid grid-cols-1 mb-8">
            <div className="flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                            Tutorial Video
                        </h2>
                        <i className="text-sm text-gray-400">
                            hanya satu video terbaru yang akan ditampilkan
                        </i>
                    </div>
                    <button
                        type="button"
                        onClick={tableActions.handleAdd}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        Tambah Tutorial
                    </button>
                </header>

                <div className="pb-4 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <DataTable
                                columns={TABLE_CONFIG.columns}
                                data={informations.data || []}
                                actions={tableActions}
                                defaultSortBy={TABLE_CONFIG.defaultSort}
                                pagination={pagination}
                            />
                        </div>
                    </div>
                </div>

                <GenericModal
                    isOpen={modalState.isOpen}
                    onClose={handleModalClose}
                    title={`${
                        modalState.editingData ? "Edit" : "Tambah"
                    } Tutorial`}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    clearErrors={clearErrors}
                    fields={TABLE_CONFIG.modalFields}
                />
            </div>
        </div>
    );
}

Tutorial.propTypes = {
    informations: PropTypes.shape({
        data: PropTypes.array.isRequired,
        current_page: PropTypes.number.isRequired,
        last_page: PropTypes.number.isRequired,
        per_page: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        from: PropTypes.number,
        to: PropTypes.number,
    }).isRequired,
};
