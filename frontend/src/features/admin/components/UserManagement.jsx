import React, { useState } from 'react';
import { useUsers, useToggleUserStatus } from '../hooks/useUsers';
import { useAcademicHierarchy } from '../hooks/useAcademics';
import { Search, Filter, UserPlus, MoreVertical, Shield, User as UserIcon, CheckCircle, XCircle, Download } from 'lucide-react';
import UserMutationModal from './UserMutationModal';
import UserExportModal from './UserExportModal';

const UserManagement = () => {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState('');
    const [department, setDepartment] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const { data, isLoading } = useUsers({ search, role, isActive, department, page });
    const { data: academicHierarchy } = useAcademicHierarchy();
    const toggleStatusMutation = useToggleUserStatus();

    const users = data?.users || [];
    const totalPages = data?.pages || 1;

    const handleToggleStatus = (userId) => {
        if (window.confirm('Are you sure you want to change this users status?')) {
            toggleStatusMutation.mutate(userId);
        }
    };

    const roleBadgeStyles = {
        admin: 'bg-blue-500/10 text-blue-500',
        faculty: 'bg-purple-500/10 text-purple-500',
        student: 'bg-emerald-500/10 text-emerald-500'
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex justify-between items-center bg-bg-card/30 p-4 rounded-2xl border border-border-custom/50">
                <div>
                    <h2 className="text-2xl font-bold m-0 text-text-main">User Management</h2>
                    <p className="text-text-muted text-[0.85rem] mt-1 opacity-60">Manage employee and student identities across the institution.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-2 bg-bg-card/50 border border-border-custom text-text-main px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-bg-card hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Download size={18} /> Export List
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        <UserPlus size={18} /> Add New User
                    </button>
                </div>
            </header>

            <div className="flex gap-4 flex-wrap items-center bg-bg-card/20 p-4 rounded-2xl border border-border-custom/30">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or reg index..." 
                        className="w-full bg-bg-card/50 border border-border-custom rounded-xl py-3 pl-12 pr-4 text-text-main outline-none transition-all duration-200 focus:bg-bg-card focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-text-muted opacity-40" />
                        <select 
                            className="bg-bg-card/50 border border-border-custom rounded-xl px-4 py-3 text-text-main outline-none cursor-pointer focus:bg-bg-card focus:border-primary text-[0.9rem]"
                            value={role}
                            onChange={(e) => { setRole(e.target.value); setPage(1); }}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Student">Student</option>
                            <option value="HOD">HOD</option>
                            <option value="Librarian">Librarian</option>
                            <option value="Finance Officer">Finance Officer</option>
                        </select>
                    </div>

                    <select 
                        className="bg-bg-card/50 border border-border-custom rounded-xl px-4 py-3 text-text-main outline-none cursor-pointer focus:bg-bg-card focus:border-primary text-[0.9rem]"
                        value={isActive}
                        onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
                    >
                        <option value="">All Status</option>
                        <option value="true">Active Only</option>
                        <option value="false">Inactive Only</option>
                    </select>

                    <select 
                        className="bg-bg-card/50 border border-border-custom rounded-xl px-4 py-3 text-text-main outline-none cursor-pointer focus:bg-bg-card focus:border-primary text-[0.9rem] min-w-[150px]"
                        value={department}
                        onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                    >
                        <option value="">All Departments</option>
                        {academicHierarchy?.map(dept => (
                            <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-[20px] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">User Detalles</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">Role</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">Department</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">Registration</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">Status</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-text-muted opacity-50 border-b border-border-custom">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center text-text-muted opacity-40 p-10">Loading institutional directory...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center text-text-muted opacity-40 p-10">No users match your criteria.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-bg-card/20">
                                    <td className="px-6 py-4 border-b border-border-custom/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-bg-card/50 rounded-xl flex items-center justify-center text-primary border border-border-custom/30 overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    (user.role === 'Admin' || user.role === 'Super Admin') ? <Shield size={18} /> : <UserIcon size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="m-0 font-bold text-[0.95rem] text-text-main">{user.name || `${user.firstName} ${user.lastName}`}</p>
                                                <p className="m-0 text-[0.8rem] text-text-muted opacity-60 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-b border-border-custom/30">
                                        <span className={`px-2.5 py-1 rounded-lg text-[0.7rem] font-bold uppercase tracking-wider ${roleBadgeStyles[user.role.toLowerCase()] || 'bg-bg-card/50 text-text-main'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-border-custom/30 text-text-main font-medium">{user.department || 'General'}</td>
                                    <td className="px-6 py-4 border-b border-border-custom/30 text-[0.85rem] font-mono text-text-muted">{user.registrationNumber || 'PENDING'}</td>
                                    <td className="px-6 py-4 border-b border-border-custom/30">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-bold ${user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-border-custom/30">
                                        <div className="flex gap-2">
                                            <button 
                                                className="bg-transparent border-none cursor-pointer p-1.5 rounded-lg transition-all duration-200 text-text-muted opacity-40 hover:bg-bg-card hover:text-text-main"
                                                onClick={() => handleToggleStatus(user.id)}
                                                title={user.isActive ? 'Deactivate Account' : 'Activate Account'}
                                            >
                                                {user.isActive ? <XCircle size={18} className="text-rose-500" /> : <CheckCircle size={18} className="text-emerald-500" />}
                                            </button>
                                            <button className="bg-transparent border-none cursor-pointer p-1.5 rounded-lg transition-all duration-200 text-text-muted opacity-40 hover:bg-bg-card hover:text-text-main"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-2 px-2">
                <p className="text-[0.85rem] text-text-muted font-medium opacity-50">Showing Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="bg-bg-card/50 border border-border-custom text-text-main px-5 py-2 rounded-xl text-[0.85rem] font-semibold transition-all duration-200 hover:enabled:bg-bg-card disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Previous
                    </button>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="bg-bg-card/50 border border-border-custom text-text-main px-5 py-2 rounded-xl text-[0.85rem] font-semibold transition-all duration-200 hover:enabled:bg-bg-card disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

            <UserMutationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            <UserExportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                users={users}
            />
        </div>
    );
};

export default UserManagement;
