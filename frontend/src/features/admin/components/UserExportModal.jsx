import React, { useState } from 'react';
import { X, CheckSquare, Square, Download } from 'lucide-react';

const UserExportModal = ({ isOpen, onClose, users }) => {
    const [selectedFields, setSelectedFields] = useState({
        name: true,
        email: true,
        role: true,
        registrationNumber: true,
        department: true,
        mobile: false,
        gender: false,
        dob: false,
        permanentAddress: false,
        isActive: true
    });

    if (!isOpen) return null;

    const toggleField = (field) => {
        setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleExport = () => {
        const activeFields = Object.keys(selectedFields).filter(key => selectedFields[key]);
        const headers = activeFields.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(',');
        
        const rows = users.map(user => {
            return activeFields.map(field => {
                let val = user[field];
                if (field === 'isActive') val = val ? 'Active' : 'Inactive';
                // Escape commas for CSV
                return `"${val || ''}"`;
            }).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `CampusOne_Users_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md glass bg-bg-card/90 border border-border-custom rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <header className="flex justify-between items-center p-6 border-b border-border-custom/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Download size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-text-main m-0">Export Users</h3>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-none text-text-muted hover:text-text-main cursor-pointer p-1 transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6">
                    <p className="text-[0.9rem] text-text-muted mb-4 opacity-70">Select the details you want to include in the exported list.</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {Object.keys(selectedFields).map(field => (
                            <div 
                                key={field}
                                onClick={() => toggleField(field)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                    selectedFields[field] 
                                    ? 'bg-primary/5 border-primary/30 text-text-main shadow-sm' 
                                    : 'bg-bg-card/30 border-border-custom/30 text-text-muted hover:border-border-custom'
                                }`}
                            >
                                {selectedFields[field] ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                                <span className="text-[0.85rem] font-medium capitalize">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-border-custom text-text-main font-semibold bg-transparent hover:bg-bg-card/50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleExport}
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Download size={18} /> Download CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserExportModal;
