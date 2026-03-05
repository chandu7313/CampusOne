import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Book, PlusCircle } from 'lucide-react';
import { useTimetables, useClassrooms, useTimeSlots } from '../hooks/useTimetable';
import TimetableEntryModal from './TimetableEntryModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableManager = () => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, slot: null, day: null });
    
    const { data: timeSlots } = useTimeSlots();
    const { data: timetable } = useTimetables(selectedSection);
    useClassrooms(); // Initialize hook to pre-fetch/cache if needed, or we can just remove it. Let's just remove it if unused.

    const getEntry = (day, slotId) => {
        return timetable?.find(e => e.dayOfWeek === day && e.timeSlotId === slotId);
    };

    const openSlot = (slot, day) => {
        setModalConfig({ isOpen: true, slot, day });
    };

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold m-0 text-text-main">Timetable Manager</h2>
                    <p className="text-text-muted text-[0.95rem] mt-1">Institutional Scheduling & Room Allocation</p>
                </div>
                <div className="flex gap-3">
                    <select 
                        className="bg-bg-card border border-border-custom text-text-main px-4 py-2 rounded-xl text-sm focus:border-primary outline-none cursor-pointer"
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        <option value="">Select Section</option>
                        {/* Static test values - in production these come from AcademicExplorer context */}
                        <option value="section-uuid-1">B.Tech CS - Section A</option>
                        <option value="section-uuid-2">B.Tech CS - Section B</option>
                    </select>
                </div>
            </header>

            {!selectedSection ? (
                <div className="glass p-20 text-center text-text-muted opacity-40 rounded-[32px] border-dashed border-2 border-border-custom flex flex-col items-center justify-center">
                    <Calendar size={64} className="mb-6 opacity-10" />
                    <h3 className="font-bold text-lg mb-1">No Section Selected</h3>
                    <p className="text-[0.9rem]">Assign a section from the dropdown to start scheduling</p>
                </div>
            ) : (
                <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-4 overflow-x-auto min-w-[1200px] pb-8 px-1">
                    {/* Header Row */}
                    <div className="h-10"></div>
                    {DAYS.map(day => (
                        <div key={day} className="text-center font-black text-text-muted text-[0.65rem] uppercase tracking-[0.2em] h-10 flex items-center justify-center bg-bg-card/20 rounded-t-xl border-x border-t border-border-custom/30">
                            {day}
                        </div>
                    ))}

                    {/* Time Slot Rows */}
                    {timeSlots?.map(slot => (
                        <React.Fragment key={slot.id}>
                            <div className="flex flex-col justify-center items-end pr-6 text-[0.75rem] text-text-muted font-bold">
                                <span className="text-text-main text-sm">{slot.startTime.split(':').slice(0, 2).join(':')}</span>
                                <span className="opacity-40">{slot.endTime.split(':').slice(0, 2).join(':')}</span>
                            </div>
                            {DAYS.map(day => {
                                const entry = getEntry(day, slot.id);
                                return (
                                    <div 
                                        key={`${day}-${slot.id}`} 
                                        className={`glass min-h-[140px] rounded-[24px] p-4 flex flex-col gap-3 transition-all duration-300 border border-border-custom/40 group relative overflow-hidden
                                            ${entry ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' : 'hover:border-primary/40 hover:bg-bg-card/60 cursor-pointer'} 
                                        `}
                                        onClick={() => !entry && openSlot(slot, day)}
                                    >
                                        {entry ? (
                                            <>
                                                <div className="flex items-center gap-2 text-primary">
                                                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Book size={14} />
                                                    </div>
                                                    <span className="text-[0.85rem] font-black truncate uppercase tracking-tight">{entry.course?.name || 'Subject'}</span>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-auto">
                                                    <div className="flex items-center gap-2 text-text-muted text-[0.75rem] font-bold">
                                                        <User size={14} className="text-primary opacity-50" />
                                                        <span className="truncate">{entry.facultyAssignment?.faculty?.user?.firstName || 'Professor'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-text-muted text-[0.75rem] font-medium border-t border-border-custom/30 pt-2 mt-1">
                                                        <MapPin size={14} className="opacity-40" />
                                                        <span className="italic">Room {entry.classroom?.name || 'TBA'}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                                <PlusCircle size={28} className="text-primary/60 mb-2" />
                                                <span className="text-[0.6rem] bg-primary text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">Assign</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {modalConfig.isOpen && (
                <TimetableEntryModal 
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    slot={modalConfig.slot}
                    day={modalConfig.day}
                    sectionId={selectedSection}
                />
            )}
        </div>
    );
};

export default TimetableManager;
