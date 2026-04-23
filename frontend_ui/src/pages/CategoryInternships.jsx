import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Building2, LayoutGrid, ChevronLeft } from 'lucide-react';

export default function CategoryInternships() {
  const { category } = useParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default to explore-all if no category is provided
  const fetchCategory = category || 'explore-all';

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/internships/${fetchCategory}`);
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [fetchCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="text-gray-400 hover:text-[#00A5EC] transition-colors"><ChevronLeft className="w-5 h-5"/></Link>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
              {fetchCategory.replace('-', ' ')}
            </h1>
          </div>
          <p className="text-gray-500 font-medium">Browse raw, unfiltered postings directly from the scraper.</p>
        </div>
        
        {/* Simple mock tabs for Categories */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Link to="/internships/explore-all" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${fetchCategory === 'explore-all' ? 'bg-white shadow-sm text-[#00A5EC]' : 'text-gray-500 hover:text-gray-700'}`}>All Roles</Link>
          <Link to="/internships/government" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${fetchCategory === 'government' ? 'bg-white shadow-sm text-[#00A5EC]' : 'text-gray-500 hover:text-gray-700'}`}>Public Sector</Link>
          <Link to="/internships/manufacturing" className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${fetchCategory === 'manufacturing' ? 'bg-white shadow-sm text-[#00A5EC]' : 'text-gray-500 hover:text-gray-700'}`}>Manufacturing</Link>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-20 text-center flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#00A5EC] border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-500 font-medium">Loading opportunities...</span>
        </div>
      ) : internships.length === 0 ? (
        <div className="glass-panel p-16 text-center">
          <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No internships found</h3>
          <p className="text-gray-500">Check back later or try a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {internships.map((job, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              className="glass-panel glass-panel-hover p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{job.title}</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">{job.company}</p>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded font-semibold uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && <span className="text-[10px] px-2 py-1 text-gray-400 font-semibold uppercase tracking-wider">+{job.skills.length - 4} more</span>}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full btn-secondary flex justify-center items-center gap-2"
                >
                  Apply Externally
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
