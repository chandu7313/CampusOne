import React from 'react';
import { Calendar } from 'lucide-react';

const SemesterSelector = ({ semesters, selectedSemesterId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <Calendar size={12} className="text-primary" />
                Select Semester
            </label>
            <select
                value={selectedSemesterId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-card border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            >
                <option value="">Choose Semester...</option>
                {semesters?.map(sem => (
                    <option key={sem.id} value={sem.id}>
                        Semester {sem.semesterNumber} ({sem.academicYear})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SemesterSelector;
