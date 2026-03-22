import React from 'react';
import { User } from 'lucide-react';

const FacultySelector = ({ faculty, selectedId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <User size={12} className="text-primary" />
                Select Faculty
            </label>
            <select
                value={selectedId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            >
                <option value="">Choose Instructor...</option>
                {faculty?.map(f => (
                    <option key={f.id} value={f.id}>
                        {f.firstName} {f.lastName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FacultySelector;
