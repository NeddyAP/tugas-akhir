import '../css/app.css';
import './bootstrap';
import 'react-toastify/dist/ReactToastify.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import FrontLayout from '@/Layouts/FrontLayout';

createInertiaApp({
    title: (title) => `${title} - FILKOM`,
    // resolve: (name) => {
    //     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    //     const page = pages[`./Pages/${name}.jsx`];

    //     if (!page) {
    //         throw new Error(`Page not found: ${name}`);
    //     }

    //     const PageComponent = page.default;
    //     PageComponent.layout = PageComponent.layout || ((page) => <Layout children={page} />);
    //     return page;
    // },
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
