import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillRadarChart from '../components/SkillRadarChart';
import { ChevronLeft, AlertTriangle, ExternalLink, CheckCircle2, XCircle, Building2, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Results() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState(location.state?.results || { fallback: false, recommendations: [] });
  
  if (!location.state || !location.state.results) {
    return <Navigate to="/" replace />;
  }

  const { skills: userSkills } = location.state;
  const { fallback, recommendations } = currentData;

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          user_skills: userSkills,
          search_query: searchQuery,
          min_match: minMatch
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, minMatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Discovery Feed
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Based on <span className="text-[#00A5EC] font-bold">{userSkills.length}</span> extracted skills.
          </p>
        </div>
        <Link to="/" className="btn-secondary flex items-center gap-2 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Update Profile
        </Link>
      </div>

      <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center bg-white border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={minMatch}
            onChange={(e) => setMinMatch(parseFloat(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:border-[#00A5EC] focus:ring-1 focus:ring-[#00A5EC] appearance-none cursor-pointer"
          >
            <option value={0}>All Matches</option>
            <option value={0.3}>Moderate+ (30%+)</option>
            <option value={0.6}>Strong Only (60%+)</option>
          </select>
        </div>
      </div>

      {fallback && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 flex gap-4 items-start shadow-sm"
        >
          <div className="bg-orange-100 p-2 rounded-full text-orange-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-orange-800 font-bold text-lg mb-1">Calibration Notice</h3>
            <p className="text-orange-700 text-sm leading-relaxed">
              We couldn't find a strong match for your current skill set. We are displaying trending PM internships instead. Review the "Gap Analysis" section to see what skills employers are looking for.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sticky top-24"
          >
            <h3 className="text-lg font-bold mb-1 text-gray-900">Your Matrix</h3>
            <p className="text-xs text-gray-500 mb-6">Skill alignment graph.</p>
            
            <SkillRadarChart userSkills={userSkills} />

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Extracted Tags</h4>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-[11px] font-semibold text-[#00A5EC]">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic">No specific skills detected.</p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
             <div className="glass-panel p-16 text-center text-gray-500">Searching...</div>
          ) : recommendations.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
             {recommendations.map((job, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="glass-panel glass-panel-hover p-6 group relative"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#00A5EC] transition-colors tracking-tight">
                          {job.title}
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${job.score >= 0.6 ? 'text-green-600' : job.score >= 0.3 ? 'text-blue-600' : 'text-orange-500'}`}>
                          {Math.round(job.score * 100)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400">Match</div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-100 relative">
                         <svg className="w-10 h-10 -rotate-90 absolute top-[-2px] left-[-2px]">
                           <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-100" />
                           <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" 
                             className={job.score >= 0.6 ? 'text-green-500' : job.score >= 0.3 ? 'text-[#00A5EC]' : 'text-orange-400'}
                             strokeDasharray="113" strokeDashoffset={113 - (113 * job.score)}
                           />
                         </svg>
                      </div>
                    </div>
                  </div>

                  <div className="my-6">
                    <h4 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Required Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.job_skills.length > 0 ? job.job_skills.map(skill => {
                        const hasSkill = userSkills.includes(skill);
                        return (
                          <span key={skill} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5
                            ${hasSkill ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}
                          `}>
                            {hasSkill ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-gray-400" />}
                            {skill}
                          </span>
                        )
                      }) : <span className="text-gray-400 text-xs">Unspecified stack</span>}
                    </div>
                  </div>

                  {job.missing_skills.length > 0 && (
                    <div className="mb-6 p-3 bg-orange-50/50 rounded-lg border border-orange-100 flex gap-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Gap Analysis</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {job.missing_skills.map(skill => (
                            <span key={skill} className="text-[10px] px-2 py-0.5 bg-white text-orange-600 border border-orange-200 rounded shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert("Please log in to save internships.");
                          return;
                        }
                        try {
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ internship_id: job.id })
                          });
                          if (res.ok) {
                            alert("Internship saved to your Tracker.");
                          } else {
                            const data = await res.json();
                            alert(data.detail || "Failed to save internship.");
                          }
                        } catch (err) {
                          alert("Network error.");
                        }
                      }}
                      className="btn-secondary">
                      Track
                    </button>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" 
                       className="btn-primary flex items-center gap-2 group/btn">
                      Apply Now
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-16 text-center flex flex-col items-center"
            >
              <AlertTriangle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-xl text-gray-500 font-medium">No results found.</p>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}