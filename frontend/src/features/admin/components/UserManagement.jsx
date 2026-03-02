import React, { useState } from 'react';
import { useUsers, useToggleUserStatus } from '../hooks/useUsers';
import { Search, Filter, UserPlus, MoreVertical, Shield, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = () => {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useUsers({ search, role, page });
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
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0">User Management</h2>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 cursor-pointer">
                    <UserPlus size={18} /> Add New User
                </button>
            </header>

            <div className="flex gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none transition-all duration-200 focus:bg-white/8 focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <select 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer focus:bg-white/8 focus:border-primary"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
            </div>

            <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-[20px] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">User</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">Role</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">Department</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">Status</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">Created At</th>
                            <th className="text-left px-6 py-4 text-[0.85rem] font-semibold text-white/50 border-b border-white/5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center text-white/40 p-10">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center text-white/40 p-10">No users found.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 border-b border-white/[0.03]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-blue-500">
                                                {user.role === 'Admin' ? <Shield size={16} /> : <UserIcon size={16} />}
                                            </div>
                                            <div>
                                                <p className="m-0 font-semibold text-[0.95rem] text-white">{user.name}</p>
                                                <p className="m-0 text-[0.8rem] text-white/40">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-b border-white/[0.03]">
                                        <span className={`px-2.5 py-1 rounded-lg text-[0.75rem] font-semibold ${roleBadgeStyles[user.role.toLowerCase()] || 'bg-white/10 text-white'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-white/[0.03] text-white/80">{user.department || 'N/A'}</td>
                                    <td className="px-6 py-4 border-b border-white/[0.03]">
                                        <span className={`px-2.5 py-1 rounded-lg text-[0.75rem] font-semibold ${user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-white/[0.03] text-white/60">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border-b border-white/[0.03]">
                                        <div className="flex gap-2">
                                            <button 
                                                className="bg-transparent border-none cursor-pointer p-1 rounded-md transition-all duration-200 text-white/40 hover:bg-white/5 hover:text-white"
                                                onClick={() => handleToggleStatus(user.id)}
                                                title={user.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {user.isActive ? <XCircle size={18} className="text-rose-500" /> : <CheckCircle size={18} className="text-emerald-500" />}
                                            </button>
                                            <button className="bg-transparent border-none cursor-pointer p-1 rounded-md transition-all duration-200 text-white/40 hover:bg-white/5 hover:text-white"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <p className="text-[0.9rem] text-white/50">Page {page} of {totalPages}</p>
                <div className="flex gap-3">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-[0.85rem] transition-all duration-200 hover:enabled:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Previous
                    </button>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-[0.85rem] transition-all duration-200 hover:enabled:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
