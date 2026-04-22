import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Building2, Calendar, Trash2, Clock, CheckCircle2, AlertTriangle, XCircle, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this application?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(applications.filter(a => a.application_id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(applications.map(a => 
          a.application_id === id ? { ...a, status: newStatus } : a
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'saved': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'applied': return 'bg-blue-50 text-[#00A5EC] border-blue-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'saved': return <Clock className="w-4 h-4" />;
      case 'applied': return <ExternalLink className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const statuses = ['saved', 'applied', 'pending', 'approved', 'rejected'];

  if (loading) {
    return <div className="p-20 text-center text-gray-500">Loading your applications...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Application Tracker</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage and track your internship pipeline.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <Link to="/internships" className="btn-primary text-sm px-4 py-2">
            Find More
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your pipeline is empty</h3>
          <p className="text-gray-500 mb-6">Start exploring internships and save them to track your progress.</p>
          <Link to="/internships" className="btn-primary">Explore Internships</Link>
        </div>
      ) : (
        viewMode === 'list' ? (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role & Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{app.title}</div>
                          <div className="text-sm text-gray-500">{app.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none appearance-none cursor-pointer uppercase tracking-wider ${getStatusColor(app.status)}`}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-[#00A5EC] hover:text-[#008bc7] text-sm font-semibold inline-flex items-center gap-1">
                        Apply
                      </a>
                      <button onClick={() => handleDelete(app.application_id)} className="text-red-500 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {statuses.map(status => (
              <div key={status} className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm flex items-center gap-2">
                    {getStatusIcon(status)}
                    {status}
                  </h3>
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {applications.filter(a => a.status === status).length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {applications.filter(a => a.status === status).map(app => (
                    <div key={app.application_id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-gray-900 leading-tight">{app.title}</div>
                        <button onClick={() => handleDelete(app.application_id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">{app.company}</div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <select 
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                          className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-[#00A5EC] cursor-pointer capitalize"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        
                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 text-[#00A5EC] flex items-center justify-center hover:bg-[#00A5EC] hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
