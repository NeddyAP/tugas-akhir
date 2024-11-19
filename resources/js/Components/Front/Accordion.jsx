import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = React.memo(({ item, isActive, onToggle }) => (
    <div className="py-5">
        <details
            className="group"
            open={isActive}
            onClick={(e) => {
                e.preventDefault();
                onToggle();
            }}
        >
            <summary className="flex items-center justify-between font-medium list-none cursor-pointer">
                <span>{item.question}</span>
                <ChevronDown
                    className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                />
            </summary>
            {isActive && (
                <p className="mt-3 animate-fadeIn text-neutral-600 dark:text-neutral-400">
                    {item.answer}
                </p>
            )}
        </details>
    </div>
));

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <div className="grid max-w-xl mx-auto mt-8 divide-y divide-neutral-200">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    item={item}
                    isActive={activeIndex === index}
                    onToggle={() => toggleAccordion(index)}
                />
            ))}
        </div>
    );
};

export default Accordion;