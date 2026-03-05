import React, { useState } from 'react';
import { Users, Book, Clock, AlertTriangle, Search, Filter, TrendingUp } from 'lucide-react';
import { useFacultyProfiles } from '../hooks/useFaculty';

const FacultyWorkload = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const { data: faculty, isLoading } = useFacultyProfiles(selectedDept);

    const filteredFaculty = faculty?.filter(f => 
        `${f.user?.firstName} ${f.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold m-0 text-text-main">Faculty Load Management</h2>
                    <p className="text-text-muted text-[0.95rem] mt-1">Resource Optimization & Teaching Capacities</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-bg-card p-1 rounded-xl border border-border-custom h-fit">
                        <button className="px-4 py-1.5 rounded-lg text-sm font-bold bg-primary text-white">Grid</button>
                        <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-main">Table</button>
                    </div>
                </div>
            </header>

            <div className="flex gap-4">
                <div className="flex-1 glass flex items-center px-4 gap-3 border border-border-custom/50">
                    <Search size={18} className="text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search faculty by name..." 
                        className="bg-transparent border-none outline-none text-text-main py-3 w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="glass px-4 py-2 border border-border-custom/50 text-text-main text-sm outline-none focus:border-primary/50"
                    onChange={(e) => setSelectedDept(e.target.value)}
                >
                    <option value="">All Departments</option>
                    <option value="cs">Computer Science</option>
                    <option value="ee">Electrical Engineering</option>
                </select>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-20 opacity-40">Loading Faculty profiles...</div>
                ) : filteredFaculty?.length === 0 ? (
                    <div className="col-span-full text-center py-20 opacity-40">No faculty found.</div>
                ) : filteredFaculty?.map(profile => {
                    const workloadPercentage = (profile.currentWeeklyHours / profile.maxWeeklyHours) * 100;
                    const isOverloaded = workloadPercentage > 90;

                    return (
                        <div key={profile.userId} className="glass p-6 rounded-[28px] border border-border-custom/30 flex flex-col gap-5 hover:border-primary/30 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {profile.user?.firstName?.[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-text-main group-hover:text-primary transition-colors">
                                            {profile.user?.firstName} {profile.user?.lastName}
                                        </span>
                                        <span className="text-[0.7rem] text-text-muted italic">{profile.department?.name || 'Academic Faculty'}</span>
                                    </div>
                                </div>
                                {isOverloaded && <AlertTriangle size={18} className="text-rose-500 animate-pulse" />}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-[0.75rem] font-bold">
                                    <span className="text-text-muted uppercase tracking-wider">Weekly Workload</span>
                                    <span className={isOverloaded ? 'text-rose-500' : 'text-text-main'}>
                                        {profile.currentWeeklyHours} / {profile.maxWeeklyHours} Hours
                                    </span>
                                </div>
                                <div className="h-2.5 bg-bg-card/50 rounded-full overflow-hidden border border-border-custom/20 p-[1px]">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-bg-card/40 p-3 rounded-2xl border border-border-custom/20">
                                    <div className="flex items-center gap-2 text-text-muted mb-1">
                                        <Book size={14} />
                                        <span className="text-[0.65rem] font-bold uppercase">Lectures</span>
                                    </div>
                                    <span className="text-lg font-bold text-text-main">4</span>
                                </div>
                                <div className="bg-bg-card/40 p-3 rounded-2xl border border-border-custom/20">
                                    <div className="flex items-center gap-2 text-text-muted mb-1">
                                        <TrendingUp size={14} />
                                        <span className="text-[0.65rem] font-bold uppercase">Efficiency</span>
                                    </div>
                                    <span className="text-lg font-bold text-text-main">92%</span>
                                </div>
                            </div>

                            <button className="mt-2 w-full py-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[0.8rem] font-bold hover:bg-primary hover:text-white transition-all">
                                View Full Schedule
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FacultyWorkload;
