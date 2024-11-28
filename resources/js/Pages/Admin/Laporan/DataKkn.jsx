import React from "react";
import BaseLaporanData from "./components/BaseLaporanData";

export default function DataKkn({ laporans, allLaporans, mahasiswas, dosens }) {
    return (
        <BaseLaporanData
            type="kkn"
            title="Data KKN"
            description="Kelola data KKN mahasiswa"
            laporans={laporans}
            allLaporans={allLaporans}
            mahasiswas={mahasiswas}
            dosens={dosens}
        />
    );
}

DataKkn.propTypes = BaseLaporanData.propTypes;
