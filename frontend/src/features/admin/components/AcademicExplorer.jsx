import React, { useState } from 'react';
import { useAcademicHierarchy } from '../hooks/useAcademics';
import { GraduationCap, BookOpen, Layers, ChevronRight, ChevronDown, Plus, MoreVertical, PlusCircle } from 'lucide-react';

const AcademicExplorer = () => {
    const { data: hierarchy, isLoading } = useAcademicHierarchy();
    const [expandedIds, setExpandedIds] = useState(new Set());

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
                    <button className="flex items-center gap-2 bg-bg-card/50 border border-border-custom text-text-main px-4 py-2 rounded-xl text-[0.9rem] font-medium transition-all duration-200 hover:bg-bg-card hover:border-primary cursor-pointer">
                        <Plus size={18} /> New Department
                    </button>
                    <button className="flex items-center gap-2 bg-bg-card/50 border border-border-custom text-text-main px-4 py-2 rounded-xl text-[0.9rem] font-medium transition-all duration-200 hover:bg-bg-card hover:border-primary cursor-pointer">
                        <Plus size={18} /> New Program
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
                                <span className="text-[0.75rem] text-text-muted opacity-60">{dept.code}</span>
                            </div>
                            <button className="bg-transparent border-none text-text-muted opacity-40 cursor-pointer p-1 hover:text-text-main transition-colors">
                                <PlusCircle size={14} />
                            </button>
                        </div>

                        {expandedIds.has(dept.id) && (
                            <div className="ml-[52px] py-2 pb-4 flex flex-col gap-2 border-l border-border-custom">
                                {dept.programs?.map(program => (
                                    <div key={program.id} className="mr-4">
                                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-bg-card/20 rounded-lg" onClick={() => toggleExpand(program.id)}>
                                            {expandedIds.has(program.id) ? <ChevronDown size={16} className="text-text-main" /> : <ChevronRight size={16} className="text-text-main" />}
                                            <BookOpen size={18} className="text-purple-500" />
                                            <div className="flex-1 flex flex-col">
                                                <span className="font-semibold text-[0.9rem] text-text-main">{program.name}</span>
                                                <span className="text-[0.7rem] text-text-muted opacity-60">{program.code}</span>
                                            </div>
                                            <button className="bg-transparent border-none text-text-muted opacity-40 cursor-pointer p-1 hover:text-text-main transition-colors">
                                                <PlusCircle size={14} />
                                            </button>
                                        </div>

                                        {expandedIds.has(program.id) && (
                                            <div className="ml-8 py-2 flex flex-col gap-2 border-l border-border-custom">
                                                {program.courses?.map(course => (
                                                    <div key={course.id} className="flex items-center gap-3 px-4 py-2.5 mr-4 bg-bg-card/20 rounded-lg">
                                                        <Layers size={16} className="text-emerald-500" />
                                                        <div className="flex-1 flex flex-col">
                                                            <span className="font-semibold text-sm text-text-main">{course.name}</span>
                                                            <span className="text-[0.7rem] text-text-muted opacity-60">{course.code}</span>
                                                        </div>
                                                        <span className="text-[0.75rem] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                                                            {course.credits} Credits
                                                        </span>
                                                    </div>
                                                ))}
                                                <button className="bg-transparent border border-dashed border-border-custom text-text-muted opacity-60 m-2 mx-4 p-2 rounded-lg text-[0.8rem] transition-colors cursor-pointer hover:border-primary/40 hover:text-text-main">
                                                    + Add Course
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button className="bg-transparent border border-dashed border-border-custom text-text-muted opacity-60 m-2 mx-4 p-2 rounded-lg text-[0.8rem] transition-colors cursor-pointer hover:border-primary/40 hover:text-text-main">
                                    + Add Program
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcademicExplorer;
