import React, { useState } from 'react';
import { useAuthorities } from '../../../hooks/useUser';
import { Users, Shield, BookOpen, Mail, ChevronRight, Search } from 'lucide-react';

const Authorities = () => {
    const { data, isLoading } = useAuthorities();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="p-20 text-center animate-pulse text-primary font-bold">Loading Directory...</div>;

    const filteredLeadership = data?.leadership?.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredHods = data?.hods?.filter(h => 
        `${h.user?.firstName} ${h.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-10 max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-custom/50 pb-8 px-2 mt-4 md:mt-0">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        University <span className="text-primary italic">Authorities</span>
                    </h1>
                    <p className="text-text-muted font-medium">Connect with the leadership and academic heads.</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search directory..." 
                        className="w-full bg-black/5 dark:bg-white/5 border border-border-custom/50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-primary transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* University Leadership */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Shield className="text-primary" size={24} />
                    <h2 className="text-xl font-black text-text-main uppercase tracking-widest italic">Core Leadership</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLeadership?.map((leader, i) => (
                        <div key={i} className="glass-card p-6 flex items-center gap-5 border border-border-custom/50 hover:border-primary/30 transition-all group">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                {leader.name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-text-main leading-none mb-1">{leader.name}</h3>
                                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">{leader.role}</p>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                                    <Mail size={12} /> {leader.email}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Academic Heads (HODs) */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <BookOpen className="text-primary" size={24} />
                    <h2 className="text-xl font-black text-text-main uppercase tracking-widest italic">Academic Heads (HODs)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHods?.map((hod, i) => (
                        <div key={i} className="glass-card p-6 border border-border-custom/50 hover:border-primary/30 transition-all flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-main font-black">
                                    {hod.user?.firstName[0]}{hod.user?.lastName[0]}
                                </div>
                                <span className="bg-primary/10 text-primary text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                    {hod.department?.code}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bold text-text-main">{hod.user?.firstName} {hod.user?.lastName}</h3>
                                <p className="text-xs text-text-muted font-medium mb-3">Head of Department</p>
                                <p className="text-xs font-black text-text-main/70 uppercase tracking-tighter mb-4">{hod.department?.name}</p>
                                <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                                    View Profile <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Authorities;
