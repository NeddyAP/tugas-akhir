import React from 'react';
import Accordion from '@/Components/Front/Accordion';

const Faq = ({ faqs }) => (
    <div className="relative w-full px-6 pt-10 pb-8 mt-20 bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
        <div className="px-5 mx-auto">
            <div className="flex flex-col items-center">
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-center md:text-5xl dark:text-white">FAQ</h2>
                <p className="mt-3 text-lg text-neutral-500 md:text-xl dark:text-neutral-400">Pertanyaan yang Sering Diajukan</p>
            </div>
            <Accordion items={faqs} />
        </div>
    </div>
);

export default React.memo(Faq);
