import React from "react";
import BaseLaporanData from "./components/BaseLaporanData";

export default function DataKkl({ laporans, mahasiswas, dosens }) {
    return (
        <BaseLaporanData
            type="kkl"
            title="Data KKL"
            description="Kelola data KKL mahasiswa"
            laporans={laporans}
            mahasiswas={mahasiswas}
            dosens={dosens}
        />
    );
}

DataKkl.propTypes = BaseLaporanData.propTypes;