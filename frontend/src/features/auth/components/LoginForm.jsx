import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import logo from '../../../assets/campusone_logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, data } = response.data;
      
      setAuth(data.user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-5">
      <div className="w-full max-w-[420px] p-10 rounded-xl flex flex-col gap-8 glass">
        <div className="text-center">
          <img src={logo} alt="CampusOne Logo" className="h-[60px] w-auto mx-auto mb-4 block object-contain" />
          <h1 className="text-2xl font-bold mb-2">CAMPUS<span className="text-primary">ONE</span></h1>
          <p className="text-text-muted text-[0.95rem]">Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campusone.edu"
              className="p-3 px-4 bg-bg-main border border-border-custom rounded-lg text-text-main outline-none transition-colors duration-200 focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 px-4 bg-bg-main border border-border-custom rounded-lg text-text-main outline-none transition-colors duration-200 focus:border-primary"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-text-main">
              <input type="checkbox" className="rounded border-border-custom text-primary focus:ring-primary" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" title="Feature coming soon" className="text-primary font-medium hover:underline">Forgot Password?</a>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/15 text-rose-500 rounded-lg text-sm text-center border border-rose-500/30">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="bg-primary text-white p-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-text-muted text-[0.75rem]">
          <Shield size={16} />
          <span>Protected by CampusOne Security</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
