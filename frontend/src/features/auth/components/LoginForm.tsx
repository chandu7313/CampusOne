import { useState, FormEvent } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, Award } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import logo from '../../../assets/campusone_logo.png';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, data } = response.data;
      
      setAuth(data.user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden">
      {/* Left Side: Testimonials (Visible on Desktop) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-primary/10 to-transparent relative flex-col items-center justify-center p-12 border-r border-white/5">
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Award className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl tracking-tight">Our Shining Stars</h2>
            <p className="text-white/40 text-sm">Recently placed students from batch 2024-25</p>
          </div>
        </div>
        
        <div className="w-full h-full max-h-[700px]">
          <StaggerTestimonials />
        </div>

        <div className="absolute bottom-12 left-12 right-12 text-white/30 text-xs flex justify-between items-center px-4">
          <span>&copy; 2026 CampusOne ERP Systems</span>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-[420px] p-8 sm:p-10 rounded-2xl flex flex-col gap-8 glass relative z-10 border border-white/10 shadow-2xl">
          <div className="text-center">
            <img src={logo} alt="CampusOne Logo" className="h-[50px] w-auto mx-auto mb-4 block object-contain" />
            <h1 className="text-2xl font-bold mb-1 text-white">CAMPUS<span className="text-primary italic">ONE</span></h1>
            <p className="text-white/50 text-sm">Enter your credentials to access the ERP</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusone.edu"
                className="p-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none transition-all duration-200 focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none transition-all duration-200 focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-white/60">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" title="Feature coming soon" className="text-primary font-medium hover:text-primary/80 transition-colors">Forgot Password?</a>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl text-sm text-center border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="mt-2 bg-primary text-white p-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-white/30 text-[0.7rem] uppercase tracking-widest font-medium">
            <Shield size={14} />
            <span>Secure Enterprise Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
