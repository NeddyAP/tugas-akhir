import "../css/app.css";
import "./bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { LoadingProvider } from "./Contexts/LoadingContext";

createInertiaApp({
    title: (title) => `${title} - FILKOM`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = (
            <LoadingProvider>
                <App {...props} />
            </LoadingProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, root);
            return;
        }
        createRoot(el).render(root);
    },
    progress: {
        color: "#4B5563",
    },
});
