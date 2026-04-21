import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Code2, Megaphone, PenTool, Briefcase, Compass } from 'lucide-react';

export default function Categories() {
  const categories = [
    { name: "Data Science", slug: "data-science", icon: <Database className="w-8 h-8" />, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
    { name: "Software Engineering", slug: "software-development", icon: <Code2 className="w-8 h-8" />, color: "from-green-500 to-emerald-500", shadow: "shadow-green-500/20" },
    { name: "Marketing", slug: "marketing", icon: <Megaphone className="w-8 h-8" />, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20" },
    { name: "UI/UX Design", slug: "ui-ux-design", icon: <PenTool className="w-8 h-8" />, color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20" },
    { name: "Product Management", slug: "product-management", icon: <Briefcase className="w-8 h-8" />, color: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-500/20" },
    { name: "Explore All", slug: "explore-all", icon: <Compass className="w-8 h-8" />, color: "from-slate-400 to-slate-600", shadow: "shadow-slate-500/20" },
  ];

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
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
        >
          Browse Open Internships
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Select a category to see live opportunities fetched directly from our scraping engine.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat) => (
          <motion.div key={cat.slug} variants={itemVariants}>
            <Link to={`/internships/${cat.slug}`} className="block h-full">
              <div className={`glass-panel p-8 h-full hover:-translate-y-2 transition-all duration-300 group hover:shadow-2xl ${cat.shadow} hover:border-slate-500/50 flex flex-col items-center justify-center text-center gap-4`}>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-sm font-medium text-slate-400 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  View Roles
                  <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
