import React from 'react';
import { MapPin } from 'lucide-react';

const ClassroomSelector = ({ classrooms, selectedId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <MapPin size={12} className="text-primary" />
                Select Classroom
            </label>
            <select
                value={selectedId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            >
                <option value="">Choose Room...</option>
                {classrooms?.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name} (Cap: {c.capacity})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ClassroomSelector;
