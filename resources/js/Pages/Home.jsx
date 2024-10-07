import { Head } from "@inertiajs/react";
import LandingPage from "./Home/LandingPage";
import Tutorial from "./Home/Tutorial";
export default function Home() {

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <LandingPage />

            <Tutorial />
        </>
    );
}