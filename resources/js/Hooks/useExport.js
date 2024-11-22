import { useCallback } from 'react';
import { createExportHandler } from '@/utils/exportService';

export const useExport = ({ routeName, searchParams = {}, columns }) => {
    const handleExport = useCallback((format) => {
        const exportHandler = createExportHandler({
            route: (params) => route(routeName, params),
            format,
            params: searchParams,
            columns
        });
        return exportHandler();
    }, [routeName, searchParams, columns]);

    return handleExport;
};
