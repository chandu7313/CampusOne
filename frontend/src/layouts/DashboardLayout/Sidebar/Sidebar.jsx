import { 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { roleMenus } from '../../../config/sidebarConfig';
import logo from '../../../assets/campusone_logo.png';
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Get menu items for current role, fallback to empty array
  const menuItems = roleMenus[user?.role] || [];

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-bg-sidebar border-r border-border-custom flex flex-col transition-[width] duration-300 z-[100]
      ${isOpen ? 'w-sidebar' : 'w-sidebar-collapsed'}
      max-md:-translate-x-full
      ${isOpen ? 'max-md:translate-x-0 max-md:shadow-2xl' : ''}
    `}>
      <div className="h-navbar flex items-center px-6 gap-3 border-b border-border-custom overflow-hidden">
        <img 
          src={logo} 
          alt="CampusOne Logo" 
          className={`w-auto object-contain transition-[height] duration-300 ${isOpen ? 'h-10' : 'h-8'}`} 
        />
        {isOpen && (
          <span className="font-bold text-[1.1rem] tracking-tight whitespace-nowrap">
            CAMPUS<span className="text-primary">ONE</span>
          </span>
        )}
      </div>

      <nav className="p-5 px-3 flex-1 flex flex-col gap-1 overflow-y-auto scroller">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`
                flex items-center p-3 rounded-lg text-text-muted transition-all duration-200 gap-3
                ${isActive ? 'bg-primary/5 text-primary font-medium' : 'hover:bg-primary/5 hover:text-primary'}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-5 px-3 border-t border-border-custom">
        <button 
          onClick={toggleSidebar} 
          className="flex items-center p-3 rounded-lg text-text-muted transition-all duration-200 gap-3 hover:bg-primary/5 hover:text-primary w-full"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {isOpen && <span className="text-sm font-medium whitespace-nowrap">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
