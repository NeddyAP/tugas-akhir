import { Head } from "@inertiajs/react";
import LandingPage from "./LandingPage";
import Tutorial from "./Tutorial";
import Faq from "./Faq";
import Layout from "@/Layouts/Layout";
export default function Index() {

    return (
        <>
            <Head title="Home" />
            <Layout>
                <LandingPage />

                <Tutorial />

                <Faq />
            </Layout>
        </>
    );
}