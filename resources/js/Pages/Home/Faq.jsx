import AccordionItem from '@/Components/AccordionItem';
import { useState } from 'react';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqItems = [
        {
            question: 'Apa itu Filkom?',
            answer: 'Filkom adalah singkatan dari Fakultas Ilmu Komputer, yang merupakan Fakultas Ilmu Komputer di Universitas Djuanda.',
        },
        {
            question: 'Apa tujuan dari Filkom?',
            answer: 'Filkom adalah fakultas yang menyediakan pendidikan di bidang ilmu komputer dan teknologi informasi.',
        },
        {
            question: 'Apa visi dari Filkom?',
            answer: 'Visi Filkom adalah menjadi fakultas kelas dunia di bidang ilmu komputer dan teknologi informasi.',
        },
        {
            question: 'Apa misi dari Filkom?',
            answer: 'Misi Filkom adalah menyediakan pendidikan berkualitas tinggi di bidang ilmu komputer dan teknologi informasi, melakukan penelitian dan pengabdian kepada masyarakat, serta berkontribusi pada pengembangan ilmu pengetahuan dan teknologi.',
        },
    ];

    return (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
            <h1 className="text-3xl font-bold mt-8 mb-4">Pertanyaan yang Sering Diajukan</h1>
            <div className="accordion">
                {faqItems.map((item, index) => (
                    <AccordionItem
                        key={index}
                        index={index}
                        openIndex={openIndex}
                        toggleAccordion={toggleAccordion}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </div>
    );
}