import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await register(email, password);
      setSuccess(res.message);
      // We don't automatically login because they need to verify email
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700 glass">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-6 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2">Check your email!</h3>
            <p className="text-sm">{success}</p>
            <Link to="/login" className="inline-block mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                required
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                required
                minLength="6"
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
