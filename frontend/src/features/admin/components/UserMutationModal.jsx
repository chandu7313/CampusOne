import React, { useState, useRef } from 'react';
import { X, User, Mail, Lock, Shield, BadgeCheck, BookOpen, UserCircle, Briefcase, Camera, UploadCloud } from 'lucide-react';
import { useCreateUser } from '../hooks/useUsers';
import { useAcademicHierarchy } from '../hooks/useAcademics';

const UserMutationModal = ({ isOpen, onClose }) => {
    const createUserMutation = useCreateUser();
    const { data: academicData } = useAcademicHierarchy();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        department: '',
        rollNumber: '',
        programId: '',
        batchYear: new Date().getFullYear(),
        employeeId: '',
        designation: '',
        specialization: ''
    });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = new FormData();
            // Append basic info
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            // Append avatar if exists
            if (avatar) {
                data.append('avatar', avatar);
            }

            await createUserMutation.mutateAsync(data);
            
            // Reset and Close
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    const handleClose = () => {
        setFormData({
            name: '', email: '', password: '', role: 'Student', department: '',
            rollNumber: '', programId: '', batchYear: new Date().getFullYear(),
            employeeId: '', designation: '', specialization: ''
        });
        setAvatar(null);
        setAvatarPreview(null);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File size too large (max 2MB)');
                return;
            }
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const allPrograms = academicData?.flatMap(dept => 
        dept.programs.map(prog => ({ ...prog, departmentName: dept.name }))
    ) || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-card border-2 border-border-custom rounded-[32px] w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
                <header className="px-8 py-6 border-b-2 border-border-custom flex justify-between items-center bg-bg-card/80">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                            <UserCircle size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold m-0 text-text-main tracking-tight">Add New User</h3>
                            <p className="text-sm text-text-muted opacity-70 m-0">Create institution credentials and profile</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-2.5 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 text-text-muted transition-all duration-200 border-none cursor-pointer"
                    >
                        <X size={22} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-bg-main/20">
                    {error && (
                        <div className="bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 px-5 py-3.5 rounded-2xl text-[0.9rem] font-semibold flex items-center gap-3 animate-in shake duration-300">
                             <X size={18} /> {error}
                        </div>
                    )}

                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center justify-center gap-4 pb-4">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative w-28 h-28 rounded-[28px] bg-bg-card border-2 border-dashed border-border-custom flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary hover:bg-primary/5 shadow-lg"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-text-muted opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
                                    <Camera size={32} />
                                    <span className="text-[0.65rem] font-bold mt-1 uppercase tracking-tighter">Photo</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                <UploadCloud size={28} className="text-white" />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <p className="text-[0.7rem] font-bold text-text-muted opacity-40 m-0 uppercase tracking-widest">Recommended size: 2MB Max</p>
                    </div>

                    {/* Basic Info Section */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 pl-1">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            <label className="text-xs font-black text-text-muted opacity-60 uppercase tracking-[0.2em]">Primary Information</label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative group">
                                <input name="name" type="text" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                            </div>
                            <div className="relative group">
                                <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                            </div>
                            <div className="relative group">
                                <input name="password" type="password" placeholder="Temporary Password" required value={formData.password} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                            </div>
                            <div className="relative group">
                                <select name="role" value={formData.role} onChange={handleChange} className="modal-input appearance-none border-2 border-border-custom">
                                    <option value="Admin">Admin</option>
                                    <option value="Faculty">Faculty</option>
                                    <option value="Student">Student</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HOD">HOD</option>
                                </select>
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Role-Specific Section */}
                    {formData.role === 'Student' && (
                        <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                             <div className="flex items-center gap-3 pl-1">
                                <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                <label className="text-xs font-black text-text-muted opacity-60 uppercase tracking-[0.2em]">Admission Details</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative group">
                                    <input name="rollNumber" type="text" placeholder="Roll Number" required value={formData.rollNumber} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                    <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                                </div>
                                <div className="relative group">
                                    <select name="programId" required value={formData.programId} onChange={handleChange} className="modal-input appearance-none border-2 border-border-custom">
                                        <option value="">Select Program</option>
                                        {allPrograms.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.departmentName})</option>
                                        ))}
                                    </select>
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                                </div>
                                <div className="relative group md:col-span-2">
                                    <input name="batchYear" type="number" placeholder="Batch Year" required value={formData.batchYear} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.role === 'Faculty' && (
                        <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                             <div className="flex items-center gap-3 pl-1">
                                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                <label className="text-xs font-black text-text-muted opacity-60 uppercase tracking-[0.2em]">Professional Details</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative group">
                                    <input name="employeeId" type="text" placeholder="Employee ID" required value={formData.employeeId} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within:text-purple-500 group-focus-within:opacity-100 transition-all z-10 pointer-events-none" size={18} />
                                </div>
                                <div className="relative group">
                                    <select name="designation" required value={formData.designation} onChange={handleChange} className="modal-input border-2 border-border-custom">
                                        <option value="">Select Designation</option>
                                        <option value="Professor">Professor</option>
                                        <option value="Associate Professor">Professor</option>
                                        <option value="Assistant Professor">Professor</option>
                                        <option value="Lecturer">Lecturer</option>
                                    </select>
                                </div>
                                <div className="relative md:col-span-2 group">
                                    <input name="specialization" type="text" placeholder="Area of Specialization" value={formData.specialization} onChange={handleChange} className="modal-input border-2 border-border-custom" />
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <footer className="px-8 py-6 border-t-2 border-border-custom bg-bg-card flex justify-end gap-4">
                    <button 
                        onClick={handleClose} 
                        className="px-6 py-3.5 rounded-2xl font-bold text-text-muted hover:bg-bg-main hover:text-text-main transition-all border-none cursor-pointer"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={createUserMutation.isLoading}
                        className="px-10 py-3.5 bg-primary text-white rounded-2xl font-black hover:bg-primary-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 border-none cursor-pointer"
                    >
                        {createUserMutation.isLoading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </footer>
            </div>

            <style jsx>{`
                .modal-input {
                    width: 100%;
                    background: var(--bg-card);
                    border-radius: 18px;
                    padding: 0.9rem 1rem 0.9rem 3.2rem;
                    color: var(--text-main);
                    font-size: 0.95rem;
                    font-weight: 500;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .modal-input:focus {
                    background: var(--bg-card);
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 5px rgba(var(--primary-rgb), 0.15);
                    transform: translateY(-1px);
                }
                select.modal-input {
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1.2rem;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 7px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-custom);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default UserMutationModal;
