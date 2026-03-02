import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-bg-main text-text-main overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {isSidebarOpen && (
        <div 
          className="hidden max-lg:block fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={`
        flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 relative
        ${isSidebarOpen ? 'ml-sidebar' : 'ml-sidebar-collapsed'}
        max-md:ml-0
      `}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
