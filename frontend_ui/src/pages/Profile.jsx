import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Settings, Briefcase, Phone, GraduationCap, 
  MapPin, CheckCircle2, AlertCircle, UploadCloud, Plus, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    college: '',
    location: '',
    degree: '',
    skills: [],
    resumeUrl: ''
  });

  // Calculate Completion Percentage
  const calculateCompletion = () => {
    const fields = ['fullName', 'phone', 'college', 'location', 'degree'];
    let filled = fields.filter(f => profile[f].length > 0).length;
    if (profile.skills.length > 0) filled += 1;
    if (profile.resumeUrl) filled += 1;
    
    return Math.round((filled / (fields.length + 2)) * 100);
  };

  const completion = calculateCompletion();

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cvupload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Auto-fill skills
        setProfile(prev => ({
          ...prev,
          skills: [...new Set([...prev.skills, ...data.skills])],
          resumeUrl: 'Uploaded'
        }));
        alert('AI successfully extracted skills from your resume!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Session Expired</h2>
          <p className="text-gray-500 mb-6">Please log in to manage your profile.</p>
          <Link to="/login" className="btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Header with Progress Bar */}
      <div className="glass-panel p-8 mb-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <User className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100">
                <CheckCircle2 className={`w-5 h-5 ${completion === 100 ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Complete Your Profile</h1>
              <p className="text-gray-500 text-sm">Boost your matching score by completing your details.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-4xl font-black text-blue-600 mb-1">{completion}%</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Strength</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 bg-white border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="fullName" value={profile.fullName} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm" 
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="phone" value={profile.phone} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm" 
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">College / Institution</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="college" value={profile.college} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm" 
                    placeholder="University Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="location" value={profile.location} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm" 
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
              <button className="btn-primary px-8">Save Profile</button>
            </div>
          </div>

          {/* Skills Management */}
          <div className="glass-panel p-8 bg-white border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Skill Inventory
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-medium uppercase tracking-wide">Add skills manually or extract from your CV</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 group">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3"/></button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="Add skill..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-500 w-24"
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Auto-fill & Actions */}
        <div className="space-y-6">
          <div className="glass-panel p-8 bg-blue-600 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
              <UploadCloud className="w-24 h-24" />
            </div>
            
            <h3 className="text-xl font-bold mb-2 relative z-10">AI Auto-Fill</h3>
            <p className="text-blue-100 text-sm mb-8 relative z-10">Upload your CV to automatically fill your skills and details using AI.</p>
            
            <input 
              type="file" ref={fileInputRef} className="hidden" 
              accept=".pdf" onChange={handleCVUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  AI Processing...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Quick Fill with CV
                </>
              )}
            </button>
          </div>

          <div className="glass-panel p-6 bg-white border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Account Settings</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email Address</div>
                <div className="text-sm font-semibold text-gray-700 truncate">{user.email}</div>
              </div>
              <button onClick={logout} className="w-full p-3 text-left text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between">
                Logout
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
