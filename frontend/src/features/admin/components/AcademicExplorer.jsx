import React, { useState } from 'react';
import { useAcademicHierarchy } from '../hooks/useAcademics';
import { GraduationCap, BookOpen, Layers, ChevronRight, ChevronDown, Plus, MoreVertical, PlusCircle, LayoutGrid } from 'lucide-react';
import AcademicMutationModal from './AcademicMutationModal';

const AcademicExplorer = () => {
    const { data: hierarchy, isLoading } = useAcademicHierarchy();
    const [expandedIds, setExpandedIds] = useState(new Set());
    
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'department',
        parentData: {}
    });

    const openModal = (type, parentData = {}) => {
        setModalConfig({ isOpen: true, type, parentData });
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    if (isLoading) return <div className="text-center p-16 text-text-muted opacity-40">Loading Hierarchy...</div>;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0 text-text-main">Academic Governance</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={() => openModal('department')}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[0.9rem] font-bold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 cursor-pointer border-none"
                    >
                        <Plus size={18} /> New Department
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-3">
                {hierarchy?.map(dept => (
                    <div key={dept.id} className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors duration-200 hover:bg-bg-card/20" onClick={() => toggleExpand(dept.id)}>
                            {expandedIds.has(dept.id) ? <ChevronDown size={18} className="text-text-main" /> : <ChevronRight size={18} className="text-text-main" />}
                            <GraduationCap size={20} className="text-primary" />
                            <div className="flex-1 flex flex-col">
                                <span className="font-semibold text-[0.95rem] text-text-main">{dept.name}</span>
                                <span className="text-[0.7rem] text-text-muted opacity-60 font-mono tracking-tighter">{dept.code}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); openModal('program', { departmentId: dept.id }); }}
                                className="bg-primary/10 border border-primary/20 text-primary rounded-lg cursor-pointer p-1.5 hover:bg-primary hover:text-white transition-all flex items-center gap-1 text-[0.65rem] font-bold"
                            >
                                <Plus size={12} /> ADD PROGRAM
                            </button>
                        </div>

                        {expandedIds.has(dept.id) && (
                            <div className="ml-[52px] py-1 pb-4 flex flex-col gap-1 border-l border-border-custom/50">
                                {dept.programs?.map(program => (
                                    <div key={program.id} className="mr-4">
                                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-bg-card/20 rounded-xl" onClick={() => toggleExpand(program.id)}>
                                            {expandedIds.has(program.id) ? <ChevronDown size={16} className="text-text-main" /> : <ChevronRight size={16} className="text-text-main" />}
                                            <BookOpen size={18} className="text-purple-500" />
                                            <div className="flex-1 flex flex-col">
                                                <span className="font-semibold text-[0.9rem] text-text-main">{program.name}</span>
                                                <span className="text-[0.65rem] text-text-muted opacity-60 font-mono italic">{program.code}</span>
                                            </div>
                                        </div>

                                        {expandedIds.has(program.id) && (
                                            <div className="ml-8 py-1 flex flex-col gap-1 border-l border-border-custom/50">
                                                {program.semesters?.map(semester => (
                                                    <div key={semester.id} className="mr-4">
                                                        <div className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-bg-card/20 rounded-xl" onClick={() => toggleExpand(semester.id)}>
                                                            {expandedIds.has(semester.id) ? <ChevronDown size={14} className="text-text-main" /> : <ChevronRight size={14} className="text-text-main" />}
                                                            <Layers size={16} className="text-blue-500" />
                                                            <div className="flex-1 flex flex-col">
                                                                <span className="font-semibold text-[0.85rem] text-text-main tracking-tight">Semester {semester.semesterNumber}</span>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); openModal('section', { semesterId: semester.id }); }}
                                                                className="opacity-0 group-hover:opacity-100 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg cursor-pointer p-1 hover:bg-emerald-500 hover:text-white transition-all"
                                                            >
                                                                <PlusCircle size={14} />
                                                            </button>
                                                        </div>

                                                        {expandedIds.has(semester.id) && (
                                                            <div className="ml-8 py-2 flex flex-col gap-2 border-l border-border-custom/50">
                                                                {semester.sections?.map(section => (
                                                                    <div key={section.id} className="flex items-center justify-between px-4 py-3 mr-4 bg-bg-card/10 rounded-xl border border-border-custom/20 hover:border-primary/30 transition-all group">
                                                                        <div className="flex items-center gap-3">
                                                                            <LayoutGrid size={16} className="text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                                            <span className="text-sm font-bold text-text-main">Section {section.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[0.65rem] font-bold text-text-muted bg-bg-main px-2 py-1 rounded-md">
                                                                                Cap: {section.capacity}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button 
                                                                    onClick={() => openModal('section', { semesterId: semester.id })}
                                                                    className="bg-transparent border border-dashed border-border-custom text-text-muted opacity-60 mx-4 p-2 rounded-xl text-[0.7rem] font-bold transition-all cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:opacity-100"
                                                                >
                                                                    + ADJOIN SECTION
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <button className="bg-transparent border border-dashed border-border-custom text-text-muted opacity-60 m-2 mx-4 p-2 rounded-xl text-[0.75rem] font-bold transition-all cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:opacity-100">
                                                    + INITIALIZE SEMESTERS
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    onClick={() => openModal('program', { departmentId: dept.id })}
                                    className="bg-transparent border border-dashed border-border-custom text-text-muted opacity-60 m-2 mx-4 p-2 rounded-xl text-[0.8rem] font-bold transition-all cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:opacity-100"
                                >
                                    + EXPAND PROGRAM CATALOG
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AcademicMutationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                type={modalConfig.type}
                parentData={modalConfig.parentData}
            />
        </div>
    );
};

export default AcademicExplorer;
