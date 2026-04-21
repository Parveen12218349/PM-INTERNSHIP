import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ExternalLink, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';

export default function CategoryInternships() {
  const { category } = useParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to format slug to title
  const formatTitle = (slug) => {
    if (slug === 'explore-all') return 'All Internships';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/internships/${category}`);
        if (!res.ok) throw new Error("Failed to fetch internships");
        const data = await res.json();
        setInternships(data.internships || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <Link to="/internships" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 mb-4 group w-fit">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Link>
          <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {formatTitle(category)} Roles
          </h1>
          <p className="text-slate-400 font-medium">
            Live opportunities fetched directly from the source.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-8 animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-slate-700/30 rounded w-1/4 mb-6"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-8 bg-slate-700/40 rounded w-20"></div>
                <div className="h-8 bg-slate-700/40 rounded w-24"></div>
                <div className="h-8 bg-slate-700/40 rounded w-16"></div>
              </div>
              <div className="h-12 bg-slate-700/50 rounded w-32 ml-auto"></div>
            </div>
          ))}
        </div>
      ) : internships.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {internships.map((job, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-panel p-8 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-4 text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> {job.company}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Inferred Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills && job.skills.length > 0 ? job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-md text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      {skill}
                    </span>
                  )) : (
                    <span className="text-slate-500 text-sm italic">Generic skills applied</span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/50 flex justify-end">
                <a href={job.link} target="_blank" rel="noopener noreferrer" 
                   className="btn-primary inline-flex items-center gap-2 group/btn">
                  View on Internshala
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-panel p-16 text-center">
          <p className="text-xl text-slate-400 font-medium">No internships found for this category right now.</p>
        </div>
      )}
    </div>
  );
}
