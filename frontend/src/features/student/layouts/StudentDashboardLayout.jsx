import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import Navbar from '../../../layouts/DashboardLayout/Navbar/Navbar'; // Reusing standard navbar but can customize if needed

const StudentDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-bg-main text-text-main overflow-hidden font-inter">
            <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Mobile Overlay */}
            {!isSidebarOpen && (
                <div 
                    className="hidden max-lg:block fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`
                flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 relative
                ${isSidebarOpen ? 'ml-[280px]' : 'ml-[88px]'}
                max-md:ml-0
            `}>
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                
                <main className="p-8 max-w-[1500px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </main>

                <footer className="p-10 border-t border-border-custom/30 text-center opacity-30">
                    <p className="text-xs font-medium uppercase tracking-[0.2em]">CampusOne Academic Portal &copy; 2024</p>
                </footer>
            </div>

            <style>{`
                .w-sidebar { width: 280px; }
                .w-sidebar-collapsed { width: 88px; }
                .ml-sidebar { margin-left: 280px; }
                .ml-sidebar-collapsed { margin-left: 88px; }
                
                /* Custom handcrafted shadows and effects */
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 32px;
                }
                
                .handcrafted-shadow {
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboardLayout;
