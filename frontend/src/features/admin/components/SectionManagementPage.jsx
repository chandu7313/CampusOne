import React, { useState } from 'react';
import { Users, ServerCrash, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useSections } from '../../../hooks/useAttendance';

const SectionManagementPage = () => {
    const queryClient = useQueryClient();
    const demoSemesterId = "d9c65baa-83ca-4ec3-a62c-8ab5570bb507"; // Assume demo semester for now

    const { data: sections, isLoading } = useSections(demoSemesterId);

    // Mock fetching unassigned students for this demo
    const { data: unassignedStudents } = useQuery({
        queryKey: ['unassigned-students', demoSemesterId],
        queryFn: async () => {
            // In a real app we'd fetch profile IDs of students enrolled in this program/semester not yet in a section
            // We simulate having 60 new admissions
            const ids = Array.from({length: 60}, (_, i) => `mock-student-profile-${i}`);
            return ids;
        }
    });

    const [allocateStatus, setAllocateStatus] = useState(null);

    const allocateMutation = useMutation({
        mutationFn: async (studentProfileIds) => {
            return apiClient.post('/academic/sections/allocate', {
                semesterId: demoSemesterId,
                studentProfileIds
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['sections']);
            setAllocateStatus({ type: 'success', message: data.data.message });
        },
        onError: (err) => {
            const errorMsg = err.response?.data?.message || err.message;
            setAllocateStatus({ type: 'error', message: errorMsg });
        }
    });

    const handleAutoAllocate = () => {
        if (!unassignedStudents || unassignedStudents.length === 0) return;
        setAllocateStatus(null);
        allocateMutation.mutate(unassignedStudents);
    };

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        Section <span className="text-primary italic">Management</span>
                    </h1>
                    <p className="text-text-muted font-medium">Auto-distribute students based on section capacities (min 15).</p>
                </div>
                
                <div className="flex items-center gap-4">
                     <button 
                        onClick={handleAutoAllocate}
                        disabled={allocateMutation.isPending || !unassignedStudents?.length}
                        className="btn-primary flex items-center gap-2"
                     >
                         <Users size={18} />
                         {allocateMutation.isPending ? 'Processing...' : `Auto-Allocate (${unassignedStudents?.length || 0} Waiting)`}
                     </button>
                </div>
            </header>

            {allocateStatus && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${allocateStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {allocateStatus.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <div>
                        <h4 className="font-bold">{allocateStatus.type === 'success' ? 'Success' : 'Error'}</h4>
                        <p className="text-sm opacity-90">{allocateStatus.message}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-text-muted">Loading sections...</div>
                ) : sections?.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-text-muted/50 py-20 px-4 text-center glass-card">
                        <ServerCrash size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-text-main">No Sections Found</h3>
                        <p className="text-sm mt-2 max-w-md">Create sections in the Academic Explorer first.</p>
                    </div>
                ) : sections?.map(section => (
                    <div key={section.id} className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-text-main">
                                    Section {section.name}
                                </h3>
                                <p className="text-sm text-text-muted font-medium mt-1">Capacity: {section.capacity || 60}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Status</span>
                                <span className="text-sm font-bold text-green-500">Active</span>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Type</span>
                                <span className="text-sm font-bold text-text-main">Regular</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionManagementPage;
