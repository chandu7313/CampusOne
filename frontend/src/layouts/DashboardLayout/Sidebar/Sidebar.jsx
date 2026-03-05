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
      <div className="h-navbar flex items-center justify-between px-5 gap-3 border-b border-border-custom overflow-hidden">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="CampusOne Logo" 
            className={`w-auto object-contain transition-[height] duration-300 ${isOpen ? 'h-9' : 'h-8'}`} 
          />
          {isOpen && (
            <span className="font-bold text-[1.1rem] tracking-tighter whitespace-nowrap">
              CAMPUS<span className="text-primary font-black italic">ONE</span>
            </span>
          )}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-1.5 rounded-lg text-text-muted hover:bg-primary/5 hover:text-primary transition-all duration-200"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
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

      <div className="p-5 px-3 border-t border-border-custom opacity-40">
        <div className="flex items-center justify-center py-2">
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted whitespace-nowrap">
                {isOpen ? '© 2026 CampusOne v1.0.4' : 'v1.0'}
            </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
