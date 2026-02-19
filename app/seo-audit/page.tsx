"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, CheckCircle2, AlertTriangle, Globe, BarChart3, Zap } from "lucide-react";

// Component การ์ดสำหรับแสดงผล
const ResultCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm ${className}`}>
    <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
      {title}
    </h3>
    {children}
  </div>
);

export default function SEOAuditPage() {
  // --- STATE ---
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState("Thailand");
  const [keyword, setKeyword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // --- FUNCTION: เรียก API ---
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!url) return;

    setLoading(true);
    setResult(null);

    try {
      // ✅ เรียกไปที่ /api/audit ตามที่คุณต้องการ
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, targetCountry: country, keyword })
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data);
      } else {
        alert("Error: " + (data.error || "Failed to analyze"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative selection:bg-teal-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header / Nav Back */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Content <span className="text-teal-400">Audit</span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Input Form --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 shadow-2xl sticky top-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Globe size={20} className="text-cyan-400"/> Target Settings
            </h2>
            
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="text-xs text-neutral-400 ml-1 mb-1 block">Target URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com" 
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors placeholder:text-neutral-600"
                />
              </div>

              {/* Country & Keyword */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 ml-1 mb-1 block">Target Country</label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Thailand">🇹🇭 Thailand</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="USA">🇺🇸 USA</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="Vietnam">🇻🇳 Vietnam</option>
                    <option value="Indonesia">🇮🇩 Indonesia</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 ml-1 mb-1 block">Main Keyword</label>
                  <input 
                    type="text" 
                    placeholder="(Optional)" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-bold text-lg py-4 rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="black" />}
                {loading ? "Analyzing..." : "Start Audit"}
              </button>
            </form>
            
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Uses GPT-4o for deep cultural context analysis.
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Results Dashboard --- */}
        <div className="lg:col-span-8">
          
          {/* STATE 1: Empty (ยังไม่ทำรายการ) */}
          {!loading && !result && (
             <div className="h-full flex flex-col items-center justify-center text-neutral-600 border border-dashed border-neutral-800 rounded-3xl min-h-[400px] bg-neutral-900/20">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready to Audit</p>
                <p className="text-sm">Enter a URL to analyze cultural fit & SEO.</p>
             </div>
          )}

          {/* STATE 2: Loading (กำลังโหลด) */}
          {loading && (
            <div className="space-y-4 animate-pulse">
               <div className="h-32 bg-neutral-900 rounded-3xl w-full border border-neutral-800"></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-neutral-900 rounded-3xl border border-neutral-800"></div>
                  <div className="h-40 bg-neutral-900 rounded-3xl border border-neutral-800"></div>
               </div>
               <div className="h-60 bg-neutral-900 rounded-3xl w-full border border-neutral-800"></div>
            </div>
          )}

          {/* STATE 3: Success Result (แสดงผล) */}
          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Header Score Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Overall Score */}
                 <ResultCard title="Overall Score" className="bg-gradient-to-br from-neutral-900 to-black md:col-span-2 flex flex-row items-center justify-between border-teal-900/30">
                    <div>
                      <div className="text-5xl font-black text-white tracking-tighter mb-1">
                        {result.analysis.overallScore}
                        <span className="text-lg text-neutral-500 font-medium">/100</span>
                      </div>
                      <p className="text-sm text-neutral-400 max-w-[200px]">{result.analysis.summary}</p>
                    </div>
                    {/* Graph Circular */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90 overflow-visible">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-800" />
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" strokeDasharray={`${result.analysis.overallScore * 2.51} 251`} strokeLinecap="round" />
                       </svg>
                    </div>
                 </ResultCard>

                 {/* Cultural Fit Score */}
                 <ResultCard title="Cultural Fit" className="bg-neutral-900 flex flex-col justify-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">{result.analysis.culturalFitScore}%</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-white font-bold bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                         {country} Match
                      </div>
                    </div>
                 </ResultCard>
              </div>

              {/* Cultural Insights (The Selling Point) */}
              <ResultCard title={`Cultural Insights for ${country}`} className="border-teal-500/20 bg-teal-950/10">
                <div className="space-y-3">
                  {result.analysis.culturalInsights.map((insight: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start p-3 bg-teal-900/20 border border-teal-500/10 rounded-lg">
                      <Globe className="text-teal-400 shrink-0 mt-0.5" size={16} />
                      <p className="text-sm text-teal-100 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>

              {/* Good Points vs Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="What You Did Well">
                   <ul className="space-y-3">
                      {result.analysis.goodPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                          <div className="mt-0.5 p-1 rounded-full bg-green-500/10 text-green-500">
                            <CheckCircle2 size={14} />
                          </div> 
                          {point}
                        </li>
                      ))}
                   </ul>
                </ResultCard>

                <ResultCard title="Needs Improvement">
                   <ul className="space-y-3">
                      {result.analysis.improvements.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                           <div className="mt-0.5 p-1 rounded-full bg-amber-500/10 text-amber-500">
                            <AlertTriangle size={14} />
                          </div>
                          {point}
                        </li>
                      ))}
                   </ul>
                </ResultCard>
              </div>

              {/* Technical Data (Scraped Info) */}
              <div className="bg-black/40 border border-neutral-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                    <Search size={14}/> Scraped Metadata
                  </h4>
                  <div className="grid gap-3 text-xs font-mono text-neutral-400 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/50">
                     <p className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="text-cyan-600 font-bold min-w-[50px]">TITLE:</span> 
                        <span className="text-white">{result.scrapedData.title || "No Title Found"}</span>
                     </p>
                     <div className="h-px bg-neutral-800/50 w-full" />
                     <p className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="text-cyan-600 font-bold min-w-[50px]">H1:</span> 
                        <span className="text-white">{result.scrapedData.h1 || "No H1 Found"}</span>
                     </p>
                     <div className="h-px bg-neutral-800/50 w-full" />
                     <p className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="text-cyan-600 font-bold min-w-[50px]">DESC:</span> 
                        <span className="text-white truncate block">{result.scrapedData.description || "No Description Found"}</span>
                     </p>
                  </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}