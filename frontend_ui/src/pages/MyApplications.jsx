import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Briefcase, Building2, Clock } from 'lucide-react';
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
    return <div className="p-20 text-center text-neutral-500">Loading pipeline...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
            Pipeline
          </h1>
          <p className="text-neutral-400 text-sm">Track and manage your saved opportunities.</p>
        </div>
        <div className="text-sm font-semibold text-neutral-500 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
          {applications.length} Saved
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel p-20 text-center flex flex-col items-center">
          <Briefcase className="w-12 h-12 text-neutral-600 mb-4" />
          <h2 className="text-lg text-white font-bold mb-2">Your pipeline is empty</h2>
          <p className="text-neutral-500 text-sm mb-6">Discover matches to start building your application pipeline.</p>
          <Link to="/" className="btn-primary text-sm">Discover Jobs</Link>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4">
          {applications.map((app) => (
            <motion.div 
              key={app.application_id}
              variants={itemVariants}
              className="glass-panel glass-panel-hover p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">
                    {app.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-neutral-400 font-medium">{app.company}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t border-neutral-800 pt-4 sm:border-0 sm:pt-0 mt-2 sm:mt-0">
                <button 
                  onClick={() => handleDelete(app.application_id)}
                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Remove from Pipeline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <a href={app.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2 flex items-center gap-2 group/btn">
                  Apply Link
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
