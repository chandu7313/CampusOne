import React from 'react';
import { Rocket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ featureName }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="relative glass-card p-8 bg-primary/5 border-primary/10 transition-transform hover:scale-105 duration-500">
                    <Rocket size={80} className="text-primary animate-bounce shadow-primary/20" />
                </div>
            </div>
            
            <h1 className="text-4xl font-black italic tracking-tighter text-text-main mb-4 uppercase">
                {featureName || 'Feature'} <span className="text-primary italic">Coming Soon</span>
            </h1>
            
            <p className="max-w-md text-text-muted font-medium mb-10 leading-relaxed">
                We're currently handcrafting this module to ensure it meets our premium quality standards. Stay tuned for a world-class experience!
            </p>
            
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/40 transition-all border-none cursor-pointer group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                Go Back
            </button>

            <div className="mt-16 flex gap-4 opacity-20">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                ))}
            </div>
        </div>
    );
};

export default ComingSoon;
