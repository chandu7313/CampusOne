import React, { useState } from 'react';
import { useMessages, useMarkMessageRead } from '../../hooks/useCommunication';
import { MessageSquare, Check, Search, Filter } from 'lucide-react';

const MessageCenter = () => {
    const { data: messages, isLoading } = useMessages();
    const markReadMutation = useMarkMessageRead();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD

    if (isLoading) {
        return <div className="p-20 flex justify-center text-primary font-bold animate-pulse">Loading Messages...</div>;
    }

    const filteredMessages = messages?.filter(msg => {
        const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              msg.sender?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || (filter === 'UNREAD' && !msg.isRead);
        return matchesSearch && matchesFilter;
    });

    const unreadCount = messages?.filter(m => !m.isRead).length || 0;

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-700 h-[calc(100vh-120px)]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border-custom/50 pb-6 shrink-0 shrink-0 px-2 mt-4 md:mt-0">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase">
                        Message <span className="text-primary italic">Center</span>
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-1">Official communications & alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                        <button 
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'ALL' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('UNREAD')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${filter === 'UNREAD' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${filter === 'UNREAD' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="glass-card rounded-3xl border border-border-custom/50 overflow-hidden flex flex-col flex-1 relative">
                
                {/* Search Bar */}
                <div className="p-4 border-b border-border-custom bg-black/5 dark:bg-white/5 flex items-center gap-3 shrink-0">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full bg-background border border-border-custom rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-text-main outline-none focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    {filteredMessages?.length > 0 ? (
                        <div className="divide-y divide-border-custom text-text-main">
                            {filteredMessages.map(msg => (
                                <div 
                                    key={msg.id} 
                                    onClick={() => !msg.isRead && markReadMutation.mutate(msg.id)}
                                    className={`p-5 flex gap-4 transition-colors cursor-pointer relative group ${msg.isRead ? 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5' : 'bg-primary/5 hover:bg-primary/10'}`}
                                >
                                    {!msg.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                    )}
                                    
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                                        {msg.sender?.avatar ? (
                                            <img src={msg.sender.avatar} alt="Sender" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-lg text-text-muted uppercase">
                                                {msg.sender?.firstName?.[0]}{msg.sender?.lastName?.[0]}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1 gap-2">
                                            <h4 className={`text-base truncate ${msg.isRead ? 'font-semibold text-text-main' : 'font-black text-text-main'}`}>
                                                {msg.sender?.firstName} {msg.sender?.lastName}
                                            </h4>
                                            <span className={`text-xs whitespace-nowrap ${msg.isRead ? 'text-text-muted font-medium' : 'text-primary font-bold'}`}>
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h5 className={`text-sm mb-1 truncate ${msg.isRead ? 'text-text-muted font-medium' : 'text-text-main font-bold'}`}>
                                            {msg.subject}
                                        </h5>
                                        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                                            {msg.body}
                                        </p>
                                    </div>

                                    {!msg.isRead && (
                                        <div className="shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-white dark:bg-black border border-primary text-primary p-2 rounded-full shadow-sm" title="Mark as read">
                                                <Check size={16} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted/50 p-10 text-center">
                            <MessageSquare size={64} className="mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-text-main/70 mb-1">Inbox Zero</h3>
                            <p className="max-w-xs text-sm">You have no messages matching your current filters.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessageCenter;
