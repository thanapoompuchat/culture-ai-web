"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CheckPage() {
  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [country, setCountry] = useState("Thailand");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ⚠️⚠️ แก้ตรงนี้! เอา Link Render (Python) มาใส่ (ห้ามมี / ปิดท้าย) ⚠️⚠️
  // เช่น: const API_URL = "https://culture-ai-backend-xxxx.onrender.com";
  const API_URL = "https://culture-api-final.onrender.com"; 

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return alert("Please select an image first!");
    // เช็คว่า User แก้ Link หรือยัง
    if (API_URL.includes("ใส่_LINK")) return alert("พี่ลืมใส่ Link Render ในโค้ดครับ!");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("country", country);

    try {
      const res = await fetch(`${API_URL}/analyze-json`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing image. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto mb-10 relative z-10">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition cursor-pointer">
          CULTURE<span className="text-teal-400">AI</span>
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* --- LEFT: UPLOAD SECTION --- */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Upload Design</h1>
            <p className="text-neutral-400">Select target culture and upload UI image.</p>
          </div>

          <div className="space-y-4 bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800">
            <div>
              <label className="block text-xs font-bold text-teal-400 mb-2 uppercase">Target Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-xl p-3 text-white focus:border-teal-400 focus:outline-none transition"
                placeholder="e.g. Thailand, Japan, USA"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-400 mb-2 uppercase">UI Image</label>
              <div className="relative border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition cursor-pointer group overflow-hidden">
                <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" />
                {previewUrl ? (
                   <div className="relative h-64 w-full rounded-lg">
                     <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                   </div>
                ) : (
                  <div className="text-neutral-500 group-hover:text-teal-200 transition py-10">
                    <span className="text-3xl block mb-2">📂</span>
                    <span className="text-sm">Click to upload or drag image here</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                loading 
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-teal-400 to-cyan-400 text-black hover:shadow-cyan-400/20 hover:scale-[1.02]"
              }`}
            >
              {loading ? "Analyzing..." : "Run Analysis 🚀"}
            </button>
          </div>
        </div>

        {/* --- RIGHT: RESULT SECTION --- */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            {result && (
              <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                result.score >= 80 ? "bg-green-500/20 border-green-500 text-green-400" :
                result.score >= 50 ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" :
                "bg-red-500/20 border-red-500 text-red-400"
              }`}>
                {result.culture_fit_level}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-32 bg-neutral-900 rounded-3xl"></div>
               <div className="h-20 bg-neutral-900 rounded-3xl"></div>
               <div className="h-48 bg-neutral-900 rounded-3xl"></div>
            </div>
          ) : result ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
              
              {/* Score */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 rounded-3xl border border-neutral-700 flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-sm">Culture Fit Score</p>
                  <h3 className="text-5xl font-bold text-white mt-1">{result.score}/100</h3>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-teal-500 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                  {result.score >= 80 ? "😍" : result.score >= 50 ? "🤔" : "😱"}
                </div>
              </div>

              {/* Issues / Suggestions */}
              <div className="bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800">
                <h3 className="text-teal-400 font-bold mb-4">✨ Suggestions</h3>
                <ul className="space-y-3">
                  {result.suggestions?.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-neutral-300">
                      <span className="text-cyan-400 mt-1">➔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-neutral-900/50 p-5 rounded-2xl border border-neutral-800">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Palette</h4>
                    <p className="text-sm text-neutral-300">{result.color_palette_analysis}</p>
                 </div>
                 <div className="bg-neutral-900/50 p-5 rounded-2xl border border-neutral-800">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Layout</h4>
                    <p className="text-sm text-neutral-300">{result.layout_analysis}</p>
                 </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20 p-10 min-h-[300px]">
              <span className="text-4xl mb-4 opacity-50">📡</span>
              <p>Waiting for data...</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}