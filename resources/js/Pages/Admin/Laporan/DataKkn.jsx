import React from "react";
import BaseLaporanData from "./components/BaseLaporanData";

export default function DataKkn({
    laporans,
    allLaporans,
    mahasiswas,
    dosens,
    selectedIds,
    onSelectedIdsChange,
    onBulkUpdate,
}) {
    return (
        <BaseLaporanData
            type="kkn"
            title="Data KKN"
            description="Kelola data KKN mahasiswa"
            laporans={laporans}
            allLaporans={allLaporans}
            mahasiswas={mahasiswas}
            dosens={dosens}
            selectedIds={selectedIds}
            onSelectedIdsChange={onSelectedIdsChange}
            onBulkUpdate={onBulkUpdate}
        />
    );
}

DataKkn.propTypes = {
    ...BaseLaporanData.propTypes,
};
