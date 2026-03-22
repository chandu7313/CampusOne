import React from 'react';
import { LayoutGrid } from 'lucide-react';

const SectionSelector = ({ 
    sections, 
    selectedSectionId, 
    onChange, 
    disabled,
    existingTimetableSectionIds = [] // Array of IDs that are already scheduled to be disabled
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <LayoutGrid size={12} className="text-primary" />
                Select Section
            </label>
            <select
                value={selectedSectionId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-card border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            >
                <option value="">Choose Section...</option>
                {sections?.map(sec => {
                    const isOccupied = existingTimetableSectionIds.includes(sec.id);
                    return (
                        <option 
                            key={sec.id} 
                            value={sec.id} 
                            disabled={isOccupied}
                        >
                            Section {sec.name} {isOccupied ? '(Scheduled)' : ''}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default SectionSelector;
