import { useAuth } from '../context/AuthContext';
import { User, Mail, Settings, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="p-20 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 text-center">
            <div className="w-24 h-24 bg-blue-100 text-[#00A5EC] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 truncate">{user.email.split('@')[0]}</h2>
            <p className="text-sm text-gray-500 mb-6 truncate">{user.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
              Verified Account
            </div>
          </div>

          <div className="glass-panel p-4 flex flex-col gap-2">
            <Link to="/my-applications" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              <Briefcase className="w-5 h-5 text-gray-400" />
              My Applications
            </Link>
            <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-left">
              <Settings className="w-5 h-5 text-red-400" />
              Logout
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <div className="text-gray-900 font-medium capitalize bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Resume & Skills</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your skills are automatically extracted when you upload your resume on the Home page.
            </p>
            <Link to="/" className="btn-secondary inline-block">Update Resume</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
