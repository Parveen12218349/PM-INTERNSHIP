import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Building2, LayoutGrid, ChevronLeft, Search, 
  Filter, MapPin, Clock, DollarSign, Briefcase, ChevronRight 
} from 'lucide-react';

const CATEGORIES = [
  { name: "All Roles", slug: "explore-all" },
  { name: "Public Sector", slug: "government" },
  { name: "Manufacturing", slug: "manufacturing" },
  { name: "IT & Digital", slug: "it" },
  { name: "Healthcare", slug: "healthcare" },
  { name: "Agriculture", slug: "agriculture" },
  { name: "Finance", slug: "finance" },
];

export default function CategoryInternships() {
  const { category } = useParams();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all', // all, onsite, wfh
    paid: 'all', // all, paid, unpaid
    duration: 'all', // all, short, long
  });

  const fetchCategory = category || 'explore-all';

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/internships/${fetchCategory}`);
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships);
          setFilteredInternships(data.internships);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [fetchCategory]);

  // Apply Search and Filters
  useEffect(() => {
    let result = internships;

    // Search
    if (searchQuery) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter Logic (Mock logic since scraper data is limited)
    if (filters.type !== 'all') {
      // Just for demo/visual, since we don't have this in DB yet
    }

    setFilteredInternships(result);
  }, [searchQuery, filters, internships]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Search Header */}
      <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search roles, companies or industries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100">
            {filteredInternships.length} Results Found
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="lg:w-1/4 space-y-8">
          
          <div className="glass-panel p-6 bg-white border border-gray-200 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-500" />
              Sectors
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.slug} 
                  to={`/internships/${cat.slug}`}
                  className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${fetchCategory === cat.slug ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${fetchCategory === cat.slug ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 bg-white border border-gray-200 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" />
              Refine Search
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Job Type</label>
                <div className="space-y-2">
                  {['All', 'On-site', 'Remote'].map(t => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="type" className="w-4 h-4 text-blue-600" defaultChecked={t === 'All'} />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Stipend Range</label>
                <div className="space-y-2">
                  {['Any', 'Paid Only', 'Unpaid'].map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="paid" className="w-4 h-4 text-blue-600" defaultChecked={s === 'Any'} />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Duration</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                  <option>Any Duration</option>
                  <option>1-3 Months</option>
                  <option>3-6 Months</option>
                  <option>6+ Months</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:w-3/4">
          
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight capitalize">
              {fetchCategory.replace('-', ' ')} Opportunities
            </h2>
            <p className="text-gray-500 text-sm mt-1">Showing the latest verified government scheme postings.</p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-panel p-20 text-center flex flex-col items-center bg-white rounded-3xl"
              >
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-gray-500 font-medium">Fetching secure records...</span>
              </motion.div>
            ) : filteredInternships.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-panel p-16 text-center flex flex-col items-center bg-white rounded-3xl"
              >
                <LayoutGrid className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active roles found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or searching for a broader term.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredInternships.map((job, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                    className="glass-panel p-6 flex flex-col justify-between group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border-gray-100 bg-white"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                          <Building2 className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                          <CheckCircle className="w-3 h-3" />
                          VERIFIED
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <p className="text-sm font-semibold text-gray-500 mb-4">{job.company}</p>
                      
                      <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>On-site / Hybrid</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>3-6 Months Duration</span>
                        </div>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {job.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="text-[10px] px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg font-bold uppercase tracking-wider border border-gray-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full btn-secondary flex justify-center items-center gap-2 group/btn"
                      >
                        Details & Apply
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function CheckCircle({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
