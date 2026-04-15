import React from 'react';
import { 
    Bell, CreditCard, Calendar, BookOpen, Clock, 
    MessageSquare, Briefcase, Users, LayoutDashboard,
    ArrowRightCircle, Wallet, Download, Clock3
} from 'lucide-react';
import { useStudentDashboard, useStudentCourses, useStudentMessages, useRecentPlacements } from './hooks/useStudentDashboard';
import BannerSlider from './components/BannerSlider';
import ImportantLinks from './components/ImportantLinks';
import CourseCard from './components/CourseCard';
import AnnouncementPanel from './components/AnnouncementPanel';
import AuthorityCard from './components/AuthorityCard';
import SocialPostCard from './components/SocialPostCard';

const StudentDashboard = () => {
    const { data: summary, isLoading: isSummaryLoading } = useStudentDashboard();
    const { data: courses, isLoading: isCoursesLoading } = useStudentCourses();
    const { data: messages } = useStudentMessages();
    const { data: placements } = useRecentPlacements();

    if (isSummaryLoading || isCoursesLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 max-w-[1600px] mx-auto pb-20">
            {/* Top Level: Hero Banner */}
            <section className="flex flex-col gap-8">
                <BannerSlider />
                
                {/* System Portals - Horizontal Scroll Container */}
                <div className="w-full overflow-hidden">
                    <ImportantLinks />
                </div>

                {/* Quick Insights Grid - Moved from side to main content flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Fee Quick Insight */}
                    {summary?.fees && (
                    <div className={`glass-card p-8 bg-black/5 dark:bg-white/5 border-l-4 relative overflow-hidden group ${
                        summary.fees.status === 'Paid' ? 'border-l-emerald-500' :
                        summary.fees.status === 'Overdue' ? 'border-l-rose-500' : 'border-l-amber-500'
                    }`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <Wallet size={120} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted opacity-60 mb-8 px-1">Financial Pulse</h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-1">
                                    {summary.fees.status === 'Paid' ? 'All Cleared' : 'Total Outstanding'}
                                </span>
                                <span className={`text-3xl font-black tabular-nums tracking-tighter cursor-default ${
                                    summary.fees.status === 'Paid' ? 'text-emerald-500' :
                                    summary.fees.status === 'Overdue' ? 'text-rose-500' : 'text-amber-500'
                                }`}>
                                    ₹{summary.fees.pending?.toLocaleString('en-IN') || 0}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                {summary.fees.status !== 'Paid' && (
                                <button className="flex-1 py-3 bg-primary text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all border-none cursor-pointer">Pay Now</button>
                                )}
                                <button className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all border-none cursor-pointer"><Download size={18} /></button>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Quick Activity Radar - Item 1 */}
                    <div className="glass-card p-8 flex flex-col justify-between border-t-4 border-t-primary">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted opacity-60 px-1 mb-6">Course Enrollment</h4>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[2.5rem] font-black text-primary tabular-nums tracking-tighter leading-none">{summary?.academic?.coursesEnrolled || 0}</span>
                                <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.1em]">Active Subjects</span>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <BookOpen size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Activity Radar - Item 2 */}
                    <div className="glass-card p-8 flex flex-col justify-between border-t-4 border-t-amber-500">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted opacity-60 px-1 mb-6">Attendance Rating</h4>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[2.5rem] font-black text-amber-500 tabular-nums tracking-tighter leading-none">{summary?.academic?.attendanceRating}%</span>
                                <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.1em]">Presence Score</span>
                            </div>
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                                <Clock3 size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section - hand-crafted non-perfect grid */}
            <section className="flex flex-col gap-6">
                <div className="flex justify-between items-end px-2 pb-4 border-b border-border-custom/50">
                    <div>
                        <h2 className="text-3xl font-black text-text-main italic tracking-tighter">MY COURSES</h2>
                        <p className="text-text-muted text-sm font-medium mt-1">Current Active Learning Pathways</p>
                    </div>
                    <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all bg-transparent border-none cursor-pointer">
                        View All <ArrowRightCircle size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Simulated handcrafted variation by showing a few realistic cards */}
                    {courses?.length > 0 ? (
                        courses.map((course, i) => (
                            <CourseCard key={course.id} course={{
                                ...course,
                                attendance: 75 + i * 5,
                                progress: 40 + i * 12,
                                faculty: 'Professor Aris Thorne'
                            }} />
                        ))
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center glass-card border-dashed border-2 border-border-custom/30 opacity-60 bg-black/5 dark:bg-white/5 rounded-[40px]">
                            <BookOpen size={64} className="text-text-muted mb-4 opacity-20" />
                            <p className="text-xl font-black text-text-main italic tracking-tight uppercase">No Course Assigned</p>
                            <p className="text-text-muted text-sm font-medium mt-1">Contact your registrar or academic HOD to complete enrollment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Triple Column: Messaging, Announcements, Authority */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                <div className="flex flex-col gap-8 text-text-main">
                    {/* Messages Panel */}
                    <div className="glass-card flex flex-col gap-8 border-t-4 border-t-primary bg-bg-card shadow-sm">
                         <div className="flex justify-between items-center p-8 pb-4 border-b border-border-custom/50">
                            <h3 className="text-xl font-black flex items-center gap-4 italic tracking-tighter uppercase">
                                Recent Dispatches
                            </h3>
                            <span className="bg-rose-500/10 text-rose-500 text-[0.6rem] font-black px-2 py-1 rounded-md tracking-widest leading-none outline outline-1 outline-rose-500/20">{messages?.length || 0} NEW</span>
                        </div>
                        <div className="px-8 pb-8 space-y-4">
                            {messages?.slice(0, 3).map((msg, i) => (
                                <div key={i} className="p-6 flex items-start gap-5 hover:bg-black/5 dark:hover:bg-white/5 transition-all border border-border-custom/50 rounded-3xl relative group cursor-pointer">
                                    <div className="w-12 h-12 rounded-[20px] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-0.5 group-hover:border-primary/50 transition-colors shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${msg.sender?.firstName}&background=random`} alt="" className="w-full h-full object-cover rounded-[18px]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-[0.95rem] group-hover:text-primary transition-colors truncate">{msg.sender?.firstName} {msg.sender?.lastName}</span>
                                            <span className="text-[0.6rem] font-bold text-text-muted opacity-40 uppercase shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest mb-2 opacity-60 italic">{msg.subject}</p>
                                        <p className="text-[0.85rem] text-text-muted line-clamp-1 leading-relaxed">{msg.body}</p>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRightCircle size={20} className="text-primary" />
                                    </div>
                                </div>
                            ))}
                            {(!messages || messages.length === 0) && (
                                <div className="py-12 text-center opacity-30 italic text-sm">No recent dispatches found</div>
                            )}
                        </div>
                    </div>

                    {/* Social Footprints */}
                    <div className="glass-card flex flex-col gap-8 bg-bg-card shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center p-8 pb-4 border-b border-border-custom/50">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Social Footprints</h3>
                        </div>
                        <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SocialPostCard post={{ likes: 1420, caption: "Our University's annual tech-fest 'CAMPUS-CONNECT' is finally live! Check the portal for volunteering registrations." }} />
                            <SocialPostCard post={{ likes: 980, image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80&w=800", caption: "Sunrise at the main campus. A great start to a productive submission week. #CampusVibes" }} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Announcement Tabbed Console */}
                    <div className="glass-card flex flex-col gap-6 border-t-4 border-t-amber-500 bg-bg-card shadow-sm overflow-hidden min-h-fit">
                        <div className="p-6 pb-0">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] pb-3 border-b border-border-custom/50 flex items-center gap-2">
                                <Bell size={16} className="text-amber-500" /> Global Bulletin
                            </h3>
                        </div>
                        <div className="p-6 pt-0">
                            <AnnouncementPanel announcements={[
                                { title: 'Examination Form Deadline', date: new Date(), category: 'Academic', description: 'Exam forms for even semester must be filled by end of this week.' },
                                { title: 'Amazon AWS Workshop', date: new Date(), category: 'Placement', description: 'Certification drive for final year students starting on Tuesday.' }
                            ]} />
                        </div>
                    </div>

                    {/* Know Your Authorities */}
                    <div className="glass-card flex flex-col gap-6 border-t-4 border-t-indigo-500 bg-bg-card shadow-sm overflow-hidden">
                        <div className="p-6 pb-0">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] pb-3 border-b border-border-custom/50 flex items-center gap-2">
                                <Users size={16} className="text-indigo-500" /> Academic Leadership
                            </h3>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            <AuthorityCard authority={{ name: 'Dr. Marcus Vane', designation: 'Head of Department - CS', email: 'm.vany@campusone.edu' }} />
                            <AuthorityCard authority={{ name: 'Professor Elena Stark', designation: 'Academic Mentor', email: 'e.stark@campusone.edu' }} />
                        </div>
                    </div>

                    {/* Placement Carousel (Simple List for hand-crafted feel) */}
                    <div className="glass-card flex flex-col gap-6 border-t-4 border-t-emerald-500 bg-bg-card shadow-sm overflow-hidden">
                        <div className="p-6 pb-0">
                            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] pb-3 border-b border-emerald-500/20 flex items-center gap-2">
                                <Briefcase size={16} /> Placement Highlife
                            </h3>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                            {placements?.slice(0, 3).map((p, i) => (
                                <div key={i} className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-3xl border border-border-custom/30 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-default">
                                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl p-1 shrink-0 border border-border-custom/20 overflow-hidden shadow-sm">
                                        <img src={`https://logo.clearbit.com/${p.companyName.toLowerCase().replace(' ', '')}.com`} onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=C"} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-text-main truncate group-hover:text-primary transition-colors">{p.student?.firstName} {p.student?.lastName}</p>
                                        <p className="text-[0.65rem] text-text-muted font-bold uppercase tracking-wider">{p.companyName}</p>
                                    </div>
                                    <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[0.65rem] font-black border border-emerald-500/20">{p.package}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
