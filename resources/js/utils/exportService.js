export async function copyToClipboard(headers, data) {
    const headerRow = headers.join('\t');
    const dataRows = data
        .map(row => headers.map(header => row[header] || '').join('\t'))
        .join('\n');
    const textToCopy = `${headerRow}\n${dataRows}`;

    try {
        // Try using the Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
            return { success: true };
        }

        // Fallback for older browsers or non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return { success: true };
    } catch (error) {
        console.error('Copy failed:', error);
        return { success: false, error };
    }
}

export async function downloadFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : 'download';

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        return { success: true };
    } catch (error) {
        console.error('Download failed:', error);
        return { success: false, error };
    }
}
