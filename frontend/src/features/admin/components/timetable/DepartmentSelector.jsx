import React from 'react';
import { Building2 } from 'lucide-react';

const DepartmentSelector = ({ departments, selectedDeptId, onChange, disabled }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-text-muted flex items-center gap-1.5 ml-1">
                <Building2 size={12} className="text-primary" />
                Select Department
            </label>
            <select
                value={selectedDeptId}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-bg-card border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            >
                <option value="">Choose Department...</option>
                {departments?.map(dept => (
                    <option key={dept.id} value={dept.id}>
                        {dept.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DepartmentSelector;
