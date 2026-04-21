import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillRadarChart from '../components/SkillRadarChart';
import { ChevronLeft, AlertTriangle, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

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
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Your Recommendations
          </h1>
          <p className="text-slate-400 font-medium">
            Based on <span className="text-indigo-400">{userSkills.length}</span> skills extracted from your resume.
          </p>
        </div>
        <Link to="/" className="btn-secondary text-sm flex items-center gap-2 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Upload New Resume
        </Link>
      </div>

      {fallback && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-10 flex gap-4 items-start shadow-lg shadow-amber-500/5 backdrop-blur-sm"
        >
          <div className="bg-amber-500/20 p-2 rounded-full text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-amber-400 font-semibold text-lg mb-1">Low Match Score Detected</h3>
            <p className="text-amber-200/80 leading-relaxed">
              We couldn't find a strong match for your current skill set. Don't worry! We are showing you the top trending PM internships. Check the <span className="font-semibold text-amber-100">"Skills to Learn"</span> section on these cards to see what you should focus on next.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: User Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 sticky top-24"
          >
            <h3 className="text-xl font-bold mb-2 text-white">Your Profile Mapping</h3>
            <p className="text-sm text-slate-400 mb-4 border-b border-slate-700/50 pb-4">
              How your resume aligns with key PM pillars.
            </p>
            
            <SkillRadarChart userSkills={userSkills} />

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Detected Skills</h4>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-full text-xs font-medium text-slate-300 hover:border-indigo-400 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No specific tech/PM skills detected.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Jobs List */}
        <div className="lg:col-span-2">
          {recommendations.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
             {recommendations.map((job, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="glass-panel p-8 hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
                        {job.title}
                      </h2>
                      <p className="text-lg text-slate-400 font-medium">{job.company}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg shrink-0 flex items-center justify-center
                      ${job.score >= 0.6 ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10' : 
                        job.score >= 0.3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/10' : 
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/10'}
                    `}>
                      {Math.round(job.score * 100)}% Match
                    </div>
                  </div>

                  <div className="my-6">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.job_skills.length > 0 ? job.job_skills.map(skill => {
                        const hasSkill = userSkills.includes(skill);
                        return (
                          <span key={skill} className={`px-3 py-1.5 rounded-md text-sm font-medium border flex items-center gap-1.5
                            ${hasSkill ? 'bg-green-500/10 text-green-300 border-green-500/30' : 'bg-slate-800/80 text-slate-400 border-slate-700'}
                          `}>
                            {hasSkill ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                            {skill}
                          </span>
                        )
                      }) : <span className="text-slate-500 text-sm italic">Skills not specified by employer.</span>}
                    </div>
                  </div>

                  {job.missing_skills.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-xl border border-slate-700/50 flex gap-3">
                      <div className="text-amber-500 mt-0.5">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-amber-400/90 mb-1">High-Impact Skills to Learn:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.missing_skills.map(skill => (
                            <span key={skill} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-200 border border-amber-500/20 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                    <a href={job.link} target="_blank" rel="noopener noreferrer" 
                       className="btn-primary inline-flex items-center gap-2 group/btn">
                      Apply Now
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
              <AlertTriangle className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-xl text-slate-400 font-medium">No recommendations available right now.</p>
              <p className="text-slate-500 mt-2">Please try uploading a different resume or check back later.</p>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}