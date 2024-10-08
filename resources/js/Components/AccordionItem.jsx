const AccordionItem = ({ index, openIndex, toggleAccordion, question, answer }) => (
    <div className="border-b border-gray-300 py-4">
        <h2>
            <button
                className="w-full text-left text-xl font-semibold"
                onClick={() => toggleAccordion(index)}
            >
                {question}
            </button>
        </h2>
        <div
            className={`mt-2 transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            {answer}
        </div>
    </div>
);

export default AccordionItem;