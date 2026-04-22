import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (appId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(applications.filter(a => a.application_id !== appId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-400">Loading your applications...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          My Applications
        </h1>
        <p className="text-slate-400 font-medium">Track your saved internships and application statuses.</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center">
          <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
          <h2 className="text-xl text-slate-300 font-bold mb-2">No saved applications</h2>
          <p className="text-slate-500 mb-6">You haven't saved any internships yet. Upload your resume to find matches!</p>
          <Link to="/" className="btn-primary">Find Internships</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <motion.div 
              key={app.application_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-6 group"
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                  {app.title}
                </h2>
                <p className="text-slate-400 font-medium">{app.company}</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {app.status}
                  </span>
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs">
                    Saved on {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => handleDelete(app.application_id)}
                  className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <a href={app.link} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                  Apply Link
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
