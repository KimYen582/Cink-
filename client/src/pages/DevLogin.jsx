import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const DevLogin = () => {
  const [email, setEmail] = useState('admin@cin.com');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email });

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        
        // Redirect to admin or previous page
        const from = location.state?.from?.pathname || '/admin';
        navigate(from);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login error: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">Dev Login</h1>
        <p className="text-gray-400 mb-6">Email-based login for development</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cin.com"
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p className="text-xs text-gray-400 mt-2">Try: admin@cin.com, nguyenvana@example.com, tranthib@example.com, lehoangc@example.com</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DevLogin;
