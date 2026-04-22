import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSavedProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingProfile(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_skills: [] })
        });
        
        if (res.ok) {
          const data = await res.json();
          // If backend generated recommendations, it means user has saved skills!
          // We can't know the exact skills from this response easily, but the recommendations are personalized.
          // Wait, the backend currently doesn't return the extracted user_skills in the response.
          // Let's just navigate with an empty skills array or a placeholder so Results page doesn't crash.
          navigate('/results', { state: { results: data, skills: ['Saved Profile Skills'] } });
        } else {
          // If 400, it means no skills saved. Just show upload screen.
          setCheckingProfile(false);
        }
      } catch (err) {
        setCheckingProfile(false);
      }
    };
    checkSavedProfile();
  }, [navigate]);

  if (checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const processResume = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Upload CV
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/cvupload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error('Failed to process resume');
      const uploadData = await uploadRes.json();
      const userSkills = uploadData.skills;

      // 2. Get Recommendations
      const recRes = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_skills: userSkills })
      });
      
      if (!recRes.ok) throw new Error('Failed to fetch recommendations');
      const recData = await recRes.json();
      
      // 3. Navigate to results
      navigate('/results', { state: { results: recData, skills: userSkills } });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem('token');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      {!token ? (
        <div className="w-full mt-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            V2.0 is now live in production
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-white">
            Find the perfect <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">
              startup internship.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload your resume and let our AI engine match you with real-time, high-growth PM and Tech opportunities that fit your exact skill set.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/register')} className="btn-primary flex items-center gap-2">
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button onClick={() => navigate('/internships')} className="btn-secondary">
              Browse Jobs
            </button>
          </div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-6">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">AI Resume Parsing</h3>
              <p className="text-neutral-400 text-sm">We automatically extract your key PM skills and map them against live job requirements.</p>
            </div>
            <div className="glass-panel p-8 border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Scraping</h3>
              <p className="text-neutral-400 text-sm">Our platform scours the web every midnight to find the newest internship postings before anyone else.</p>
            </div>
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-6">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Application Tracking</h3>
              <p className="text-neutral-400 text-sm">Save your favorite internships and manage your application pipeline in a unified dashboard.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl mt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Initialize your Profile</h2>
            <p className="text-neutral-400">Upload your PDF resume to extract your skills and generate personalized matches.</p>
          </div>
          <div 
            className={`glass-panel p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 rounded-[2rem] cursor-pointer
              ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02]' : 'border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/30'}
              ${file ? 'border-white/20 bg-white/5' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept=".pdf" 
              className="hidden" 
            />
            
            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-6 border border-neutral-800">
              <svg className={`w-8 h-8 ${file ? 'text-white' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {file ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                )}
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              {file ? file.name : "Select your Resume"}
            </h3>
            <p className="text-neutral-500 text-sm text-center mb-8">
              {file ? "Ready to analyze your skills" : "Drag & drop your PDF here or click to browse"}
            </p>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                processResume();
              }}
              disabled={!file || loading}
              className={`w-full max-w-xs py-3 rounded-xl font-medium text-sm transition-all duration-300 flex justify-center items-center gap-2
                ${!file ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 
                  'bg-white text-black hover:bg-neutral-200 transform hover:-translate-y-0.5 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing PDF...
                </>
              ) : "Analyze Profile"}
            </button>
            
            {error && (
              <p className="mt-4 text-red-400 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
