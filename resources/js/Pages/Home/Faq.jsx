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
            class="relative w-full bg-white px-6 pt-10 pb-8 mt-20 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
            <div class="mx-auto px-5">
                <div class="flex flex-col items-center">
                    <h2 class="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">FAQ</h2>
                    <p class="mt-3 text-lg text-neutral-500 md:text-xl">Pertanyaan yang Sering Diajukan

                    </p>
                </div>
                <Accordion items={faqItems} />
            </div>
        </div>
    );
}