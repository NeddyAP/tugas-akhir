import React, { useState } from 'react';

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="relative w-full mx-auto overflow-hidden text-sm font-normal bg-white border border-gray-200 divide-y divide-gray-200 rounded-md">
            {items.map((item, index) => (
                <div key={index} className="cursor-pointer group">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="flex items-center justify-between w-full p-4 text-left select-none group-hover:underline"
                    >
                        <span>{item.question}</span>
                        <svg
                            className={`w-4 h-4 duration-200 ease-out ${activeIndex === index ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    {activeIndex === index && (
                        <div className="p-4 pt-0 opacity-70">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Accordion;