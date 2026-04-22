import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { verify } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verify(token);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="glass-panel p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#00A5EC] rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm mb-8">
          We've sent a 6-digit verification code to your email. Please enter it below.
        </p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm font-medium border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="text" 
              className="w-full text-center text-2xl tracking-widest bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC]" 
              value={token} 
              onChange={e => setToken(e.target.value)} 
              placeholder="000000"
              maxLength="6"
              required 
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
}
