import Footer from "@/Layouts/Footer";
import Navbar from "@/Layouts/Navbar";
import { Head, Link } from "@inertiajs/react";

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta
                    head-key="description"
                    name="description"
                    content="This is the default description"
                />
            </Head>

            <Navbar />

            <div className="my-auto">
                {children}
            </div>

            <Footer />
        </>
    );
}