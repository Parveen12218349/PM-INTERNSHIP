import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillRadarChart from '../components/SkillRadarChart';
import { ChevronLeft, AlertTriangle, ExternalLink, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  
  if (!location.state || !location.state.results) {
    return <Navigate to="/" replace />;
  }

  const { results, skills: userSkills } = location.state;
  const { fallback, recommendations } = results;

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
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-white tracking-tight">
            Discovery Feed
          </h1>
          <p className="text-neutral-400 font-medium">
            Based on <span className="text-white">{userSkills.length}</span> extracted skills.
          </p>
        </div>
        <Link to="/" className="btn-secondary text-sm flex items-center gap-2 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Update Profile
        </Link>
      </div>

      {fallback && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#2a1700] border border-orange-500/20 rounded-2xl p-6 mb-10 flex gap-4 items-start shadow-lg"
        >
          <div className="bg-orange-500/20 p-2 rounded-full text-orange-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-orange-400 font-semibold text-lg mb-1">Calibration Notice</h3>
            <p className="text-orange-200/70 text-sm leading-relaxed">
              We couldn't find a strong match for your current skill set. We are displaying the top trending PM internships instead. Review the "Skills to Learn" section to improve your match score.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Col: User Profile Summary */}
        <div className="xl:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sticky top-28"
          >
            <h3 className="text-lg font-bold mb-1 text-white">Your Matrix</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Skill alignment graph.
            </p>
            
            <SkillRadarChart userSkills={userSkills} />

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <h4 className="text-[10px] font-bold text-neutral-500 mb-3 uppercase tracking-widest">Extracted Tags</h4>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] font-medium text-neutral-300">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-xs italic">No specific skills detected.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Jobs List */}
        <div className="xl:col-span-3">
          {recommendations.length > 0 ? (
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
                  className="glass-panel glass-panel-hover p-6 group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-neutral-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                          {job.title}
                        </h2>
                        <p className="text-sm text-neutral-400 font-medium">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{Math.round(job.score * 100)}%</div>
                        <div className="text-[10px] uppercase tracking-widest text-neutral-500">Match</div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-neutral-800 relative">
                         {/* Simple visual indicator for match */}
                         <svg className="w-10 h-10 -rotate-90 absolute top-[-2px] left-[-2px]">
                           <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" className="text-neutral-800" />
                           <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" 
                             className={job.score >= 0.6 ? 'text-green-500' : job.score >= 0.3 ? 'text-indigo-500' : 'text-orange-500'}
                             strokeDasharray="113" strokeDashoffset={113 - (113 * job.score)}
                           />
                         </svg>
                      </div>
                    </div>
                  </div>

                  <div className="my-6">
                    <h4 className="text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">Required Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.job_skills.length > 0 ? job.job_skills.map(skill => {
                        const hasSkill = userSkills.includes(skill);
                        return (
                          <span key={skill} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5
                            ${hasSkill ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}
                          `}>
                            {hasSkill ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-neutral-600" />}
                            {skill}
                          </span>
                        )
                      }) : <span className="text-neutral-600 text-xs">Unspecified stack</span>}
                    </div>
                  </div>

                  {job.missing_skills.length > 0 && (
                    <div className="mb-6 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/80 flex gap-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-bold text-neutral-300 mb-1 uppercase tracking-wider">Gap Analysis</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {job.missing_skills.map(skill => (
                            <span key={skill} className="text-[10px] px-2 py-0.5 bg-[#2a1700] text-orange-400 border border-orange-500/20 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-end gap-3">
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
                            alert("Internship saved to your Dashboard.");
                          } else {
                            const data = await res.json();
                            alert(data.detail || "Failed to save internship.");
                          }
                        } catch (err) {
                          alert("Network error.");
                        }
                      }}
                      className="btn-secondary text-xs px-4 py-2">
                      Save
                    </button>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" 
                       className="btn-primary text-xs px-4 py-2 flex items-center gap-2 group/btn">
                      Apply
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
              <AlertTriangle className="w-12 h-12 text-neutral-600 mb-4" />
              <p className="text-xl text-neutral-400 font-medium">No results found.</p>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}