import Accordion from '@/Components/Accordion';

export default function Faq() {
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
        <div
            className="relative w-full px-6 pt-10 pb-8 mt-20 bg-white shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
            <div className="px-5 mx-auto">
                <div className="flex flex-col items-center">
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-center md:text-5xl">FAQ</h2>
                    <p className="mt-3 text-lg text-neutral-500 md:text-xl">Pertanyaan yang Sering Diajukan

                    </p>
                </div>
                <Accordion items={faqItems} />
            </div>
        </div>
    );
}