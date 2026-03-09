import React from 'react';
import { useAnnouncements } from '../../hooks/useCommunication';
import { Bell, Megaphone } from 'lucide-react';

const Announcements = () => {
    const { data: announcements, isLoading } = useAnnouncements();

    if (isLoading) {
        return <div className="p-20 flex justify-center text-primary font-bold animate-pulse">Loading Announcements...</div>;
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1000px] mx-auto pb-20 animate-in fade-in duration-700 h-[calc(100vh-120px)]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border-custom/50 pb-6 shrink-0 px-2 mt-4 md:mt-0">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase flex items-center gap-3">
                        <Megaphone className="text-primary" size={32} />
                        Campus <span className="text-primary italic">Announcements</span>
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-1">Stay updated with the latest news and notices.</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-6">
                {announcements?.length > 0 ? (
                    announcements.map((announcement) => (
                        <div key={announcement.id} className="glass-card rounded-3xl p-6 border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-text-main mb-1">{announcement.title}</h2>
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                                        <span>{announcement.author?.firstName} {announcement.author?.lastName}</span>
                                        <span className="w-1 h-1 rounded-full bg-border-custom"></span>
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{announcement.type || 'General'}</span>
                                    </div>
                                </div>
                                <div className="text-right sm:text-left bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-border-custom/50 flex flex-col items-center justify-center min-w-[70px]">
                                    <span className="block text-2xl font-black text-primary leading-none">
                                        {new Date(announcement.createdAt).getDate()}
                                    </span>
                                    <span className="text-[0.65rem] uppercase font-bold tracking-widest text-text-muted">
                                        {new Date(announcement.createdAt).toLocaleString('default', { month: 'short' })}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose dark:prose-invert prose-sm max-w-none text-text-muted font-medium bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                                {announcement.content}
                            </div>
                            
                            {announcement.attachmentUrl && (
                                <div className="mt-4 flex">
                                    <a 
                                        href={announcement.attachmentUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <Bell size={16} /> View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass-card rounded-3xl p-16 flex flex-col items-center justify-center text-center text-text-muted h-full border-dashed">
                        <Megaphone size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-text-main mb-2">All Caught Up!</h3>
                        <p className="max-w-md mx-auto">There are no active announcements to display at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
