import React, { useState } from 'react';
import { Users, ChevronRight } from 'lucide-react';

/**
 * FacultyAssignmentPanel
 *
 * Shows all faculty assigned in the current timetable, with slot counts.
 * Clicking a faculty highlights their slots in the TimetableGrid (via onSelectFaculty).
 *
 * Props:
 *   entries           — TimetableEntry[] from the current timetable
 *   selectedFacultyId — currently highlighted faculty ID
 *   onSelectFaculty   — (facultyId | null) => void
 */
const FacultyAssignmentPanel = ({ entries = [], selectedFacultyId, onSelectFaculty }) => {
    // Build faculty → slot count map from entries
    const facultyMap = {};
    entries.forEach(entry => {
        if (!entry.facultyId) return;
        const id = entry.facultyId;
        if (!facultyMap[id]) {
            const f = entry.faculty;
            const name = f
                ? `${f.firstName || ''} ${f.lastName || ''}`.trim()
                : entry.facultyName || 'Unknown Faculty';
            facultyMap[id] = { id, name, count: 0 };
        }
        facultyMap[id].count++;
    });

    const facultyList = Object.values(facultyMap).sort((a, b) => b.count - a.count);

    const totalSlots = entries.length;
    const assignedSlots = entries.filter(e => e.facultyId).length;

    return (
        <div className="bg-bg-card border border-border-custom rounded-[28px] overflow-hidden shadow-xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border-custom">
                <div className="flex items-center gap-3 mb-3">
                    <Users size={16} className="text-primary" />
                    <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted">Faculty Workload</h3>
                </div>
                {/* Assignment progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[0.6rem] font-black text-text-muted">
                        <span>Slots Assigned</span>
                        <span>{assignedSlots}/{totalSlots}</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-main rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: totalSlots ? `${(assignedSlots / totalSlots) * 100}%` : '0%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Faculty list */}
            <div className="flex-1 overflow-y-auto divide-y divide-border-custom max-h-[420px]">
                {facultyList.length === 0 ? (
                    <div className="p-6 text-center text-text-muted text-xs font-semibold italic">
                        No faculty assigned yet.
                    </div>
                ) : (
                    facultyList.map(f => {
                        const isSelected = selectedFacultyId === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => onSelectFaculty(isSelected ? null : f.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all cursor-pointer border-none bg-transparent
                                    ${isSelected ? 'bg-primary/8' : 'hover:bg-primary/[0.04]'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[0.65rem] font-black transition-colors
                                        ${isSelected ? 'bg-primary text-white' : 'bg-bg-main text-text-muted'}
                                    `}>
                                        {f.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[0.75rem] font-black text-text-main leading-tight">{f.name}</p>
                                        <p className="text-[0.6rem] font-bold text-text-muted">{f.count} slot{f.count !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <ChevronRight
                                    size={14}
                                    className={`transition-all ${isSelected ? 'text-primary rotate-90' : 'text-text-muted/40'}`}
                                />
                            </button>
                        );
                    })
                )}
            </div>

            {/* Clear selection hint */}
            {selectedFacultyId && (
                <div className="px-5 py-3 border-t border-border-custom bg-primary/5">
                    <p className="text-[0.6rem] font-bold text-primary/70 text-center">
                        Click the same faculty again to deselect
                    </p>
                </div>
            )}
        </div>
    );
};

export default FacultyAssignmentPanel;
