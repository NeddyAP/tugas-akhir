export const downloadFile = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        const contentDisposition = response.headers.get("Content-Disposition");
        const filenameMatch =
            contentDisposition && contentDisposition.match(/filename="(.+)"/);
        link.download = filenameMatch ? filenameMatch[1] : "download";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

export const copyToClipboard = async (headers, data) => {
    try {
        const headerRow = headers.join("\t");
        const dataRows = data.map((row) =>
            headers.map((header) => row[header] || "").join("\t"),
        );
        const text = [headerRow, ...dataRows].join("\n");

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return { success: true };
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand("copy");
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: new Error("Failed to copy to clipboard"),
            };
        } finally {
            document.body.removeChild(textarea);
        }
    } catch (error) {
        return { success: false, error };
    }
};

export const createExportHandler =
    ({ route, format, params = {}, columns }) =>
    async () => {
        try {
            if (format === "copy") {
                const response = await fetch(
                    route({ ...params, format: "all" }),
                );
                if (!response.ok) throw new Error("Failed to fetch data");
                const { data } = await response.json();

                const headers = columns.map((col) => col.Header);
                const tableData = data.map((row) =>
                    columns.reduce(
                        (acc, col) => ({
                            ...acc,
                            [col.Header]: row[col.accessor],
                        }),
                        {},
                    ),
                );

                const result = await copyToClipboard(headers, tableData);
                if (!result.success) throw result.error;
                alert("Data berhasil disalin ke clipboard!");
                return;
            }

            const url = route({ ...params, format });
            const result = await downloadFile(url);
            if (!result.success) throw result.error;
        } catch (error) {
            alert("Gagal mengekspor data. Silakan coba lagi.");
        }
    };
