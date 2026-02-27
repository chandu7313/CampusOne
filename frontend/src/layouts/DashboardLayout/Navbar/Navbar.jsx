import { Search, Bell, Moon, Sun, Menu, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useAuthStore } from '../../../store/authStore';
import styles from './Navbar.module.css';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className={`${styles.navbar} glass`}>
      <div className={styles.left}>
        <button onClick={toggleSidebar} className={styles.menuBtn}>
          <Menu size={20} />
        </button>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search Students, Staff, Data..." />
        </div>
      </div>

      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.iconBtn}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className={styles.notifications}>
          <Bell size={20} />
          <span className={styles.badge}>12</span>
        </div>

        <div className={styles.userProfile}>
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
            alt="User" 
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || 'Guest'}</span>
            <span className={styles.userRole}>{user?.role || 'Visitor'}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
