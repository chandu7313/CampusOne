import React from 'react';
import { 
    Activity, ShieldCheck, CalendarRange, PhoneCall, 
    FileText, SearchCode, Luggage, Map
} from 'lucide-react';

const LINKS = [
    { icon: PhoneCall, label: 'Assistance or Enquiry', color: 'bg-indigo-500' },
    { icon: Luggage, label: 'Placement Portal', color: 'bg-primary' },
    { icon: FileText, label: 'Fee Dashboard', color: 'bg-emerald-500' },
    { icon: CalendarRange, label: 'Academic Calendar', color: 'bg-amber-500' },
    { icon: ShieldCheck, label: 'Certificate Request', color: 'bg-primary' },
    { icon: Map, label: 'Campus Map', color: 'bg-cyan-500' },
];

const ImportantLinks = () => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] px-2 opacity-60">System Portals</h3>
            <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x cursor-grab active:cursor-grabbing scroll-smooth">
                    {LINKS.map((link, i) => (
                    <button 
                        key={i}
                        className="snap-start flex items-center gap-3 bg-bg-card hover:bg-black/5 dark:hover:bg-white/5 border border-border-custom/80 px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group min-w-fit cursor-pointer outline-none shrink-0"
                    >
                        <div className={`w-10 h-10 ${link.color}/10 rounded-xl flex items-center justify-center ${link.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform border border-current/10 shadow-sm`}>
                            <link.icon size={18} />
                        </div>
                        <span className="font-bold text-sm text-text-main transition-colors">{link.label}</span>
                    </button>
                    ))}
                </div>
                {/* Visual fade effect for scroll hints */}
                <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-bg-main to-transparent pointer-events-none hidden md:block" />
            </div>
        </div>
    );
};

export default ImportantLinks;
