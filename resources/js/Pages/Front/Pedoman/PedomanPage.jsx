import React, { useState, useMemo } from "react";
import { FileText, Search } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import PropTypes from "prop-types";

const SearchBar = React.memo(({ onSearch }) => (
    <div className="relative my-10">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Cari panduan..."
            onChange={(e) => onSearch(e.target.value)}
        />
    </div>
));

const Card = React.memo(({ title, description, file }) => (
    <div className="flex-shrink-0 w-full p-6 transition-all duration-300 bg-white rounded-lg shadow-xl cursor-pointer dark:bg-gray-800 group ring-1 ring-gray-900/5 dark:ring-gray-100/5 hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex items-center w-full gap-6">
            <span className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-sky-500 group-hover:bg-sky-400">
                <FileText className="w-6 h-6 text-white transition-all" />
            </span>
            <div className="flex-grow">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-all duration-300 dark:text-gray-100 group-hover:text-sky-500">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 transition-all duration-300 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-400">
                    {description}
                </p>
            </div>
            <div className="flex-shrink-0 pl-4 text-sm font-semibold">
                <a
                    href={`/storage/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 text-sky-500 dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300"
                >
                    Baca panduan &rarr;
                </a>
            </div>
        </div>
    </div>
));

const CardGrid = React.memo(({ panduans }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPanduans = useMemo(() => {
        return panduans.filter((panduan) =>
            panduan.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [panduans, searchQuery]);

    return (
        <div className="flex flex-col justify-start min-h-screen py-6 bg-gray-50 dark:bg-gray-900 sm:py-12">
            <div className="w-full max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                <SearchBar onSearch={setSearchQuery} />
                <div className="flex flex-col gap-4">
                    {filteredPanduans.map((panduan, index) => (
                        <Card key={index} {...panduan} />
                    ))}
                </div>
            </div>
        </div>
    );
});

export default function PedomanPage({ panduans }) {
    return (
        <FrontLayout>
            <Head title="Pedoman" />
            <CardGrid panduans={panduans} />
        </FrontLayout>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
};

CardGrid.propTypes = {
    panduans: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            file: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

PedomanPage.propTypes = {
    panduans: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            file: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
