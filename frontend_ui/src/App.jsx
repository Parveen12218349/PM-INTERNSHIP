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
import MyApplications from './pages/MyApplications';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="glass-panel px-6 py-3 flex justify-between items-center bg-neutral-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">
              IM
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              InternMatch
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/internships" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Explore Jobs
            </Link>
            
            {user && (
              <Link to="/my-applications" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Applications
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Admin
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-700/50">
                <span className="text-sm text-neutral-300 font-medium">
                  {user.email.split('@')[0]}
                </span>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-neutral-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-neutral-700/50">
                <Link to="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/internships" element={<Categories />} />
          <Route path="/internships/:category" element={<CategoryInternships />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected Routes */}
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
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