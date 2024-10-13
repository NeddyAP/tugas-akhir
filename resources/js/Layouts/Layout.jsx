import Footer from "@/Layouts/Footer";
import Navbar from "@/Layouts/Navbar";
import { Head } from "@inertiajs/react";

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

            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}