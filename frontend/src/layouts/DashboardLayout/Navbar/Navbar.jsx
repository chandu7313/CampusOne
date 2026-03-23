import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useAuthStore } from '../../../store/authStore';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, notifications } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-navbar flex items-center justify-between px-6 sticky top-0 z-[90] glass">
      <div className="flex items-center gap-5">
        <div className="hidden min-[600px]:flex items-center bg-bg-main border border-border-custom rounded-lg px-3 py-1.5 gap-2 w-[300px]">
          <Search size={18} className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Search Students, Staff, Data..." 
            className="bg-transparent border-none w-full text-text-main outline-none text-[0.9rem]"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={toggleTheme} className="relative text-text-muted flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-border-custom hover:text-primary">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="relative" ref={notifRef}>
          <div 
            className="text-text-muted flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-border-custom hover:text-primary cursor-pointer"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={20} />
            {notifications?.length > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[0.7rem] px-1.5 py-0.5 rounded-full font-bold">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[320px] rounded-xl border border-border-custom bg-bg-main shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 z-[100] overflow-hidden">
              <div className="px-4 py-3 border-b border-border-custom flex justify-between items-center">
                <h3 className="font-semibold text-text-main">Notifications</h3>
                <span className="text-[0.75rem] text-primary cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications?.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div key={index} className="px-4 py-3 border-b border-border-custom hover:bg-surface-hover transition-colors cursor-pointer">
                      <p className="text-[0.85rem] font-medium text-text-main mb-1">{notif.title}</p>
                      <p className="text-[0.8rem] text-text-muted">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-text-muted text-[0.85rem]">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          className="relative flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-border-custom" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={dropdownRef}
        >
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
            alt="User" 
            className="w-[38px] h-[38px] rounded-full object-cover"
          />
          <div className="hidden min-[600px]:flex flex-col">
            <span className="text-[0.9rem] font-semibold">{user?.name || 'Guest'}</span>
            <span className="text-[0.75rem] text-text-muted">{user?.role || 'Visitor'}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 text-text-muted ${isDropdownOpen ? 'rotate-180' : ''}`} 
          />

          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] rounded-xl border border-border-custom p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 cursor-default glass">
              <div className="px-4 py-3">
                <p className="text-[0.9rem] font-semibold text-text-main">{user?.name}</p>
                <p className="text-[0.75rem] text-text-muted">{user?.email}</p>
              </div>
              <div className="h-[1px] bg-border-custom mx-2 my-1" />
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.875rem] text-text-main transition-all duration-200 hover:bg-border-custom hover:text-primary cursor-pointer">
                <UserIcon size={16} />
                <span>My Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.875rem] text-text-main transition-all duration-200 hover:bg-border-custom hover:text-primary cursor-pointer">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="h-[1px] bg-border-custom mx-2 my-1" />
              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.875rem] transition-all duration-200 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
