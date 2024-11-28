import React from "react";
import Accordion from "@/Components/Front/Accordion";

const Faq = ({ faqs }) => (
    <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="container max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
            <div className="p-6 transition-colors duration-200 bg-white shadow-xl dark:bg-gray-800 rounded-2xl sm:p-8 lg:p-10 ring-1 ring-gray-900/5">
                <div className="flex flex-col items-center mb-10 sm:mb-12">
                    <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                        FAQ
                    </h2>
                    <p className="mt-3 text-base text-center text-gray-600 sm:text-lg dark:text-gray-300">
                        Pertanyaan yang Sering Diajukan
                    </p>
                </div>
                <div className="space-y-4">
                    <Accordion items={faqs} />
                </div>
            </div>
        </div>
    </section>
);

export default React.memo(Faq);
