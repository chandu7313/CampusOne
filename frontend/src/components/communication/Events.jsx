import React from 'react';
import { useEvents } from '../../hooks/useCommunication';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Events = () => {
    const { data: events, isLoading } = useEvents();

    if (isLoading) {
        return <div className="p-20 flex justify-center text-primary font-bold animate-pulse">Loading Events...</div>;
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-700 h-[calc(100vh-120px)]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border-custom/50 pb-6 shrink-0 px-2 mt-4 md:mt-0">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase flex items-center gap-3">
                        <Calendar className="text-primary" size={32} />
                        Events & <span className="text-primary italic">Societies</span>
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-1">Discover campus activities and register for events.</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                {events?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {events.map((event) => {
                            const eventDate = new Date(event.startDate);
                            const isMultiDay = event.endDate && new Date(event.endDate).getDate() !== eventDate.getDate();

                            return (
                                <div key={event.id} className="glass-card rounded-3xl overflow-hidden flex flex-col border border-border-custom hover:border-primary/50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] group">
                                    <div className="h-40 bg-gradient-to-br from-primary/80 to-primary/20 relative p-6 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded border border-white/20 text-white text-[0.65rem] font-black uppercase tracking-widest">
                                                {event.category || 'Event'}
                                            </span>
                                        </div>
                                        <div className="text-white">
                                            <div className="text-3xl font-black leading-none mb-1">{eventDate.getDate()}</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-80">
                                                {eventDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h2>
                                        <p className="text-sm text-text-muted font-medium line-clamp-2 mb-6 flex-1">
                                            {event.description}
                                        </p>
                                        
                                        <div className="flex flex-col gap-3 text-xs font-bold text-text-muted bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Clock size={14} className="text-primary" />
                                                <span className="truncate">
                                                    {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMultiDay && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={14} className="text-primary" />
                                                <span className="truncate">{event.location || 'TBA'}</span>
                                            </div>
                                            {(event.capacity > 0) && (
                                                <div className="flex items-center gap-3">
                                                    <Users size={14} className="text-primary" />
                                                    <span className="truncate">Limit: {event.capacity} seats</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button className="mt-6 w-full py-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm uppercase tracking-wider transition-all">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card rounded-3xl p-16 flex flex-col items-center justify-center text-center text-text-muted h-full border-dashed">
                        <Calendar size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-text-main mb-2">No Upcoming Events</h3>
                        <p className="max-w-md mx-auto">There are no events scheduled for the upcoming weeks.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
