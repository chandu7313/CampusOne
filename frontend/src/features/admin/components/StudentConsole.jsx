import React, { useState } from 'react';
import { ClipboardList, Search, Filter, Upload, Download, User, Mail, GraduationCap, Plus } from 'lucide-react';
import { useStudents, useBulkImportStudents } from '../hooks/useStudents';
import AdmitStudentModal from './AdmitStudentModal';

const StudentConsole = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters] = useState({ programId: '', status: 'Active' });
    const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
    
    const { data: students, isLoading } = useStudents(filters);
    const bulkImport = useBulkImportStudents();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        bulkImport.mutate(formData);
    };

    const filteredStudents = students?.filter(s => 
        `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold m-0 text-text-main">Student Console</h2>
                    <p className="text-text-muted text-[0.95rem] mt-1">Lifecycle Management & Mass Onboarding</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAdmitModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer border-none"
                    >
                        <Plus size={18} /> Admit Individual
                    </button>
                    <label className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-primary/20 cursor-pointer">
                        <Upload size={18} /> Bulk Import
                        <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                    </label>
                </div>
            </header>

            <div className="grid grid-cols-[1fr_350px] gap-8 max-xl:grid-cols-1">
                <main className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="flex-1 glass flex items-center px-4 gap-3 border border-border-custom/50 focus-within:border-primary/50 transition-colors">
                            <Search size={18} className="text-text-muted" />
                            <input 
                                type="text" 
                                placeholder="Search by name or registration number..." 
                                className="bg-transparent border-none outline-none text-text-main py-3 w-full text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="glass px-4 flex items-center gap-2 text-text-muted hover:text-text-main transition-colors border border-border-custom/50">
                            <Filter size={18} />
                            <span className="text-sm font-medium">Filters</span>
                        </button>
                    </div>

                    <div className="glass rounded-[32px] overflow-hidden border border-border-custom/30">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-card/30 text-[0.7rem] uppercase tracking-wider text-text-muted">
                                    <th className="px-6 py-4 font-bold">Student</th>
                                    <th className="px-6 py-4 font-bold">Registration No</th>
                                    <th className="px-6 py-4 font-bold">Program</th>
                                    <th className="px-6 py-4 font-bold">Batch</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-custom/20">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center py-20 opacity-40">Loading Students...</td></tr>
                                ) : filteredStudents?.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-20 opacity-40">No students found.</td></tr>
                                ) : filteredStudents?.map(student => (
                                    <tr key={student.userId} className="hover:bg-bg-card/10 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {student.user?.firstName?.[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-text-main text-sm">{student.user?.firstName} {student.user?.lastName}</span>
                                                    <span className="text-[0.7rem] text-text-muted flex items-center gap-1">
                                                        <Mail size={10} /> {student.user?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-[0.8rem] bg-bg-card/40 px-2 py-1 rounded text-primary font-bold">
                                                {student.registrationNumber}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted italic">
                                            {student.program?.name || 'Assigned'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-text-main">
                                            {student.batchYear}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[0.7rem] font-bold px-2 py-1 rounded-md uppercase ${
                                                student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <aside className="flex flex-col gap-6">
                    <div className="glass p-6 rounded-[28px] border border-border-custom/30">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="text-primary" /> Admission stats
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">New Admitted (Today)</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Processing Bulk</span>
                                <span className="text-amber-500 font-bold">0</span>
                            </div>
                            <div className="h-2 bg-bg-card/50 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[75%]" />
                            </div>
                            <p className="text-[0.75rem] text-text-muted italic">Target: 450/600 students enrolled.</p>
                        </div>
                    </div>
                    
                    <div className="glass p-6 rounded-[28px] border border-border-custom/30 bg-primary/5">
                        <h4 className="text-[0.9rem] font-bold mb-2">Import Help</h4>
                        <p className="text-[0.8rem] text-text-muted leading-relaxed">
                            Upload a CSV file with headers: <code>firstName</code>, <code>lastName</code>, <code>email</code>, <code>batchYear</code>, and <code>programId</code>.
                        </p>
                    </div>
                </aside>
            </div>
            <AdmitStudentModal 
                isOpen={isAdmitModalOpen}
                onClose={() => setIsAdmitModalOpen(false)}
            />
        </div>
    );
};

export default StudentConsole;
