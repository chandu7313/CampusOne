import React from 'react';
import { Book } from 'lucide-react';

const ProgramSelector = ({ programs, selectedProgramId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <Book size={12} className="text-primary" />
                Select Program
            </label>
            <select
                value={selectedProgramId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-card border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            >
                <option value="">Choose Program...</option>
                {programs?.map(prog => (
                    <option key={prog.id} value={prog.id}>
                        {prog.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProgramSelector;
