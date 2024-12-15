export const handleError = (error, type = 'client') => {
    const errorData = {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan yang tidak terduga',
        debug: process.env.NODE_ENV === 'development' ? error : null,
        type
    };

    router.visit('/error', {
        data: errorData,
        preserveState: false
    });
};
