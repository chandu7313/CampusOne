import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const SLIDES = [
    {
        title: "Annual convocation 2024",
        description: "Join us for the grand celebration of our graduating batch this summer at the Main Auditorium.",
        image: "https://images.unsplash.com/photo-1523050853064-dbad350c74cf?auto=format&fit=crop&q=80&w=1200",
        tag: "Events"
    },
    {
        title: "Merit scholarships open",
        description: "Applications are now invited for the Academic Excellence Scholarship for Semester 2.",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
        tag: "Scholarships"
    },
    {
        title: "Google recruitment drive",
        description: "Placement cell announces technical hiring for final year CS/IT students starting next week.",
        image: "https://images.unsplash.com/photo-1573161158332-540cb05bacef?auto=format&fit=crop&q=80&w=1200",
        tag: "Placements"
    }
];

const BannerSlider = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[340px] rounded-[32px] overflow-hidden shadow-xl group border border-border-custom bg-bg-card">
            {SLIDES.map((slide, idx) => (
                <div 
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                >
                    <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 flex flex-col justify-end">
                        <span className="bg-primary/20 text-primary border border-primary/30 text-[0.7rem] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full w-fit mb-4 backdrop-blur-md">
                            {slide.tag}
                        </span>
                        <h2 className="text-4xl font-black text-white mb-4 max-w-2xl leading-tight uppercase italic tracking-tighter">
                            {slide.title}
                        </h2>
                        <p className="text-text-muted text-lg max-w-xl line-clamp-2 opacity-80 font-medium">
                            {slide.description}
                        </p>
                    </div>
                </div>
            ))}

            {/* Manual Controls */}
            <div className="absolute bottom-12 right-12 flex items-center gap-3">
                <button onClick={prev} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border-none cursor-pointer">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2 mx-2">
                    {SLIDES.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`} 
                        />
                    ))}
                </div>
                <button onClick={next} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border-none cursor-pointer">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default BannerSlider;
