import styles from './DashboardLayout.module.css';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
      <div className={`${styles.main} ${!isSidebarOpen ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
