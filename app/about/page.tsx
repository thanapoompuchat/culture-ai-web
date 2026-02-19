"use client";

import Link from "next/link";
import { ArrowLeft, Code2, Cpu, Globe, GraduationCap, Rocket, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* --- Background Effects --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal-900/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- Header / Back Button --- */}
        <nav className="flex items-center gap-2 mb-16 animate-fade-in">
            <Link href="/" className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-neutral-800 border border-neutral-800 transition-all">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>
        </nav>

        {/* --- Hero Section --- */}
        <section className="mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/30 border border-teal-500/30 text-teal-400 text-xs font-bold mb-6 tracking-wide uppercase">
                <GraduationCap size={14} /> Computer Science Initiative
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Bridging Culture <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
                    & Technology
                </span>
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Born from academic rigor, driven by global innovation. 
                We are redefining how digital products communicate across borders through the power of Artificial Intelligence.
            </p>
        </section>

        {/* --- The Origin & Creator (Grid) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            
            {/* Left: The Vision/Project Context */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-sm flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Code2 className="text-teal-400"/> The Origin
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-6">
                    CultureAI originated as a flagship research project within the 
                    <strong className="text-teal-200"> Department of Computer Science</strong>. 
                    What started as an exploration of AI's role in cultural semantics has evolved into a robust platform designed to solve real-world localization challenges.
                </p>
                <div className="flex flex-wrap gap-2">
                    {['Next.js 14', 'Tailwind CSS', 'Supabase', 'OpenAI API'].map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-md bg-neutral-800 text-xs text-neutral-300 border border-neutral-700">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Right: The Creator Profile */}
            <div className="relative group bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-1 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                
                <div className="h-full bg-neutral-950 rounded-[22px] p-8 flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-blue-600 p-[2px] mb-6 shadow-lg shadow-teal-500/20">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-200 to-blue-400">
                            TP
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-1">Thanapoom Puchat</h3>
                    <p className="text-sm text-teal-400 font-medium uppercase tracking-wider mb-4">Lead Engineer & Founder</p>
                    
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                        "We believe that technology should not just translate languages, but understand the soul of every culture. This is just the beginning."
                    </p>
                </div>
            </div>
        </section>

        {/* --- The Roadmap / Future --- */}
        <section className="border-t border-neutral-800 pt-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-4">Future Roadmap</h2>
                    <p className="text-neutral-400 max-w-md">
                        Our commitment to development is unwavering. We are actively scaling our models to support more regions and deeper analytics.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-teal-400 text-sm font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-teal-400"/> System Active & Evolving
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: <Globe size={24} />,
                        title: "Global Dataset Expansion",
                        desc: "Integrating cultural nuances from 50+ new regions including LATAM and EMEA."
                    },
                    {
                        icon: <Cpu size={24} />,
                        title: "Real-time API Access",
                        desc: "Opening our engine for developers to integrate CultureAI directly into their CI/CD pipelines."
                    },
                    {
                        icon: <Layers size={24} />,
                        title: "Visual Context Engine v2.0",
                        desc: "Advanced computer vision to analyze layout flow and color psychology deeper than ever before."
                    }
                ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 hover:bg-neutral-900 hover:border-teal-500/30 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform group-hover:bg-teal-950">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* --- Footer Signature --- */}
        <div className="mt-24 text-center pt-12 border-t border-neutral-900">
            <p className="text-neutral-600 text-sm">
                &copy; {new Date().getFullYear()} CultureAI Project. Developed by Thanapoom Puchat. 
                <span className="block mt-1 opacity-50">Department of Computer Science.</span>
            </p>
        </div>

      </div>
    </main>
  );
}