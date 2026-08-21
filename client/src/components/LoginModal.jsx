import React, { useState, useEffect, useRef } from 'react';
import { XIcon, EyeIcon, EyeOffIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  // Reset form when modal opens/tab changes
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', password: '' });
      setShowPass(false);
      setLoading(false);
    }
  }, [isOpen, tab]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (tab === 'login') {
        data = await login(form.email, form.password);
      } else {
        if (!form.name.trim()) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        data = await register(form.name, form.email, form.password);
      }
      if (data.success) {
        toast.success(tab === 'login' ? 'Welcome back!' : 'Account created successfully!');
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(17,17,27,0.98) 0%, rgba(26,26,46,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
        }}
      >
        {/* Purple gradient top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <XIcon size={18} />
        </button>

        <div className="p-8">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              {tab === 'login'
                ? <LogInIcon size={24} className="text-white" />
                : <UserPlusIcon size={24} className="text-white" />
              }
            </div>
            <h2 className="text-2xl font-bold text-white">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {tab === 'login' ? 'Sign in to your CinK account' : 'Join CinK today'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  tab === t
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={tab === t ? {
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
                } : {}}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required={tab === 'register'}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPass ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#6d28d9' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              {loading
                ? (tab === 'login' ? 'Signing in...' : 'Creating account...')
                : (tab === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Switch tab hint */}
          <p className="text-center text-sm text-gray-500 mt-5">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {tab === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
