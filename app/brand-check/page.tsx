"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Globe2, AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function BrandCheckPage() {
  const [brandName, setBrandName] = useState("");
  const [country, setCountry] = useState("China");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!brandName) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // ✅ เรียกไปที่ path มาตรฐาน (ต้องวางไฟล์ให้ถูกที่ app/api/analyze-brand/route.ts)
      const response = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName, country }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);

    } catch (error: any) {
      console.error(error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <nav className="flex justify-between items-center mb-12 max-w-5xl mx-auto z-10 relative">
        <Link href="/" className="text-neutral-400 hover:text-white flex items-center gap-2 transition">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <div className="font-bold text-xl tracking-tighter">
          BRAND<span className="text-teal-400">CHECK</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-400">
            Global Brand Safety
          </h1>
          <p className="text-neutral-400 text-lg">
            Check if your brand name implies something offensive, funny, or weird in other languages.
          </p>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50"></div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-2 block">Brand Name</label>
                    <input 
                        type="text" 
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. Lumia, Fitta, Comet"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition text-lg"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-2 block">Target Market</label>
                    <div className="relative">
                        <select 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition appearance-none"
                        >
                            <option value="China">China (Mandarin)</option>
                            <option value="Japan">Japan</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Spain">Spain</option>
                            <option value="France">France</option>
                            <option value="Germany">Germany</option>
                            <option value="Italy">Italy</option>
                            <option value="Vietnam">Vietnam</option>
                        </select>
                        <Globe2 className="absolute right-4 top-3.5 text-neutral-500 pointer-events-none" size={18}/>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleCheck}
                disabled={isAnalyzing || !brandName}
                className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-bold text-lg py-4 rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isAnalyzing ? (
                    <> <Loader2 className="animate-spin" /> Analyzing with Gemini 2.5... </>
                ) : (
                    <> <Search size={20} /> Check Safety Now </>
                )}
            </button>
        </div>

        {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`rounded-3xl p-6 border ${result.status === 'risk' ? 'bg-red-950/20 border-red-500/50' : result.status === 'warning' ? 'bg-yellow-950/20 border-yellow-500/50' : 'bg-green-950/20 border-green-500/50'}`}>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${result.status === 'risk' ? 'bg-red-500/20 text-red-400' : result.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                            {result.status === 'risk' ? <AlertTriangle /> : <CheckCircle2 />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {result.status === 'risk' ? 'Potential Risk Detected' : result.status === 'warning' ? 'Proceed with Caution' : 'Safe to Use'}
                            </h3>
                            <p className="text-neutral-400">Analysis for: <span className="text-white font-bold">{country}</span></p>
                        </div>
                        <div className="ml-auto text-4xl font-bold opacity-50">{result.score}/100</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <h4 className="text-sm text-neutral-400 mb-1">Local Meaning</h4>
                            <p className="text-lg text-white font-medium">{result.meaning}</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <h4 className="text-sm text-neutral-400 mb-1">Pronunciation Check</h4>
                            <p className="text-lg text-white font-medium">{result.pronunciation}</p>
                        </div>
                    </div>
                    
                    {result.suggestion && (
                        <div className="mt-4 p-4 rounded-xl bg-teal-900/20 border border-teal-500/20 text-teal-200 text-sm flex gap-3 items-start">
                            <Sparkles size={18} className="mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold block mb-1">AI Suggestion:</span>
                                {result.suggestion}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        )}
      </div>
    </main>
  );
}