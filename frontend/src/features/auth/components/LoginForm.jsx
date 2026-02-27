import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mocking Auth for now since backend endpoints are shell only
    setTimeout(() => {
      const isAdmin = email.includes('admin');
      setAuth({ 
        id: isAdmin ? '2' : '1', 
        name: isAdmin ? 'System Admin' : 'Dr. Alisha Sharma', 
        role: isAdmin ? 'Admin' : 'Student', 
        email: email
      }, 'mock-jwt-token');
      setLoading(false);
      navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass`}>
        <div className={styles.header}>
          <div className={styles.logo}>C</div>
          <h1>CAMPUS<span>ONE</span></h1>
          <p>Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campusone.edu"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Login'}
          </button>
        </form>

        <div className={styles.footer}>
          <Shield size={16} />
          <span>Protected by CampusOne Security</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
