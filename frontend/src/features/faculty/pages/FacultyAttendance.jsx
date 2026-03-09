import React, { useState } from 'react';
import { Calendar, Users, Save, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

const FacultyAttendance = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // In a real app, this would be selected from faculty's assigned subjects
    const mockSubjectId = "d5afbbf1-ecee-41d3-ad08-ad096c4491de"; // Fetch this properly in production

    const { data: classList, isLoading } = useQuery({
        queryKey: ['attendance', mockSubjectId, selectedDate],
        queryFn: async () => {
            // Mock fetching students for this subject. In production:
            // 1. Fetch Students enrolled in Course/Section
            // 2. Merge with existing attendance for the date
            return [
                { id: 'uuid-1', firstName: 'John', lastName: 'Doe', enrollmentNumber: 'ST101', status: 'Present' },
                { id: 'uuid-2', firstName: 'Jane', lastName: 'Smith', enrollmentNumber: 'ST102', status: 'Absent' },
            ];
        }
    });

    const [attendanceRecords, setAttendanceRecords] = useState({});

    const handleMark = (studentId, status) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const submitMutation = useMutation({
        mutationFn: async (records) => {
            return apiClient.post('/academic/attendance/mark', records);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['attendance']);
            alert("Attendance marked successfully");
        }
    });

    const handleSubmit = () => {
        const payload = Object.entries(attendanceRecords).map(([studentId, status]) => ({
            studentId,
            status,
            remarks: ''
        }));
        
        submitMutation.mutate({
            subjectId: mockSubjectId,
            date: selectedDate,
            records: payload
        });
    };

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        Mark <span className="text-primary italic">Attendance</span>
                    </h1>
                    <p className="text-text-muted font-medium">Record attendance for your classes.</p>
                </div>
                
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border-custom flex items-center gap-3">
                         <Calendar className="text-text-muted" size={20} />
                         <input 
                            type="date" 
                            className="bg-transparent border-none text-text-main font-bold outline-none cursor-pointer"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                         />
                     </div>
                </div>
            </header>

            <div className="glass-card rounded-3xl overflow-hidden border border-border-custom/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/5 dark:bg-white/5 border-b border-border-custom">
                                <th className="p-5 font-bold text-text-muted uppercase tracking-wider text-xs">Student</th>
                                <th className="p-5 font-bold text-text-muted uppercase tracking-wider text-xs text-center w-32">Status</th>
                                <th className="p-5 font-bold text-text-muted uppercase tracking-wider text-xs w-48 shrink-0">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom/30 text-text-main">
                            {classList?.map((student, idx) => (
                                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{student.firstName} {student.lastName}</p>
                                                <p className="text-xs text-text-muted font-medium">{student.enrollmentNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="p-5 text-center">
                                        {attendanceRecords[student.id] === 'Present' || (!attendanceRecords[student.id] && student.status === 'Present') ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                                                Present
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">
                                                Absent
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-5">
                                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg w-max">
                                            <button 
                                                onClick={() => handleMark(student.id, 'Present')}
                                                className={`p-2 rounded-md transition-all ${attendanceRecords[student.id] === 'Present' || (!attendanceRecords[student.id] && student.status === 'Present') ? 'bg-green-500 text-white shadow-lg' : 'text-text-muted hover:text-green-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleMark(student.id, 'Absent')}
                                                className={`p-2 rounded-md transition-all ${attendanceRecords[student.id] === 'Absent' || (!attendanceRecords[student.id] && student.status === 'Absent') ? 'bg-red-500 text-white shadow-lg' : 'text-text-muted hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 border-t border-border-custom bg-black/5 dark:bg-white/5 flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        className="btn-primary flex items-center gap-2"
                    >
                        {submitMutation.isPending ? 'Saving...' : (
                            <>
                                <Save size={18} />
                                Save Attendance
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyAttendance;
