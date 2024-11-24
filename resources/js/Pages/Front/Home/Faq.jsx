import React from 'react';
import Accordion from '@/Components/Front/Accordion';

const Faq = ({ faqs }) => (
    <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 ring-1 ring-gray-900/5 transition-colors duration-200">
                <div className="flex flex-col items-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center">
                        FAQ
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
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
