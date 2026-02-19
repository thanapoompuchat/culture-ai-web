"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, TrendingUp, Sparkles, Activity, ShieldCheck, 
  BarChart3, Users, LogIn, LogOut
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient"; 

const BentoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-500 group backdrop-blur-sm ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/0 via-teal-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="relative z-10 h-full w-full">{children}</div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) setUser(session.user);
        else setUser(null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') setUser(session?.user);
        if (event === 'SIGNED_OUT') setUser(null);
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setShowProfileMenu(false);
      router.refresh(); 
  };

  const getUserInitial = () => {
      if (!user || !user.email) return "U";
      return user.email.charAt(0).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden selection:bg-teal-500/30">
      
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-teal-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-800/10 blur-[150px] rounded-full pointer-events-none" />

      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto backdrop-blur-xl bg-white/5 px-6 py-4 rounded-full border border-white/10 z-50 relative shadow-2xl shadow-black/50">
        
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer">
          <div className="relative">
             <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
             <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
          </div>
          <span>CULTURE<span className="text-teal-400">AI</span></span>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
            <Link href="/brand-check" className="text-sm font-medium text-neutral-400 hover:text-teal-300 transition-colors flex items-center gap-2 group">
                <ShieldCheck size={16} className="group-hover:scale-110 transition-transform"/>
                Brand Check
            </Link>
            
            {/* ✅ 1. Navbar: ไปหน้า SEO Audit (หน้าวิเคราะห์เว็บ) */}
            <Link href="/seo-audit" className="text-sm font-medium text-neutral-400 hover:text-teal-300 transition-colors flex items-center gap-2 group">
                <BarChart3 size={16} className="group-hover:scale-110 transition-transform"/>
                Content Audit
            </Link>

            <Link href="/about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <Users size={16} />
                About Us
            </Link>
            
            {loading ? (
                <div className="w-20 h-8 bg-white/10 rounded-full animate-pulse" />
            ) : user ? (
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white pl-2 pr-4 py-1.5 rounded-full border border-neutral-700 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg">
                            {getUserInitial()}
                        </div>
                        <span className="text-sm font-medium max-w-[100px] truncate">
                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </span>
                    </button>
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="px-4 py-3 border-b border-neutral-800">
                                <p className="text-xs text-neutral-500">Signed in as</p>
                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950/20 text-sm flex items-center gap-2 transition-colors cursor-pointer">
                                <LogOut size={14}/> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/login">
                    <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-teal-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] ml-2 flex items-center gap-2 cursor-pointer">
                    <LogIn size={16} /> Login
                    </button>
                </Link>
            )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-[200px]">
        
        {/* LEFT HERO */}
        <div className="lg:col-span-5 lg:row-span-3 flex flex-col justify-center pr-4 xl:pr-8 space-y-8 z-10 py-8 lg:py-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/30 text-teal-300 text-xs font-bold w-fit shadow-[0_0_20px_rgba(20,184,166,0.1)] backdrop-blur-md">
            <Sparkles size={12} className="text-cyan-400" />
            <span>AI-Powered Design Analysis v5.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
            Design for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-400 to-blue-500 animate-gradient-x">
              Global Impact
            </span>
          </h1>
          
          <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
            Validate your UI/UX against cultural norms. 
            <span className="text-teal-200"> Localize colors, imagery, and tone</span> instantly.
          </p>

          <div className="flex gap-4 pt-2">
            {/* ✅ 2. ซ้ายมือ: เปลี่ยนคำเป็น Start Brand Check และไปหน้า /check */}
            <Link href={user ? "/check" : "/login"}>
              <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                <span className="relative flex items-center gap-2">
                  {user ? "Start Analyze" : "Start Now"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT BENTO GRID */}
        {/* Box 1: Culture Score */}
        <BentoCard className="lg:col-span-3 lg:row-span-2 bg-gradient-to-b from-neutral-900 to-black">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Activity size={14} /> Culture Score
              </div>
              <span className="text-green-400 text-xs font-mono bg-green-900/30 px-2 py-1 rounded border border-green-500/30">
                +12%
              </span>
            </div>
            <div className="flex flex-col flex-1 justify-end">
                <div className="flex items-baseline gap-2 mb-1">
                    <div className="text-6xl font-bold text-white tracking-tighter">98</div>
                    <div className="text-sm text-neutral-500 font-medium">/100</div>
                </div>
                <div className="text-xs text-neutral-400 mb-4">Excellent fit for <span className="text-teal-200">Thailand</span></div>
                {/* Graph */}
                <div className="relative h-16 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradientGraph" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0 35 C 20 30, 40 38, 60 15 S 80 5, 100 10" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]" />
                        <path d="M0 40 V 35 C 20 30, 40 38, 60 15 S 80 5, 100 10 V 40 Z" fill="url(#gradientGraph)" opacity="0.5" />
                        <circle cx="100" cy="10" r="3" fill="#fff" className="animate-pulse" />
                    </svg>
                </div>
            </div>
          </div>
        </BentoCard>

        {/* Box 2: ✅ 3. ขวากลาง: Content Health -> ไปหน้า /seo-audit */}
        <Link href="/seo-audit" className="lg:col-span-4 lg:row-span-2 block group h-full">
            <BentoCard className="!p-0 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900 via-neutral-900 to-black transition duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#2DD4BF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] uppercase font-bold">Tech</div>
                        <div className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] uppercase font-bold">SEO</div>
                        <div className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] uppercase font-bold flex gap-1 items-center">
                            <BarChart3 size={10} /> Audit
                        </div>
                    </div>
                    <p className="font-bold text-lg text-white leading-tight group-hover:text-teal-300 transition-colors">Check Content Health</p>
                    <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                        Tap to analyze <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                </div>
            </BentoCard>
        </Link>

        {/* Box 3 */}
        <BentoCard className="lg:col-span-2 lg:row-span-1 flex items-center justify-center bg-neutral-900/80">
             <div className="text-center group-hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(20,184,166,0.15)] mb-3 text-teal-300">
                  <TrendingUp size={24} />
                </div>
                <p className="text-xs font-bold text-teal-100 uppercase tracking-wide">Market Trends</p>
             </div>
        </BentoCard>

        {/* Box 4 */}
        <BentoCard className="lg:col-span-3 lg:row-span-1 bg-neutral-900/80">
             <h3 className="text-sm font-bold text-teal-50 mb-1">Deep Analysis</h3>
             <p className="text-xs text-neutral-400 mb-3">
               Checking fit for <span className="text-cyan-400">South East Asia</span>...
             </p>
             <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 w-full animate-[loading_2s_ease-in-out_infinite]"></div>
             </div>
        </BentoCard>

        {/* Box 5: ✅ 4. ขวาล่าง: เปลี่ยนคำเป็น START และไปหน้า /check */}
        <Link href={user ? "/check" : "/login"} className="lg:col-span-2 lg:row-span-1 block h-full">
          <div className="h-full relative overflow-hidden rounded-3xl p-6 flex items-center justify-center cursor-pointer group border border-transparent hover:border-teal-400/50 transition-all shadow-lg hover:shadow-teal-500/20">
             <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite]"></div>
             <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
             <div className="relative z-10 flex items-center gap-3">
               {/* เปลี่ยนคำตรงนี้ */}
               <span className="text-xl font-black text-white tracking-wide uppercase drop-shadow-md">
                   {user ? "START" : "LOGIN"}
               </span>
               <div className="w-8 h-8 rounded-full bg-white text-teal-700 flex items-center justify-center transform group-hover:translate-x-1 group-hover:-rotate-45 transition-all duration-300 shadow-xl">
                 <ArrowRight size={16} strokeWidth={3} />
               </div>
             </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}