import React from 'react';
import { Book } from 'lucide-react';

const SubjectSelector = ({ subjects, selectedId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <Book size={12} className="text-primary" />
                Select Subject
            </label>
            <select
                value={selectedId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            >
                <option value="">Choose Subject...</option>
                {subjects?.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
            </select>
        </div>
    );
};

export default SubjectSelector;
