import React from "react";
import { router } from "@inertiajs/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error:", error, errorInfo);

        // Use Inertia router instead of window.location
        router.visit("/error", {
            data: {
                status: 500,
                message:
                    error.message ||
                    "Terjadi kesalahan yang tidak terduga pada aplikasi",
                debug:
                    process.env.NODE_ENV === "development"
                        ? {
                              componentStack: errorInfo.componentStack,
                              error: error.toString(),
                          }
                        : null,
            },
            preserveState: false,
            preserveScroll: false,
        });
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
