import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
      
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/cvupload`, {
        method: 'POST',
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Find Your Perfect <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Tech & Business
          </span> Internship
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and let our intelligent engine match you with real-time tech & business opportunities that fit your exact skill set.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <div 
          className={`glass-panel p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 rounded-3xl
            ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/80'}
            ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
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
          
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-inner">
            <svg className={`w-10 h-10 ${file ? 'text-green-400' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {file ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              )}
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {file ? file.name : "Upload your Resume"}
          </h3>
          <p className="text-slate-400 text-center mb-6">
            {file ? "Ready to analyze!" : "Drag & drop your PDF resume here or click to browse"}
          </p>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              processResume();
            }}
            disabled={!file || loading}
            className={`w-full max-w-xs py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex justify-center items-center gap-2
              ${!file ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' : 
                'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transform hover:-translate-y-1 hover:shadow-indigo-500/25'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Profile...
              </>
            ) : "Get Recommendations"}
          </button>
          
          {error && (
            <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
