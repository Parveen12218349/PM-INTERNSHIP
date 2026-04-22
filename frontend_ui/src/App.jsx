import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import MyApplications from './pages/MyApplications';
import CategoryInternships from './pages/CategoryInternships';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import { UserCircle } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#00A5EC] flex items-center justify-center text-white font-bold">
                  IM
                </div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                  InternMatch
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">Home</Link>
                <Link to="/internships" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">Internships</Link>
                <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">About</Link>
                <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">Contact</Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded uppercase tracking-wider transition-colors">
                  Admin
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <Link to="/my-applications" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#00A5EC] transition-colors">
                    <UserCircle className="w-5 h-5 text-gray-400" />
                    {user.email.split('@')[0]}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#00A5EC] transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/results" element={<Results />} />
          <Route path="/internships/:category?" element={<CategoryInternships />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/my-applications" element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;