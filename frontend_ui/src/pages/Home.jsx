import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Target, Sparkles, Bot } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#00A5EC] font-semibold text-sm mb-6 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>V3 Now Live: AI-Powered Matches</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Unlock your future in <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A5EC] to-blue-600">
                  Tech & Product
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Stop applying blindly. Our AI instantly maps your resume to hundreds of high-growth startup internships with precise skill gap analysis.
              </p>
              
              {!token && (
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button onClick={() => navigate('/register')} className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40">
                    Get Started Free
                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                  <button onClick={() => navigate('/internships')} className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                    Explore Internships
                  </button>
                </div>
              )}

              <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Real-time Scraper</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>AI Skill Extraction</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 w-full relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              
              {/* Premium Dashboard Mockup */}
              <div className="glass-panel p-2 rounded-2xl shadow-2xl bg-white/50 backdrop-blur-sm border border-white/40 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                  <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto bg-white border border-gray-200 text-gray-400 text-xs px-24 py-1 rounded-md flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      internmatch.io/dashboard
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded-md mb-3"></div>
                        <div className="h-3 w-48 bg-gray-100 rounded-md"></div>
                      </div>
                      <div className="flex -space-x-2">
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">PM</div>
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">UX</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                        className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between group hover:border-[#00A5EC] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><TrendingUp className="w-5 h-5"/></div>
                          <div>
                            <div className="h-3 w-24 bg-gray-800 rounded mb-2"></div>
                            <div className="h-2 w-16 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">94% MATCH</span>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                        className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between group hover:border-[#00A5EC] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Users className="w-5 h-5"/></div>
                          <div>
                            <div className="h-3 w-32 bg-gray-800 rounded mb-2"></div>
                            <div className="h-2 w-20 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">88% MATCH</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      
      {/* Quick Features Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-50 text-[#00A5EC] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Precision Matching</h3>
              <p className="text-gray-500 text-sm">We don't just search keywords. We align your actual capabilities with required stacks.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Gap Analysis</h3>
              <p className="text-gray-500 text-sm">Discover exactly which skills you're missing and get direct links to upskill.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Interview Prep</h3>
              <p className="text-gray-500 text-sm">Practice with our AI assistant tailored specifically to product management roles.</p>
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
