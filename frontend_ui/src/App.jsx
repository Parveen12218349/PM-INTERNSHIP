import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Categories from './pages/Categories';
import CategoryInternships from './pages/CategoryInternships';

function App() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/50">
              IM
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              InternMatch
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/internships" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
              Browse Internships
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/internships" element={<Categories />} />
          <Route path="/internships/:category" element={<CategoryInternships />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;