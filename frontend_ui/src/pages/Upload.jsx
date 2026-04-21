import React, { useRef, useState } from "react";

function Upload() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/apply-now", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    localStorage.setItem("results", JSON.stringify(data));
    window.location.href = "/results";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl shadow-xl text-center w-[400px]">
        
        <h1 className="text-3xl font-bold text-white mb-6">
          🚀 Upload Your CV
        </h1>

        <button
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-lg text-white font-semibold"
        >
          Upload CV
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />

        {fileName && (
          <p className="text-gray-300 mt-4 text-sm">
            {fileName}
          </p>
        )}

        <p className="text-gray-500 mt-6 text-xs">
          Supported: PDF resumes
        </p>

      </div>
    </div>
  );
}

export default Upload;