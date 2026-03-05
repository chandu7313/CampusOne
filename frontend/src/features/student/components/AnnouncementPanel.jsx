import React, { useState } from 'react';
import { Bell, BookOpen, MessageSquare, Briefcase, FileText } from 'lucide-react';

const TABS = [
    { id: 'academic', label: 'Academic', icon: BookOpen },
    { id: 'admin', label: 'Administrative', icon: FileText },
    { id: 'exam', label: 'Examinations', icon: Bell },
    { id: 'placement', label: 'Placements', icon: Briefcase },
];

const AnnouncementPanel = ({ announcements }) => {
    const [activeTab, setActiveTab] = useState('academic');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex p-1.5 gap-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-border-custom/50">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.75rem] font-bold uppercase tracking-widest transition-all border-none cursor-pointer
                            ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}
                        `}
                    >
                        <tab.icon size={14} />
                        <span className="hidden xl:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {announcements?.filter(a => a.category?.toLowerCase() === activeTab || !a.category).map((a, i) => (
                    <div key={i} className="group p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl border border-border-custom/30 transition-all duration-300">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <h4 className="font-black text-[0.85rem] text-text-main group-hover:text-primary transition-colors leading-tight">{a.title}</h4>
                            <span className="text-[0.55rem] font-black text-text-muted uppercase tracking-widest bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md shrink-0">
                                {new Date(a.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-[0.75rem] text-text-muted leading-relaxed line-clamp-2 font-medium opacity-80">
                            {a.content || a.description}
                        </p>
                    </div>
                ))}
                {(!announcements || announcements.length === 0) && (
                    <div className="py-10 text-center opacity-30 italic text-sm border-2 border-dashed border-border-custom/20 rounded-2xl">
                        No recent {activeTab} notifications
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementPanel;
