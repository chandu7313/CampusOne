import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, BookOpen, Calendar, CheckSquare, FileEdit, 
    GraduationCap, Wallet, Bell, Trophy, Briefcase, 
    MessageSquare, ShieldAlert, User, LogOut, ChevronLeft, ChevronRight,
    Search, Command
} from 'lucide-react';
import logo from '../../../assets/campusone_logo.png';


const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
    { icon: CheckSquare, label: 'Attendance', path: '/student/attendance' },
    { icon: FileEdit, label: 'Assignments', path: '/student/assignments' },
    { icon: GraduationCap, label: 'Exams', path: '/student/exams' },
    { icon: Wallet, label: 'Fees', path: '/student/fees' },
    { icon: Bell, label: 'Announcements', path: '/student/announcements' },
    { icon: Trophy, label: 'Events', path: '/student/events' },
    { icon: Briefcase, label: 'Placements', path: '/student/placements' },
    { icon: MessageSquare, label: 'Messages', path: '/student/messages' },
    { icon: ShieldAlert, label: 'Authorities', path: '/student/authorities' },
    { icon: User, label: 'Profile', path: '/student/profile' },
];

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside className={`
            fixed top-0 left-0 h-full bg-bg-card border-r border-border-custom z-50 transition-all duration-300
            ${isOpen ? 'w-sidebar' : 'w-sidebar-collapsed'}
            max-md:translate-x-[-100%] max-md:fixed
        `}>
            {/* Logo Area */}
            <div className={`p-6 flex items-center justify-between ${!isOpen && 'justify-center p-4'}`}>
                {isOpen ? (
                    <div className="flex items-center gap-3">
                        
                        <img 
                            src={logo} 
                            alt="CampusOne Logo" 
                            className={`w-auto object-contain transition-[height] duration-300 ${isOpen ? 'h-9' : 'h-8'}`} 
                            />
                        <span className="text-xl font-black tracking-tight text-text-main">CampusOne</span>
                    </div>
                ) : (
                    <img 
                        src={logo} 
                        alt="CampusOne Logo" 
                        className={`w-auto object-contain transition-[height] duration-300 ${isOpen ? 'h-9' : 'h-8'}`} 
                        />
                )}
                
                <button 
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg border-none text-text-muted transition-colors max-md:hidden"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-8 space-y-1.5 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                            ${isActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main'}
                            ${!isOpen && 'justify-center px-0'}
                        `}
                    >
                        <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                        {isOpen && <span className="font-bold text-[0.9rem]">{item.label}</span>}
                        {isOpen && (
                            <div className="ml-auto w-1 h-1 rounded-full bg-primary dark:bg-white opacity-0 group-data-[active=true]:opacity-100" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-border-custom bg-bg-card/80 backdrop-blur-md">
                <button 
                    className={`
                        flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all border-none cursor-pointer
                        ${!isOpen && 'justify-center px-0'}
                    `}
                >
                    <LogOut size={22} />
                    {isOpen && <span className="font-bold text-[0.9rem]">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
