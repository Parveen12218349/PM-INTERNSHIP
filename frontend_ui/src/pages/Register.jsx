import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(email, password);
      navigate('/verify-email');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="glass-panel p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded bg-[#00A5EC] flex items-center justify-center text-white font-bold mx-auto mb-4">
            IM
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-sm text-gray-500">Join to unlock AI matching and tracking.</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm font-medium border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" 
              value={email} onChange={e => setEmail(e.target.value)} required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" 
              value={password} onChange={e => setPassword(e.target.value)} required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3 mt-4">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-[#00A5EC] hover:text-[#008bc7] font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
