import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Home() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSavedProfile = async () => {
      const token = localStorage.getItem('token');
      
      // Bypass auto-redirect if user explicitly wants to update resume
      if (!token || searchParams.get('update') === 'true') {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
              Launch your career in <span className="text-[#00A5EC]">Tech & Product.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We instantly map your resume skills to hundreds of verified, high-growth startup internships. Stop guessing, start applying.
            </p>
            {!token && (
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/register')} className="btn-primary text-base px-8 py-3">
                  Register for Free
                </button>
                <button onClick={() => navigate('/internships')} className="btn-secondary text-base px-8 py-3">
                  View Internships
                </button>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex justify-center">
            {/* Visual Placeholder for a generated Hero Graphic */}
            <div className="relative w-full max-w-md aspect-square bg-blue-50 rounded-full flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-50"></div>
              <div className="glass-panel p-6 shadow-xl relative z-10 w-full transform hover:-translate-y-2 transition-transform duration-500">
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-1/2 bg-gray-100 rounded mb-8"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><span className="text-green-600 text-xs font-bold">95%</span></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-blue-600 text-xs font-bold">82%</span></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Upload Section (For Logged In Users) */}
      {token && (
        <div className="bg-gray-50 py-20 flex-grow">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Initialize your Profile</h2>
              <p className="text-gray-600">Upload your PDF resume to extract your skills and generate personalized matches.</p>
            </div>
            
            <div 
              className={`glass-panel p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 rounded-2xl cursor-pointer
                ${isDragging ? 'border-[#00A5EC] bg-blue-50/50 scale-[1.02]' : 'border-gray-300 hover:border-[#00A5EC] hover:bg-gray-50'}
                ${file ? 'border-green-400 bg-green-50/30' : ''}`}
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
              
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <svg className={`w-8 h-8 ${file ? 'text-green-500' : 'text-[#00A5EC]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {file ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  )}
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {file ? file.name : "Select your Resume"}
              </h3>
              <p className="text-gray-500 text-sm text-center mb-8">
                {file ? "Ready to analyze your skills" : "Drag & drop your PDF here or click to browse"}
              </p>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  processResume();
                }}
                disabled={!file || loading}
                className={`w-full max-w-xs py-3 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2
                  ${!file ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'btn-primary'}
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing PDF...
                  </>
                ) : "Analyze Profile"}
              </button>
              
              {error && (
                <p className="mt-4 text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-100">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
