import React from "react";
import BaseLaporanData from "./components/BaseLaporanData";

export default function DataKkl({ 
    laporans, 
    allLaporans, 
    mahasiswas, 
    dosens, 
    selectedIds,
    onSelectedIdsChange,
    onBulkUpdate 
}) {
    return (
        <BaseLaporanData
            type="kkl"
            title="Data KKL"
            description="Kelola data KKL mahasiswa"
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

DataKkl.propTypes = {
    ...BaseLaporanData.propTypes,
};
