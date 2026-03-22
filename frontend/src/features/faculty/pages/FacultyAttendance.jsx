import React, { useState, useEffect } from 'react';
import { Calendar, Users, Save, CheckCircle, XCircle, BookOpen, LayoutGrid } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useClassAttendance, useSections, useSectionStudents } from '../../../hooks/useAttendance';

const FacultyAttendance = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState({});

    // Fetch subjects assigned to faculty
    const { data: subjectsData } = useQuery({
        queryKey: ['faculty-courses'],
        queryFn: async () => {
            const { data } = await apiClient.get('/academic/courses'); 
            return data.data;
        }
    });

    const subjects = subjectsData || [];

    // Fetch sections (passing first semester id assuming demo layout, or leaving blank to fetch all)
    const { data: sectionsData } = useSections();
    const sections = sectionsData || [];

    // Fetch students for selected section
    const { data: sectionStudentsData, isLoading: isLoadingStudents } = useSectionStudents(selectedSectionId);
    
    // Fetch already marked attendance
    const { data: markedAttendance } = useClassAttendance(selectedSubjectId, selectedSectionId, selectedDate);

    // Initialize attendance records from existing data
    useEffect(() => {
        if (markedAttendance && markedAttendance.length > 0) {
            const initialRecords = {};
            markedAttendance.forEach(record => {
                initialRecords[record.studentId] = record.status;
            });
            setAttendanceRecords(initialRecords);
        } else {
            setAttendanceRecords({});
        }
    }, [markedAttendance, selectedSubjectId, selectedSectionId, selectedDate]);

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
            queryClient.invalidateQueries(['class-attendance']);
            alert("Attendance marked successfully");
        }
    });

    const handleSubmit = () => {
        if (!selectedSubjectId || !selectedSectionId) {
            alert('Please select both Subject and Section');
            return;
        }
        
        const payload = (sectionStudentsData || []).map(studentItem => ({
            studentId: studentItem.user.id,
            status: attendanceRecords[studentItem.user.id] || 'Present', // Default to Present if not marked
            remarks: ''
        }));
        
        submitMutation.mutate({
            subjectId: selectedSubjectId,
            sectionId: selectedSectionId,
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
                
                <div className="flex flex-wrap items-center gap-4">
                     {/* Subject Selector */}
                     <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-border-custom flex items-center gap-2">
                         <BookOpen className="text-text-muted ml-1" size={18} />
                         <select 
                            className="bg-transparent border-none text-text-main font-bold outline-none cursor-pointer py-1 pr-4"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                         >
                            <option value="">Select Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                            ))}
                         </select>
                     </div>

                     {/* Section Selector */}
                     <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-border-custom flex items-center gap-2">
                         <LayoutGrid className="text-text-muted ml-1" size={18} />
                         <select 
                            className="bg-transparent border-none text-text-main font-bold outline-none cursor-pointer py-1 pr-4"
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                         >
                            <option value="">Select Section</option>
                            {sections.map(sec => (
                                <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                            ))}
                         </select>
                     </div>

                     <div className="p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-border-custom flex items-center gap-2">
                         <Calendar className="text-text-muted ml-1" size={18} />
                         <input 
                            type="date" 
                            className="bg-transparent border-none text-text-main font-bold outline-none cursor-pointer py-1 pr-2"
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
                            {(!selectedSubjectId || !selectedSectionId) ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-text-muted">
                                        Please select a subject and section to view students.
                                    </td>
                                </tr>
                            ) : isLoadingStudents ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-text-muted">
                                        Loading students...
                                    </td>
                                </tr>
                            ) : sectionStudentsData?.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-text-muted">
                                        No students found in this section.
                                    </td>
                                </tr>
                            ) : sectionStudentsData?.map((studentItem, idx) => {
                                const student = studentItem.user;
                                const studentId = student.id;
                                const currentStatus = attendanceRecords[studentId] || 'Present'; // Default visual
                                
                                return (
                                <tr key={studentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {student.firstName?.[0]}{student.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{student.firstName} {student.lastName}</p>
                                                <p className="text-xs text-text-muted font-medium">{studentItem.enrollmentNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="p-5 text-center">
                                        {currentStatus === 'Present' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                                                Present
                                            </span>
                                        ) : currentStatus === 'Late' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                                                Late
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
                                                onClick={() => handleMark(studentId, 'Present')}
                                                className={`p-2 rounded-md transition-all ${currentStatus === 'Present' ? 'bg-green-500 text-white shadow-lg' : 'text-text-muted hover:text-green-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleMark(studentId, 'Late')}
                                                className={`p-2 rounded-md transition-all ${currentStatus === 'Late' ? 'bg-yellow-500 text-white shadow-lg text-sm font-bold' : 'text-text-muted hover:text-yellow-500 hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold w-[34px] flex justify-center'}`}
                                            >
                                                L
                                            </button>
                                            <button 
                                                onClick={() => handleMark(studentId, 'Absent')}
                                                className={`p-2 rounded-md transition-all ${currentStatus === 'Absent' ? 'bg-red-500 text-white shadow-lg' : 'text-text-muted hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
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
