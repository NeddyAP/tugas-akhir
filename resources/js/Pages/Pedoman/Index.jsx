import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';

const Card = ({ title, description }) => (
    <div className="flex-shrink-0 w-64 p-6 transition-all duration-300 bg-white rounded-lg shadow-xl cursor-pointer group ring-1 ring-gray-900/5 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative z-10">
            <span className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-sky-500 group-hover:bg-sky-400">
                <MessageCircle className="w-6 h-6 text-white transition-all" />
            </span>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-all duration-300 group-hover:text-sky-500">{title}</h3>
            <p className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-500">{description}</p>
            <div className="pt-4 text-sm font-semibold leading-7">
                <a href="#" className="transition-all duration-300 text-sky-500 group-hover:text-sky-600">
                    Read the docs &rarr;
                </a>
            </div>
        </div>
    </div>
);

const CardGrid = ({ cards }) => (
    <Link href="#">
        <div className="flex flex-col justify-center min-h-screen py-6 bg-gray-50 sm:py-12">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card, index) => (
                        <Card key={index} {...card} />
                    ))}
                </div>
            </div>
        </div>
    </Link>
);

export default function Index() {
    const cardData = [
        {
            title: "Card 1",
            description: "Perfect for learning how the framework works, prototyping a new idea, or creating a demo to share online."
        },
        {
            title: "Card 2",
            description: "Explore advanced features and techniques to take your projects to the next level."
        }
    ];

    return (
        <>
            <Head title="Pedoman" />
            <Layout>
                <CardGrid cards={cardData} />
            </Layout>
        </>
    );
}