import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import logo from '../../../assets/campusone_logo.png';
import PlacedStudentsCarousel from './PlacedStudentsCarousel';
import UniversityHighlights from './UniversityHighlights';
import { useTheme } from '../../../hooks/useTheme';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, refreshToken, data } = response.data;
      
      setAuth(data.user, token, refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (role) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.post('/auth/test-login', { role });
      const { token, refreshToken, data } = response.data;
      
      setAuth(data.user, token, refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to login quickly as ${role}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-bg-main overflow-hidden">
      {/* Left Side: Highlights and Carousel Section */}
      <div className="hidden lg:flex flex-[1.2] relative bg-gradient-to-br from-bg-main to-bg-dark flex-col items-center justify-center py-8 p-8 border-r border-border-custom overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-4xl text-center mb-2">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">University <span className="text-primary">Excellence</span></h2>
          <p className="text-text-muted text-md max-w-2xl mx-auto italic">Explore our legacy of achievements and successful career launches.</p>
        </div>

        {/* University Highlights Section */}
        <div className="relative z-10 w-full mb-2">
          <UniversityHighlights />
        </div>

        {/* Separator / Sub-heading for Carousel */}
        <div className="relative z-10 w-full max-w-4xl px-4 mt-4 mb-12 border-t border-white/5 pt-4">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-lg font-bold">Recent Success Stories</h3>
             <span className="text-[10px] font-semibold text-text-muted uppercase">Placed Students</span>
           </div>
        </div>

        {/* Placed Students Carousel Section */}
        <div className="relative z-10 w-full flex-1 max-h-[420px]">
          <PlacedStudentsCarousel />
        </div>
      </div>

      {/* Right Side: Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full -z-10 opacity-5">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-hover rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-[420px] p-8 lg:p-10 rounded-2xl flex flex-col gap-8 glass relative z-10 shadow-2xl border border-white/10">
          <div className="text-center">
            <img src={logo} alt="CampusOne Logo" className="h-[50px] lg:h-[60px] w-auto mx-auto mb-4 block object-contain" />
            <h1 className="text-2xl font-bold mb-2 tracking-tight">CAMPUS<span className="text-primary">ONE</span></h1>
            <p className="text-text-muted text-[0.95rem]">Login to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main ml-1 text-opacity-80">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusone.edu"
                className="p-3.5 px-4 bg-bg-main/50 border border-border-custom rounded-xl text-text-main outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main ml-1 text-opacity-80">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 px-4 bg-bg-main/50 border border-border-custom rounded-xl text-text-main outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted/50"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm px-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-text-main/80 group">
                <input type="checkbox" className="w-4 h-4 rounded border-border-custom text-primary focus:ring-primary bg-bg-main" />
                <span className="group-hover:text-text-main transition-colors">Remember me</span>
              </label>
              <a href="/forgot-password" title="Feature coming soon" className="text-primary font-semibold hover:text-primary-hover transition-colors">Forgot Password?</a>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-xl text-sm text-center border border-rose-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="bg-primary text-white p-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="relative flex items-center mb-2">
              <div className="flex-grow border-t border-border-custom"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-semibold uppercase tracking-wider">Quick Login (Dev)</span>
              <div className="flex-grow border-t border-border-custom"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleTestLogin('Admin')}
                disabled={loading}
                className="py-2.5 px-3 rounded-lg border border-border-custom bg-bg-main/50 text-text-main text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleTestLogin('Student')}
                disabled={loading}
                className="py-2.5 px-3 rounded-lg border border-border-custom bg-bg-main/50 text-text-main text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleTestLogin('Faculty')}
                disabled={loading}
                className="py-2.5 px-3 rounded-lg border border-border-custom bg-bg-main/50 text-text-main text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                Faculty
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-text-muted text-[0.8rem] pt-2 border-t border-border-custom/50">
            <Shield size={16} />
            <span>Secure Enterprise-Grade Access</span>
          </div>
        </div>
      </div>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 p-3.5 rounded-full glass border border-white/10 shadow-2xl text-text-main hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-[100]"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      </button>
    </div>
  );
};

export default LoginForm;
