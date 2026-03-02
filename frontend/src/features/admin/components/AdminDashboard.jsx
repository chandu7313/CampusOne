import React from 'react';
import { Users, GraduationCap, DollarSign, Activity, UserPlus, FileText, Shield, Archive } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import DepartmentDistribution from './DepartmentDistribution';
import SystemLogs from './SystemLogs';
import FileUpload from '../../../components/FileUpload/FileUpload';

const AdminDashboard = () => {
    const { data: stats, isLoading, isError } = useAdminStats();

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px] text-[1.1rem] text-white/60">Loading Dashboard...</div>;
    if (isError) return <div className="flex items-center justify-center min-h-[400px] text-[1.1rem] text-rose-500">Error loading dashboard statistics.</div>;

    const { counts, systemHealth } = stats || {};
    return (
        <div className="flex flex-col gap-8 pb-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-bold m-0 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-white/50 text-[0.95rem] mt-1">System Overview & Institutional Analytics</p>
                </div>
            </header>

            <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
                <StatCard 
                    icon={Users} 
                    title="Total Students" 
                    value={counts?.students} 
                    trend={3.1} 
                    color="blue" 
                />
                <StatCard 
                    icon={GraduationCap} 
                    title="Total Faculty" 
                    value={counts?.faculty} 
                    trend={1.8} 
                    color="purple" 
                />
                <StatCard 
                    icon={Shield} 
                    title="Total Admins" 
                    value={counts?.admins} 
                    color="emerald" 
                />
                <StatCard 
                    icon={Activity} 
                    title="System Health" 
                    value={systemHealth?.database === 'Connected' ? 'Optimal' : 'Issues'} 
                    color="amber" 
                />
            </section>

            <div className="grid grid-cols-[2fr_1fr] gap-6 max-xl:grid-cols-1">
                <div className="flex flex-col gap-6">
                    <RevenueChart data={stats?.revenueData} />
                    <DepartmentDistribution data={stats?.departmentData} />
                </div>
                
                <div className="flex flex-col gap-6">
                    <SystemLogs logs={stats?.recentLogs} />
                    
                    <div className="glass rounded-[20px] p-6">
                        <h3 className="text-[1.1rem] font-semibold mb-5 text-white/90">Quick Actions</h3>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                            <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/2 text-white/80 text-[0.85rem] font-medium transition-all duration-200 hover:bg-white/8 hover:border-white/20 hover:text-white hover:-translate-y-0.5 cursor-pointer">
                                <UserPlus size={16} /> Add Student
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/2 text-white/80 text-[0.85rem] font-medium transition-all duration-200 hover:bg-white/8 hover:border-white/20 hover:text-white hover:-translate-y-0.5 cursor-pointer">
                                <FileText size={16} /> Generate Report
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/2 text-white/80 text-[0.85rem] font-medium transition-all duration-200 hover:bg-white/8 hover:border-white/20 hover:text-white hover:-translate-y-0.5 cursor-pointer">
                                <Shield size={16} /> Manage Roles
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/2 text-white/80 text-[0.85rem] font-medium transition-all duration-200 hover:bg-white/8 hover:border-white/20 hover:text-white hover:-translate-y-0.5 cursor-pointer">
                                <Archive size={16} /> Audit Trail
                            </button>
                        </div>
                    </div>
                    
                    <div className="glass rounded-[20px] p-6">
                        <h3 className="text-[1.1rem] font-semibold mb-5 text-white/90">Test File Upload</h3>
                        <FileUpload />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
