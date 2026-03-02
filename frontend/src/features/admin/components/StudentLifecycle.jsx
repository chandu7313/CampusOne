import React, { useState } from 'react';
import { usePromoteStudents } from '../hooks/useStudents';
import { useUsers } from '../hooks/useUsers';
import { UserCheck, ArrowUpCircle, Filter, Search, CheckSquare, Square } from 'lucide-react';

const StudentLifecycle = () => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [role] = useState('Student'); // Only students can be promoted here
    const { data, isLoading } = useUsers({ role, isActive: true, limit: 100 });
    const promoteMutation = usePromoteStudents();

    const students = data?.users || [];

    const toggleSelect = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === students.length && students.length > 0) setSelectedIds(new Set());
        else setSelectedIds(new Set(students.map(s => s.id)));
    };

    const handlePromote = () => {
        if (selectedIds.size === 0) return alert('Select students to promote');
        if (window.confirm(`Promote ${selectedIds.size} students to the next semester?`)) {
            promoteMutation.mutate(Array.from(selectedIds), {
                onSuccess: () => {
                    setSelectedIds(new Set());
                    alert('Promotion successful');
                }
            });
        }
    };

    if (isLoading) return <div className="text-center p-12 text-white/40">Loading Student Records...</div>;

    return (
        <div className="flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0 text-white">Student Lifecycle & Promotion</h2>
                <button 
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl border-none font-semibold cursor-pointer transition-all duration-200 hover:enabled:bg-emerald-600 hover:enabled:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                    onClick={handlePromote}
                    disabled={selectedIds.size === 0 || promoteMutation.isLoading}
                >
                    <ArrowUpCircle size={18} /> 
                    {promoteMutation.isLoading ? 'Processing...' : `Promote Selected (${selectedIds.size})`}
                </button>
            </header>

            <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-[20px] overflow-hidden">
                <div className="flex px-6 py-4 bg-white/2 border-b border-white/5 text-[0.85rem] font-semibold text-white/50">
                    <div className="w-10 text-white/30 cursor-pointer" onClick={toggleSelectAll}>
                        {selectedIds.size === students.length && students.length > 0 ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                    </div>
                    <div className="flex-1">Roll No</div>
                    <div className="flex-1">Name</div>
                    <div className="flex-1">Department</div>
                    <div className="flex-1">Current Sem</div>
                </div>
                
                <div className="flex flex-col">
                    {students.map(student => (
                        <div 
                            key={student.id} 
                            className={`flex px-6 py-4 border-b border-white/[0.02] items-center cursor-pointer transition-all duration-200 hover:bg-white/[0.02] ${selectedIds.has(student.id) ? 'bg-blue-500/5' : ''}`}
                            onClick={() => toggleSelect(student.id)}
                        >
                            <div className="w-10 text-white/30">
                                {selectedIds.has(student.id) ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                            </div>
                            <div className="flex-1 text-[0.9rem] text-white/80">{student.rollNumber || 'STU-25-001'}</div>
                            <div className="flex-1 text-[0.9rem] font-medium text-white">{student.name}</div>
                            <div className="flex-1 text-[0.9rem] text-white/60">{student.department}</div>
                            <div className="flex-1 text-[0.9rem]">
                                <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg text-[0.75rem] font-semibold">Sem {student.currentSemester || 1}</span>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && <p className="text-center p-12 text-white/40">No active students found for promotion.</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentLifecycle;
