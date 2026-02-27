import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp, 
  Wallet, 
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: GraduationCap, label: 'Faculty', path: '/faculty' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: ClipboardCheck, label: 'Enrollment', path: '/enrollment' },
  { icon: TrendingUp, label: 'Grades', path: '/grades' },
  { icon: Wallet, label: 'Finance', path: '/finance' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''} ${isOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>C</div>
        {isOpen && <span className={styles.logoText}>CAMPUS<span>ONE</span></span>}
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item, index) => (
          <a key={index} href={item.path} className={styles.navItem}>
            <item.icon size={20} className={styles.icon} />
            {isOpen && <span className={styles.label}>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className={styles.footer}>
        <a href="/admin" className={styles.adminPanel}>
          <ShieldCheck size={20} className={styles.icon} />
          {isOpen && <span className={styles.label}>Admin Panel</span>}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
