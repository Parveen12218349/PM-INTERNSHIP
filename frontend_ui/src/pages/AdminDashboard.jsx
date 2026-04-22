import { useState, useEffect } from 'react';
import { ShieldAlert, Database, Users, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runScraper = async () => {
    setScraping(true);
    setScrapeResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/scrape`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setScrapeResult({ success: true, message: data.message });
        fetchStats(); // refresh counts
      } else {
        setScrapeResult({ success: false, message: data.detail });
      }
    } catch (err) {
      setScrapeResult({ success: false, message: "Network error occurred." });
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-200 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Center</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage platform data, trigger scrapers, and view analytics.</p>
        </div>
        <button onClick={fetchStats} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 border-t-4 border-t-[#00A5EC]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#00A5EC]" />
                <h3 className="text-xl font-bold text-gray-900">Internship Database</h3>
              </div>
              <span className="bg-blue-50 text-[#00A5EC] px-3 py-1 rounded-full text-sm font-bold">
                {stats.total_internships} Live
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              The database stores scraped internship opportunities. You can manually trigger the scraper to fetch fresh data.
            </p>
            
            <button 
              onClick={runScraper} 
              disabled={scraping}
              className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all ${scraping ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'btn-primary'}`}
            >
              {scraping ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Scraper (This takes a few minutes)...
                </>
              ) : (
                "Trigger Manual Scrape Now"
              )}
            </button>
            
            {scrapeResult && (
              <div className={`mt-4 p-4 rounded-lg border text-sm font-medium ${scrapeResult.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {scrapeResult.message}
              </div>
            )}
          </div>

          <div className="glass-panel p-6 border-t-4 border-t-purple-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900">Platform Users</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Users</div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.total_users}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Applications</div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.total_applications}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#00A5EC] animate-spin" />
          <span className="text-gray-500 font-medium">Loading analytics...</span>
        </div>
      )}
    </div>
  );
}
