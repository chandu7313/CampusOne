import React from 'react';
import { Clock, PlusCircle } from 'lucide-react';

// Must match DB ENUM exactly: MONDAY, TUESDAY, etc.
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const DAY_LABELS = { MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday', THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday' };

// Color coding per slot type
const SLOT_STYLES = {
    LECTURE:  'bg-primary/10 border-primary/20 hover:border-primary/40',
    LAB:      'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
    TUTORIAL: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
    BREAK:    'bg-slate-500/10 border-slate-500/20 hover:border-slate-500/40',
};
const SLOT_TEXT = {
    LECTURE:  'text-primary',
    LAB:      'text-emerald-400',
    TUTORIAL: 'text-amber-400',
    BREAK:    'text-slate-400',
};
const SLOT_BADGE = {
    LECTURE:  'bg-primary/20 text-primary',
    LAB:      'bg-emerald-500/20 text-emerald-400',
    TUTORIAL: 'bg-amber-500/20 text-amber-400',
    BREAK:    'bg-slate-500/20 text-slate-400',
};

const TimetableGrid = ({
    timeSlots,
    entries,
    onSlotClick,
    onEntryClick,
    readonly = false,
    highlightFacultyId = null,
}) => {
    // Group slots by startTime to create rows
    const uniqueTimes = [...new Set(timeSlots?.map(s => s.startTime) || [])].sort();

    return (
        <div className="overflow-x-auto rounded-[32px] border border-border-custom bg-bg-card shadow-2xl">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-bg-main/50 border-b border-border-custom">
                        <th className="p-6 text-left border-r border-border-custom min-w-[130px]">
                            <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-muted">
                                <Clock size={14} className="text-primary" />
                                Time
                            </div>
                        </th>
                        {DAYS.map(day => (
                            <th key={day} className="p-6 text-center min-w-[170px]">
                                <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-main">{DAY_LABELS[day]}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {uniqueTimes.map(time => (
                        <tr key={time} className="border-b border-border-custom last:border-0 hover:bg-primary/[0.01] transition-colors">
                            <td className="p-6 border-r border-border-custom bg-bg-main/30">
                                <span className="text-[0.75rem] font-black text-text-main tabular-nums">{time}</span>
                            </td>
                            {DAYS.map(day => {
                                const slot = timeSlots?.find(s => s.startTime === time && s.dayOfWeek === day);
                                const entry = slot
                                    ? entries?.find(e => e.timeSlotId === slot.id)
                                    : entries?.find(e => e.dayOfWeek?.toUpperCase() === day && e.timeSlot?.startTime === time);

                                const isHighlighted = highlightFacultyId &&
                                    entry?.facultyId === highlightFacultyId;

                                const slotType = entry?.slotType || 'LECTURE';

                                return (
                                    <td key={day} className="p-3 align-top">
                                        {entry ? (
                                            <div
                                                onClick={() => {
                                                    if (!readonly) {
                                                        // Pass the resolved timeSlot and the entry together
                                                        const resolvedSlot = slot || {
                                                            id: entry.timeSlotId,
                                                            dayOfWeek: entry.dayOfWeek || day,
                                                            startTime: time,
                                                        };
                                                        onEntryClick(resolvedSlot, entry);
                                                    }
                                                }}
                                                className={`
                                                    relative p-4 rounded-2xl border transition-all duration-200
                                                    ${readonly ? 'cursor-default' : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'}
                                                    ${isHighlighted ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}
                                                    ${SLOT_STYLES[slotType]}
                                                `}
                                            >
                                                {/* Slot type badge */}
                                                <span className={`text-[0.55rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${SLOT_BADGE[slotType]}`}>
                                                    {slotType}
                                                </span>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`text-[0.72rem] font-black uppercase tracking-tight line-clamp-2 leading-snug ${SLOT_TEXT[slotType]}`}>
                                                        {entry.subject?.name || entry.subjectName || '—'}
                                                    </span>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <span className="text-[0.6rem] font-bold text-text-main flex items-center gap-1">
                                                            <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                            {entry.faculty
                                                                ? `${entry.faculty.firstName || ''} ${entry.faculty.lastName || ''}`.trim()
                                                                : (entry.facultyName || <span className="text-rose-400">Unassigned</span>)
                                                            }
                                                        </span>
                                                        <span className="text-[0.6rem] font-bold text-text-muted flex items-center gap-1">
                                                            <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                                                            {entry.classroom?.name || entry.classroomName || '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            !readonly && slot && (
                                                <button
                                                    onClick={() => onSlotClick(slot)}
                                                    className="w-full h-[90px] rounded-2xl border-2 border-dashed border-border-custom hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all group/btn cursor-pointer bg-transparent"
                                                >
                                                    <PlusCircle size={18} className="text-text-muted group-hover/btn:text-primary transition-colors opacity-40 group-hover/btn:opacity-100" />
                                                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted group-hover/btn:text-primary">Allocate</span>
                                                </button>
                                            )
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Legend */}
            {!readonly && (
                <div className="flex items-center gap-4 px-8 py-4 border-t border-border-custom bg-bg-main/30 flex-wrap">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted mr-2">Type:</span>
                    {Object.entries(SLOT_BADGE).map(([type, cls]) => (
                        <span key={type} className={`text-[0.6rem] font-black px-3 py-1 rounded-full ${cls}`}>{type}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimetableGrid;
