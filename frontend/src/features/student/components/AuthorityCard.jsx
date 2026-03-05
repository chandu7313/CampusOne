import React from 'react';
import { Mail, Phone, Calendar, ArrowUpRight } from 'lucide-react';

const AuthorityCard = ({ authority }) => {
    return (
        <div className="bg-bg-card p-4 flex items-center gap-4 group hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 border border-border-custom/50 rounded-2xl cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-border-custom group-hover:border-primary transition-colors shrink-0">
                <img 
                    src={authority.photo || `https://ui-avatars.com/api/?name=${authority.name}&background=random`} 
                    alt={authority.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div className="min-w-0">
                        <h4 className="text-[0.9rem] font-black text-text-main group-hover:text-primary transition-colors tracking-tight truncate shrink-0">{authority.name}</h4>
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-text-muted">{authority.designation}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-[0.65rem] text-text-muted font-bold truncate">
                    <Mail size={10} className="opacity-40" /> {authority.email || 'Contact via Portal'}
                </div>
            </div>
            
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                <ArrowUpRight size={14} />
            </div>
        </div>
    );
};

export default AuthorityCard;
