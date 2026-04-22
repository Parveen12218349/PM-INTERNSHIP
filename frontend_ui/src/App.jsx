import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Results from './pages/Results';
import Categories from './pages/Categories';
import CategoryInternships from './pages/CategoryInternships';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/50">
              IM
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              InternMatch
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/internships" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
              Browse Internships
            </Link>
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded">
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 border-r border-slate-700 pr-4">
                  {user.email.split('@')[0]}
                  {user.role === 'admin' && <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>}
                </span>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)]">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/internships" element={<Categories />} />
          <Route path="/internships/:category" element={<CategoryInternships />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;