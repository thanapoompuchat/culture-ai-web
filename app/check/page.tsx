"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabaseClient"; 
import { 
  ScanEye, Layers, Globe2, Sparkles,
  Plus, X, Trash2, History, ImageIcon, Code2, Printer, Info, 
  RefreshCw, CheckCircle2, AlertTriangle, Search, Edit3, Save,
  ChevronLeft, ChevronRight, ShieldAlert, Gavel, Scale,
  LogOut, Loader2, Users, MapPin, Target, Zap, Lightbulb, User, Briefcase,
  FileText, TrendingUp, AlertOctagon, Share2, Download, Minimize2, Maximize2
} from "lucide-react";

// ==========================================
// 1. CONSTANTS & DATASETS (FULL & STRICT)
// ==========================================

const COUNTRIES = [
  "Thailand", "United States", "Japan", "China", "South Korea", 
  "Vietnam", "Indonesia", "Singapore", "India", "Germany",
  "United Kingdom", "France", "Brazil", "Australia", "UAE",
  "Saudi Arabia", "Canada", "Sweden", "Mexico", "Taiwan",
  "Malaysia", "Philippines", "Russia", "Netherlands", "Italy",
  "Spain", "Turkey", "Switzerland", "Poland", "Belgium"
];

// 🔥 STRICT LEGAL MAPPING: กฎหมายเฉพาะพื้นที่เท่านั้น
// ใช้สำหรับกรอง Warning ว่าเกี่ยวข้องกับประเทศที่เลือกหรือไม่
const COUNTRY_LAW_MAP: Record<string, { privacy: string; content: string; access: string; consumer: string }> = {
  "Thailand": { 
      privacy: "PDPA B.E. 2562", 
      content: "Computer Crime Act (CCA)", 
      access: "WCAG 2.1 (Ministerial Reg.)",
      consumer: "Consumer Protection Act (OCPB)"
  },
  "United States": { 
      privacy: "CCPA / CPRA / COPPA", 
      content: "CDA Section 230 / DMCA", 
      access: "ADA Title III",
      consumer: "FTC Guidelines"
  },
  "Germany": { 
      privacy: "GDPR (DSGVO)", 
      content: "NetzDG", 
      access: "BITV 2.0",
      consumer: "UWG (Unfair Competition Act)"
  },
  "France": { 
      privacy: "GDPR (CNIL)", 
      content: "LCEN", 
      access: "RGAA",
      consumer: "Consumer Code"
  },
  "Japan": { 
      privacy: "APPI (Act on the Protection of Personal Info)", 
      content: "Provider Liability Limitation Act", 
      access: "JIS X 8341-3",
      consumer: "Act on Specified Commercial Transactions"
  },
  "China": { 
      privacy: "PIPL (Personal Info Protection Law)", 
      content: "Cybersecurity Law (CSL)", 
      access: "GB/T 37668-2019",
      consumer: "Consumer Rights Protection Law"
  },
  "United Kingdom": { 
      privacy: "UK GDPR / DPA 2018", 
      content: "Online Safety Bill", 
      access: "Equality Act 2010",
      consumer: "Consumer Rights Act 2015"
  },
  "Indonesia": { 
      privacy: "PDP Law (UU PDP)", 
      content: "ITE Law", 
      access: "Permenkominfo",
      consumer: "Consumer Protection Law No. 8"
  },
  "Vietnam": { 
      privacy: "PDP Decree 13/2023", 
      content: "Cybersecurity Law (CSL)", 
      access: "ICT Accessibility Standards",
      consumer: "Law on Protection of Consumers"
  },
  "Singapore": { 
      privacy: "PDPA 2012", 
      content: "POFMA / OSA", 
      access: "SS 618",
      consumer: "CPFTA"
  },
  // Default fallback
  "Global": { 
      privacy: "Intl. Privacy Standards", 
      content: "Content Moderation Guidelines", 
      access: "WCAG 2.1 AA",
      consumer: "Intl. Consumer Rights"
  }
};

const INDUSTRY_CATEGORIES = {
  "Tech & Digital": [
    "Fintech & Banking", 
    "E-Commerce & Retail", 
    "SaaS (B2B)", 
    "Crypto & Web3", 
    "AI & Data Tools", 
    "Gaming & Esports", 
    "Music & Streaming", 
    "Cybersecurity", 
    "Cloud Infrastructure"
  ],
  "Service & Lifestyle": [
    "Health & Wellness", 
    "Travel & Hospitality", 
    "Food & Beverage", 
    "Education (EdTech)", 
    "Media & Entertainment", 
    "Fashion & Apparel", 
    "Beauty & Cosmetics", 
    "Sports & Fitness",
    "Dating & Social"
  ],
  "Traditional & Public": [
    "Real Estate", 
    "Automotive", 
    "Logistics & Supply Chain", 
    "Energy & Sustainability", 
    "Manufacturing", 
    "Agriculture",
    "Government & Public Sector",
    "Non-Profit / NGO"
  ]
};

const PERSONA_CATEGORIES = {
  "Generations": [
    "Gen Z (Digital Native)", 
    "Millennials (Tech Adapted)", 
    "Gen X (Pragmatic)", 
    "Baby Boomers (Traditional)", 
    "Gen Alpha (Future)"
  ],
  "Behavior & Lifestyle": [
    "Budget Hunter / Saver", 
    "Luxury Spender / High Net Worth", 
    "Eco-Conscious / Green", 
    "Impulse Buyer", 
    "Researcher / Reviewer", 
    "Early Adopter / Techie", 
    "Brand Loyalist"
  ],
  "Tech Proficiency": [
    "Power User / Developer", 
    "Digital Nomad", 
    "Casual User", 
    "Non-Tech Savvy", 
    "Accessibility Focused (Elderly/Disabled)"
  ],
  "Professional Status": [
    "Startup Founder / Entrepreneur", 
    "C-Level Executive", 
    "SME Owner", 
    "Freelancer / Gig Worker", 
    "Investor", 
    "Corporate Employee", 
    "Student"
  ]
};

// ==========================================
// 2. TYPES DEFINITIONS
// ==========================================

type InputMode = 'image' | 'code';

type FlowStep = {
  id: number;
  mode: InputMode;
  file: File | null;
  codeSnippet: string;
  previewUrl: string | null;
  description: string;
};

// Extended for strict visual filtering
type VisualIssue = {
    id: string;
    x: number; 
    y: number; 
    w: number; 
    h: number;
    title: string;
    description: string;   
    recommendation: string; 
    severity: 'critical' | 'warning' | 'info';
};

// Extended for strict legal logic
type AnalysisResult = {
    score: number;
    quote: string;
    scoreReasoning?: string;
    metrics: {
        legibility: string;
        issues: number;
        safety: string;
        context: string;
    };
    details: {
        id: number | string;
        type: "error" | "suggestion" | "legal_warning"; 
        title: string;
        desc: string;
        lawReference?: string;
        severity?: "critical" | "high" | "medium";
    }[];
    visualIssues: VisualIssue[];
    heatmapData: string;
    benchmark: {
        competitors: string[];
        marketAvgScore: number;
        radarData: number[]; // [Trust, Local, Fun, Ease, Speed]
        sentiment: string;
        competitorName: string;
        competitorScore: number;
        comparison: { aspect: string; us: string; them: string; notes: string }[];
    };
    localizerKit: {
        adaptivePalette: { hex: string; name: string; originalRef: string; reason: string }[];
        fonts: { heading: string; body: string };
        cssVariable: string;
    };
};

type HistoryItem = { 
    id: string; 
    name: string; 
    timestamp: string; 
    thumbnail: string | null; 
    type: InputMode;
    resultData?: AnalysisResult; 
};

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const RadarChart = ({ data }: { data: number[] }) => {
    // Default fallback if data is missing
    const p = data && data.length === 5 ? data : [50, 50, 50, 50, 50];
    
    // Calculate points for polygon based on 5 axes
    const points = `
      100,${20 + (100-p[0])} 
      ${180 - (100-p[1])/2},80 
      ${150 - (100-p[2])/2},180 
      ${50 + (100-p[3])/2},180 
      ${20 + (100-p[4])/2},80
    `; 

    return (
      <div className="relative w-full aspect-square max-w-[180px] mx-auto flex items-center justify-center print:w-[150px] print:h-[150px]">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-18">
              {/* Background Web */}
              <polygon points="100,10 190,78 155,190 45,190 10,78" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-700 print:text-gray-300 opacity-20"/>
              <polygon points="100,30 170,84 140,170 60,170 30,84" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-700 print:text-gray-300 opacity-20"/>
              <polygon points="100,50 145,84 127,140 73,140 55,84" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-700 print:text-gray-300 opacity-40"/>
              
              {/* Data Shape */}
              <polygon points={points} fill="rgba(45, 212, 191, 0.4)" stroke="#2DD4BF" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] print:fill-transparent print:stroke-black print:stroke-[2px] print:drop-shadow-none"/>
          </svg>
          
          {/* Labels */}
          <div className="absolute top-0 text-[10px] text-neutral-400 font-mono print:text-black font-bold">Trust</div>
          <div className="absolute bottom-2 right-4 text-[10px] text-neutral-400 font-mono print:text-black font-bold">Local</div>
          <div className="absolute bottom-2 left-4 text-[10px] text-neutral-400 font-mono print:text-black font-bold">Fun</div>
          <div className="absolute top-1/3 left-0 text-[10px] text-neutral-400 font-mono print:text-black font-bold">Ease</div>
          <div className="absolute top-1/3 right-0 text-[10px] text-neutral-400 font-mono print:text-black font-bold">Speed</div>
      </div>
    );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function CheckPage() {
  const router = useRouter();
  
  // ---------------- STATE ----------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); 

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]); 
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  // Input State
  const [countrySearch, setCountrySearch] = useState(""); 
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showCountryList, setShowCountryList] = useState(false);
  
  const [industry, setIndustry] = useState(""); 
  const [customIndustry, setCustomIndustry] = useState("");
  
  const [persona, setPersona] = useState(""); 
  const [customPersona, setCustomPersona] = useState("");

  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([
    { id: 1, mode: 'image', file: null, codeSnippet: "", previewUrl: null, description: "" }
  ]);

  // Visual Analysis State
  const [visualMode, setVisualMode] = useState<'issues' | 'heatmap'>('issues'); 
  const [currentVisualStepIndex, setCurrentVisualStepIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [activeIssueId, setActiveIssueId] = useState<string | number | null>(null);
  
  // Results State
  const [result, setResult] = useState<AnalysisResult | null>(null); 

  // ---------------- EFFECTS ----------------

  // 1. Check Auth
  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { 
            router.push("/login"); 
        } else { 
            setIsAuthenticated(true); 
            setIsCheckingAuth(false); 
        }
    };
    checkSession();
  }, [router]);

  // 2. Load History
  useEffect(() => {
    const saved = localStorage.getItem('cultureai_history');
    if (saved) { 
        try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); } 
    }
  }, []);

  // 3. Save History
  useEffect(() => {
    if (history.length > 0) {
        try {
            localStorage.setItem('cultureai_history', JSON.stringify(history));
        } catch (e) {
            console.warn("Storage full, trimming history");
            const trimmed = history.slice(0, 3); // Keep only 3 latest
            try {
                localStorage.setItem('cultureai_history', JSON.stringify(trimmed));
                setHistory(trimmed);
            } catch (err) {
                localStorage.removeItem('cultureai_history');
            }
        }
    }
  }, [history]);

  // ---------------- HANDLERS ----------------

  const handleLogout = async () => { 
      await supabase.auth.signOut(); 
      router.push("/"); 
  };

  // Step Management
  const addStep = () => { 
      setFlowSteps([...flowSteps, { id: Date.now(), mode: 'image', file: null, codeSnippet: "", previewUrl: null, description: "" }]); 
  };
  
  const removeStep = (id: number) => { 
      if (flowSteps.length > 1) setFlowSteps(flowSteps.filter(s => s.id !== id)); 
  };

  const updateStep = (id: number, field: keyof FlowStep, value: any) => {
    setFlowSteps(prev => prev.map(s => {
      if (s.id === id) {
        if (field === 'file' && value instanceof File) {
            return { ...s, file: value, previewUrl: URL.createObjectURL(value) };
        }
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        updateStep(flowSteps[0].id, 'file', e.target.files[0]);
    }
  };

  // Country Management
  const addCountry = (country: string) => {
    // 🔥 STRICT MODE: Limit to 1 country for precise legal mapping
    setSelectedCountries([country]); 
    setCountrySearch(""); 
    setShowCountryList(false);
  };
  const removeCountry = (c: string) => setSelectedCountries([]);
  
  const filteredCountryList = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()) && !selectedCountries.includes(c));

  // History Management
  const deleteHistory = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setHistory(history.filter(h => h.id !== id)); };
  const startRename = (id: string, name: string, e: React.MouseEvent) => { e.stopPropagation(); setEditingHistoryId(id); setTempName(name); };
  const saveRename = (id: string) => { setHistory(history.map(h => h.id === id ? { ...h, name: tempName } : h)); setEditingHistoryId(null); };
  const loadHistoryItem = (item: HistoryItem) => { if (item.resultData) { setResult(item.resultData); setActiveTab("overview"); } };
  
  const handlePrint = () => { 
      if (!result) return; 
      window.print(); 
  };

  // 🔥 CORE LOGIC: Normalize & Filter Data (Strict Mode) 🔥
  const normalizeAnalysisResult = (data: AnalysisResult, targetCountry: string): AnalysisResult => {
      
      // 1. FLOOR SCORE Logic (Baseline 50)
      const RAW_SCORE = data.score;
      const FLOORED_SCORE = Math.max(50, RAW_SCORE);
      
      // 2. STRICT LEGAL MAPPING
      // Get exact laws for the target country. If not found, use Global.
      const laws = COUNTRY_LAW_MAP[targetCountry] || COUNTRY_LAW_MAP["Global"];
      
      const refinedDetails = data.details.reduce((acc: any[], item) => {
         // Filter: Only process items flagged as errors or critical suggestions
         // If it's just a general improvement, keep as suggestion without legal warning
         if (item.type === 'error' || item.desc.toLowerCase().includes("legal") || item.desc.toLowerCase().includes("compliant")) {
             
             let specificLaw = "";
             const titleLower = item.title.toLowerCase();
             const descLower = item.desc.toLowerCase();

             // Check for Privacy/Data violations
             if (titleLower.includes("privacy") || titleLower.includes("data") || titleLower.includes("consent") || descLower.includes("cookie")) {
                 specificLaw = laws.privacy;
             } 
             // Check for Content/Censorship/Lese Majeste violations
             else if (titleLower.includes("content") || titleLower.includes("image") || titleLower.includes("forbidden") || descLower.includes("royal")) {
                 specificLaw = laws.content;
             }
             // Check for Accessibility violations
             else if (titleLower.includes("accessibility") || titleLower.includes("contrast") || titleLower.includes("readable") || descLower.includes("disability")) {
                 specificLaw = laws.access;
             }
             // Check for Consumer Rights
             else if (titleLower.includes("refund") || titleLower.includes("pricing") || titleLower.includes("terms")) {
                 specificLaw = laws.consumer;
             }

             // 🔥 CRITICAL FILTER: If it maps to a real law, Mark as LEGAL WARNING.
             if (specificLaw) {
                 acc.push({
                     ...item,
                     type: "legal_warning", // Force type to legal warning
                     lawReference: specificLaw,
                     severity: "critical",
                     title: item.title,
                     desc: `[Violates ${specificLaw}] ${item.desc}`
                 });
             } else {
                 // If no specific law matches for this country, downgrade to suggestion (it's not illegal, just bad practice)
                 acc.push({ ...item, type: "suggestion" }); 
             }
         } else {
             acc.push(item);
         }
         return acc;
      }, []);

      // 3. STRICT VISUAL FILTER
      // Filter out "micro-visuals" (padding, font size, small contrast issues)
      // Only keep "Critical" cultural issues.
      const refinedVisualIssues = data.visualIssues.filter(issue => {
          const desc = (issue.description || "").toLowerCase();
          const title = (issue.title || "").toLowerCase();

          // NOISE FILTER KEYWORDS
          const isMicroVisual = 
            desc.includes("padding") || 
            desc.includes("margin") || 
            desc.includes("pixel") ||
            desc.includes("whitespace") ||
            desc.includes("kerning") ||
            (desc.includes("font size") && !desc.includes("legibility")) ||
            title.includes("alignment") ||
            title.includes("spacing");

          // Keep if it is MARKED CRITICAL by AI
          if (issue.severity === 'critical') return true;

          // If it's a micro-visual noise, DROP IT
          if (isMicroVisual) return false; 
          
          return true; // Keep standard cultural issues
      }).map(issue => ({
          ...issue,
          // Ensure every visual issue has a severity
          severity: issue.severity || 'warning'
      }));

      // Generate Reasoning if missing
      let reasoning = data.scoreReasoning || "";
      if (!reasoning) {
          reasoning = FLOORED_SCORE === 50 
            ? `Critical Compliance Detected: Design risks violating ${laws.privacy} or local content laws in ${targetCountry}.`
            : `Verified against ${targetCountry} regulations (${laws.privacy}) and cultural norms.`;
      }

      return {
          ...data,
          score: FLOORED_SCORE,
          scoreReasoning: reasoning,
          details: refinedDetails,
          visualIssues: refinedVisualIssues,
          // Ensure benchmark comparison exists
          benchmark: {
              ...data.benchmark,
              comparison: data.benchmark?.comparison || []
          }
      };
  };

  // 🔥 CORE: ANALYZE FUNCTION 🔥
  const handleAnalyze = async () => {
    const firstStep = flowSteps[0];
    if (firstStep.mode === 'image' && !firstStep.file && !firstStep.previewUrl) return alert("⚠️ Please upload a UI image to analyze.");
    if (selectedCountries.length === 0) return alert("⚠️ Please select a Target Market.");
    if (!industry && !customIndustry) return alert("⚠️ Please select an Industry.");
    if (!persona && !customPersona) return alert("⚠️ Please select a Persona.");

    setLoading(true);
    setResult(null); 
    setCurrentVisualStepIndex(0);

    const finalIndustry = industry === 'Custom' ? customIndustry : industry;
    const finalPersona = persona === 'Custom' ? customPersona : persona;
    const mainCountry = selectedCountries[0];

    try {
        let base64Image = "";
        
        if (firstStep.file) {
            base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(firstStep.file!);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        } else if (firstStep.previewUrl && firstStep.previewUrl.startsWith('data:')) {
             base64Image = firstStep.previewUrl;
        }

        if (!base64Image) throw new Error("No image data found. Please upload a new image.");

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageBase64: base64Image,
                industry: finalIndustry,
                persona: finalPersona,
                country: mainCountry
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Analysis request failed.");

        // Apply Normalization (Flooring & Strict Filters)
        const finalResult = normalizeAnalysisResult(data as AnalysisResult, mainCountry);
        setResult(finalResult);
        
        const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            name: `${finalIndustry} - ${mainCountry}`,
            timestamp: new Date().toLocaleTimeString(),
            thumbnail: base64Image,
            type: 'image',
            resultData: finalResult
        };
        
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 5)); 

    } catch (error: any) {
        console.error("Analysis Error:", error);
        alert(`Error: ${error.message || "Something went wrong during AI analysis."}`);
    } finally {
        setLoading(false);
        setActiveTab("overview"); 
    }
  };

  // Loading Screen
  if (isCheckingAuth) return (
      <div className="min-h-screen bg-black flex items-center justify-center text-teal-500">
          <Loader2 className="animate-spin" size={32}/>
      </div>
  );

  const currentStepData = flowSteps[currentVisualStepIndex];
  const currentIssues = result?.visualIssues || [];
  const legalIssues = result?.details.filter(d => d.type === 'legal_warning') || [];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden print:bg-white print:text-black print:overflow-visible print:block">
      
      {/* =======================
          SIDEBAR (HISTORY)
      ======================== */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800 transition-transform duration-300 ease-out shadow-2xl print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[280px]'}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
         <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-transparent via-neutral-700 to-transparent opacity-50 cursor-pointer hover:opacity-100" />
         <div className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-teal-400 font-bold uppercase tracking-wider text-xs">
                <History size={16}/> Recent Projects
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                {history.length === 0 && (
                    <div className="text-neutral-600 text-xs text-center py-4 italic">No history yet.</div>
                )}
                {history.map(item => (
                    <div key={item.id} onClick={() => loadHistoryItem(item)} className="group p-3 rounded-xl bg-black/40 border border-neutral-800 hover:border-teal-500/50 hover:bg-neutral-800 transition cursor-pointer relative">
                        {editingHistoryId === item.id ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    value={tempName} 
                                    onChange={(e) => setTempName(e.target.value)} 
                                    className="bg-black text-xs w-full p-1 rounded border border-teal-500 outline-none" 
                                    autoFocus 
                                />
                                <button onClick={() => saveRename(item.id)} className="text-green-500 hover:text-green-400"><Save size={14}/></button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-neutral-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                    {item.thumbnail ? (
                                        <Image src={item.thumbnail} width={40} height={40} alt="th" className="object-cover w-full h-full"/>
                                    ) : (
                                        <ImageIcon size={20} className="text-neutral-500"/>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate text-neutral-200">{item.name}</div>
                                    <div className="text-[10px] text-neutral-500">{item.timestamp}</div>
                                </div>
                            </div>
                        )}
                        {editingHistoryId !== item.id && (
                            <div className="absolute right-2 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition bg-neutral-900/80 px-1 rounded">
                                <button onClick={(e) => startRename(item.id, item.name, e)} className="text-neutral-400 hover:text-white"><Edit3 size={14}/></button>
                                <button onClick={(e) => deleteHistory(item.id, e)} className="text-neutral-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-800">
                <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition w-full p-2 hover:bg-red-950/20 rounded">
                    <LogOut size={14}/> Sign Out
                </button>
            </div>
         </div>
      </div>

      {/* =======================
          MAIN CONTENT AREA
      ======================== */}
      <main className={`flex-1 transition-all duration-300 print:ml-0 print:w-full ${isSidebarOpen ? 'ml-72 blur-sm scale-95 pointer-events-none' : ''}`}>
        <div className="container mx-auto p-6 max-w-[1600px] print:p-0 print:max-w-none">
            
            {/* --- APP HEADER (WEB) --- */}
            <header className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4 print:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Globe2 className="text-white" size={24}/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Culture<span className="text-teal-400">AI</span></h1>
                        <p className="text-neutral-500 text-sm">Context-Aware Design Engine V5.2 (Strict Mode)</p>
                    </div>
                </div>
                
                <div className="flex gap-4 items-center">
                    {result && (
                        <button onClick={handlePrint} className="flex items-center gap-2 text-xs font-bold bg-neutral-100 text-black hover:bg-white px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg">
                            <Printer size={14}/> Print Report
                        </button>
                    )}
                    <Link href="/" className="flex items-center gap-2 text-xs font-bold text-red-400 border border-red-500/20 px-3 py-2 rounded-lg hover:bg-red-950/20 transition">
                        <LogOut size={14}/> Exit
                    </Link>
                </div>
            </header>

            {/* --- PRINT HEADER (PDF ONLY) --- */}
            <div className="hidden print:block border-b-2 border-black pb-4 mb-8">
                 <div className="flex justify-between items-start">
                     <div>
                         <h1 className="text-3xl font-serif font-bold text-black uppercase tracking-wider">Critical Analysis Report</h1>
                         <p className="text-sm text-gray-500 font-serif">Generated by CultureAI Engine</p>
                     </div>
                     <div className="text-right">
                         <div className="text-xs text-gray-500 uppercase font-bold">Generated Date</div>
                         <div className="text-sm font-medium text-black">{new Date().toLocaleDateString()}</div>
                     </div>
                 </div>
                 
                 {result && (
                    <div className="mt-6 flex border border-gray-300 divide-x divide-gray-300">
                        <div className="flex-1 p-3">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Target Market</span>
                            <div className="text-sm font-bold text-black">{selectedCountries.join(", ")}</div>
                        </div>
                        <div className="flex-1 p-3">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Industry</span>
                            <div className="text-sm font-bold text-black">{industry || customIndustry}</div>
                        </div>
                        <div className="flex-1 p-3 bg-gray-50">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Overall Score</span>
                            <div className="text-xl font-black text-black">{result.score}/100</div>
                        </div>
                    </div>
                 )}
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-140px)] print:block print:h-auto">
                
                {/* --- LEFT COL: CONFIGURATION --- */}
                <div className="xl:col-span-5 space-y-6 overflow-y-auto custom-scrollbar pr-2 print:hidden">
                    
                    {/* 1. Target Parameters */}
                    <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-sm">
                        <h2 className="text-teal-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                            <ScanEye size={16}/> Target Parameters
                        </h2>
                        
                        {/* Country Selector */}
                        <div className="mb-6 relative z-30">
                            <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Target Market (Strict Legal)</label>
                            
                            {/* Selected Tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedCountries.map(c => (
                                    <div key={c} className="flex items-center gap-1 bg-teal-900/30 border border-teal-500/30 text-teal-300 text-xs px-2 py-1 rounded-md animate-in zoom-in duration-200">
                                        <MapPin size={10}/><span>{c}</span>
                                        <button onClick={() => removeCountry(c)} className="hover:text-white text-teal-500"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Search Input */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-2.5 text-neutral-500 group-focus-within:text-teal-500 transition-colors" size={16}/>
                                <input 
                                    type="text" 
                                    value={countrySearch} 
                                    onChange={(e) => { setCountrySearch(e.target.value); setShowCountryList(true); }} 
                                    onFocus={() => setShowCountryList(true)} 
                                    placeholder="Search country..." 
                                    className="w-full bg-black border border-neutral-700 rounded-lg pl-9 p-2.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-neutral-600"
                                />
                                
                                {showCountryList && (countrySearch || filteredCountryList.length > 0) && (
                                    <div className="absolute top-full left-0 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl max-h-56 overflow-y-auto custom-scrollbar z-50">
                                        {filteredCountryList.map(c => (
                                            <div key={c} onClick={() => addCountry(c)} className="px-4 py-2 hover:bg-teal-500/20 cursor-pointer text-sm text-neutral-300 hover:text-white transition flex items-center justify-between group/item">
                                                <span>{c}</span>
                                                <Plus size={14} className="opacity-0 group-hover/item:opacity-100 text-teal-500"/>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Industry Selector */}
                        <div className="mb-6">
                            <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">Industry Sector</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 text-neutral-500" size={16}/>
                                <select 
                                    value={industry} 
                                    onChange={e => { setIndustry(e.target.value); if(e.target.value !== 'Custom') setCustomIndustry(""); }} 
                                    className="w-full bg-black border border-neutral-700 rounded-lg pl-9 p-2.5 text-sm outline-none focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="" disabled>-- Select Industry --</option>
                                    {Object.entries(INDUSTRY_CATEGORIES).map(([cat, items]) => (
                                        <optgroup key={cat} label={cat} className="bg-neutral-900 text-neutral-400 font-bold">
                                            {items.map(i => <option key={i} value={i} className="text-white font-normal">{i}</option>)}
                                        </optgroup>
                                    ))}
                                    <option value="Custom" className="font-bold text-teal-400 bg-neutral-800">✨ Custom Industry...</option>
                                </select>
                            </div>
                            {industry === 'Custom' && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <input 
                                        type="text" 
                                        value={customIndustry} 
                                        onChange={(e) => setCustomIndustry(e.target.value)} 
                                        placeholder="Ex: Music App, Food Delivery..." 
                                        className="w-full bg-teal-900/10 border border-teal-500/30 rounded-lg p-2.5 text-sm text-teal-100 placeholder-teal-500/50 outline-none focus:border-teal-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Persona Selector */}
                        <div>
                            <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">User Persona</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-neutral-500" size={16}/>
                                <select 
                                    value={persona} 
                                    onChange={e => { setPersona(e.target.value); if(e.target.value !== 'Custom') setCustomPersona(""); }} 
                                    className="w-full bg-black border border-neutral-700 rounded-lg pl-9 p-2.5 text-sm outline-none focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="" disabled>-- Select Persona --</option>
                                    {Object.entries(PERSONA_CATEGORIES).map(([cat, items]) => (
                                        <optgroup key={cat} label={cat} className="bg-neutral-900 text-neutral-400 font-bold">
                                            {items.map(p => <option key={p} value={p} className="text-white font-normal">{p}</option>)}
                                        </optgroup>
                                    ))}
                                    <option value="Custom" className="font-bold text-teal-400 bg-neutral-800">✨ Custom Persona...</option>
                                </select>
                            </div>
                            {persona === 'Custom' && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <input 
                                        type="text" 
                                        value={customPersona} 
                                        onChange={(e) => setCustomPersona(e.target.value)} 
                                        placeholder="Ex: Solo Traveler..." 
                                        className="w-full bg-teal-900/10 border border-teal-500/30 rounded-lg p-2.5 text-sm text-teal-100 placeholder-teal-500/50 outline-none focus:border-teal-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Upload Steps */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                             <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Context Assets</h3>
                             <button onClick={addStep} className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-1"><Plus size={12}/> Add Step</button>
                        </div>
                        
                        <div className="relative pl-4 border-l-2 border-neutral-800 space-y-8">
                            {flowSteps.map((step, index) => (
                                <div key={step.id} className="relative animate-in slide-in-from-left-4 duration-300">
                                    <div className="absolute -left-[23px] top-6 w-4 h-4 rounded-full bg-neutral-900 border-2 border-teal-500 z-10 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                    <div className="bg-neutral-900/30 p-4 rounded-xl border border-neutral-800 relative group hover:border-neutral-700 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold bg-neutral-800 px-2 py-1 rounded text-neutral-300 border border-neutral-700">Step {index + 1}</span>
                                            {flowSteps.length > 1 && (
                                                <button onClick={() => removeStep(step.id)} className="text-neutral-600 hover:text-red-500 transition"><X size={14}/></button>
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-24 h-28 shrink-0 bg-black rounded-lg border border-neutral-700 overflow-hidden relative cursor-pointer hover:border-teal-500/50 flex items-center justify-center group/img transition-all">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleFileChange} 
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                {step.previewUrl ? (
                                                    <>
                                                        <Image src={step.previewUrl} alt="preview" fill className="object-cover"/>
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-xs text-white">Change</div>
                                                    </>
                                                ) : (
                                                    <div className="text-center group-hover/img:scale-110 transition duration-300">
                                                        <Plus size={20} className="mx-auto text-neutral-500 mb-1"/>
                                                        <span className="text-[10px] text-neutral-500">Upload UI</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <textarea 
                                                    value={step.description} 
                                                    onChange={(e) => updateStep(step.id, 'description', e.target.value)} 
                                                    placeholder="Briefly describe this screen context (e.g. 'Homepage after login')..." 
                                                    className="w-full h-28 bg-black/50 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 resize-none focus:border-teal-500 outline-none transition-colors placeholder:text-neutral-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleAnalyze} 
                            disabled={loading || (!flowSteps[0].file && !flowSteps[0].previewUrl)} 
                            className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-teal-500/20 ${loading ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-400 to-cyan-400 hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <><RefreshCw className="animate-spin" size={20}/> ANALYZING...</>
                            ) : (
                                <><Sparkles size={20}/> RUN STRICT AUDIT</>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- RIGHT COL: RESULTS PANE --- */}
                <div className="xl:col-span-7 h-full flex flex-col bg-neutral-900/20 border border-neutral-800 rounded-3xl overflow-hidden relative shadow-2xl print:col-span-12 print:bg-white print:border-none print:rounded-none print:overflow-visible print:block print:h-auto print:shadow-none">
                    
                    {!result ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 print:hidden">
                            <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 animate-pulse">
                                <Layers size={40} className="opacity-20"/>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-400 mb-2">Ready to Analyze</h3>
                            <p className="opacity-40 text-sm max-w-xs text-center">Upload your UI screenshots and select a target market to see strict legal & cultural compliance.</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500 print:block">
                            
                            {/* Result Toolbar */}
                            <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md flex justify-between items-center z-40 print:hidden">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Score</div>
                                        <div className={`text-2xl font-black ${result.score >= 80 ? 'text-teal-400' : result.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {result.score}<span className="text-sm text-neutral-600 font-normal">/100</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-neutral-800 mx-2"></div>
                                    <div className="text-xs text-neutral-400 hidden lg:block">
                                        <div className="font-bold text-white">{selectedCountries[0]}</div>
                                        <div>{industry}</div>
                                    </div>
                                </div>

                                <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 shadow-inner">
                                    {[
                                        { id: 'overview', icon: TrendingUp, label: 'Overview' },
                                        { id: 'context', icon: Globe2, label: 'Context' },
                                        { id: 'visual', icon: ScanEye, label: 'Visual' },
                                        { id: 'legal', icon: ShieldAlert, label: 'Legal' }
                                    ].map(t => (
                                        <button 
                                            key={t.id} 
                                            onClick={() => setActiveTab(t.id)} 
                                            className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition flex items-center gap-2 ${activeTab === t.id ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'} ${(t.id === 'legal' && legalIssues.length > 0) ? 'text-red-400 hover:text-red-300' : ''}`}
                                        >
                                            <t.icon size={12} className="hidden md:block"/> 
                                            {t.label} 
                                            {t.id === 'legal' && legalIssues.length > 0 && <span className="ml-1 bg-red-900/50 text-red-400 text-[9px] px-1.5 rounded-full border border-red-500/30">{legalIssues.length}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* TABS CONTENT CONTAINER */}
                            <div className={`flex-1 relative bg-black/20 print:bg-white print:p-0 ${activeTab === 'visual' ? 'p-0 overflow-hidden print:overflow-visible' : 'overflow-y-auto custom-scrollbar p-6'}`}>
                                
                                {/* --- TAB 1: OVERVIEW --- */}
                                <div className={`${activeTab === 'overview' ? 'block' : 'hidden'} print:block print:mb-10 animate-in slide-in-from-bottom-2`}>
                                    <div className="hidden print:flex items-center gap-2 text-lg font-bold text-black border-b border-gray-300 pb-2 mb-4">1. Executive Summary</div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Status Card */}
                                        <div className="bg-neutral-900/40 p-5 rounded-xl border border-neutral-800 flex flex-col justify-center print:bg-white print:border print:border-gray-300">
                                            <div className="text-xs text-neutral-500 uppercase font-bold mb-2">Optimization Status</div>
                                            <div className={`text-xl font-bold ${result.score > 80 ? 'text-teal-400' : 'text-yellow-400 print:text-black'}`}>{result.quote}</div>
                                            {result.scoreReasoning && (
                                                <div className="mt-2 text-[10px] text-teal-400/80 bg-teal-900/20 p-2 rounded border border-teal-500/20 print:text-black print:border-gray-300">
                                                    <span className="font-bold">Logic:</span> {result.scoreReasoning}
                                                </div>
                                            )}
                                            <p className="text-xs text-neutral-400 mt-2 print:text-black leading-relaxed">
                                                Analysis based on <span className="text-white font-bold print:text-black">{selectedCountries[0]}</span> market standards. 
                                                Current design performs {result.score > 80 ? 'above' : 'below'} average compared to local competitors.
                                            </p>
                                        </div>
                                        {/* Radar Chart Card */}
                                        <div className="bg-neutral-900/40 p-5 rounded-xl border border-neutral-800 flex items-center justify-center print:bg-white print:border print:border-gray-300">
                                            <RadarChart data={result.benchmark.radarData} />
                                        </div>
                                    </div>
                                    
                                    {/* BENCHMARK TABLE */}
                                    <div className="bg-gradient-to-r from-neutral-900 to-teal-950/20 p-6 rounded-xl border border-teal-500/20 mb-6 print:bg-white print:border print:border-gray-300 print:shadow-none shadow-lg">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h3 className="text-teal-400 font-bold text-sm mb-1 flex items-center gap-2 print:text-black">
                                                    <Zap size={16}/> Market Benchmark
                                                </h3>
                                                <div className="text-lg font-bold text-white flex items-center gap-2 print:text-black">
                                                    VS <span className="text-xl text-teal-300 print:text-black underline decoration-teal-500/50">{result.benchmark?.competitorName}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-teal-500 print:text-black">{result.benchmark?.competitorScore}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase">Avg. Competitor Score</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-black/40 rounded-lg overflow-hidden border border-white/5 print:bg-white print:border print:border-gray-300">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-white/5 text-neutral-400 print:bg-gray-100 print:text-black">
                                                    <tr>
                                                        <th className="p-3 font-semibold w-1/4">Feature / Aspect</th>
                                                        <th className="p-3 font-semibold text-teal-400 print:text-black w-1/4">Your App</th>
                                                        <th className="p-3 font-semibold text-neutral-400 print:text-black w-1/4">Competitor</th>
                                                        <th className="p-3 font-semibold w-1/4">Local Insight</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 print:divide-gray-200">
                                                    {result.benchmark?.comparison?.map((row: any, i: number) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors print:text-black">
                                                            <td className="p-3 font-medium text-white print:text-black">{row.aspect}</td>
                                                            <td className="p-3 text-teal-300 font-bold print:text-black">{row.us}</td>
                                                            <td className="p-3 text-neutral-400 print:text-black">{row.them}</td>
                                                            <td className="p-3 text-neutral-500 italic print:text-gray-600 leading-tight">{row.notes}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    {/* Recommendations */}
                                    <div className="bg-neutral-900/20 rounded-xl border border-neutral-800 p-6 print:bg-white print:border print:border-gray-300">
                                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 print:text-black">
                                            <Lightbulb size={16} className="text-yellow-500"/> Key Strategic Actions
                                        </h3>
                                        <div className="space-y-3">
                                            {result.details?.filter(d => d.type === 'suggestion').map((rec: any, idx: number) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-black/40 border border-neutral-800/50 rounded-lg hover:border-neutral-600 transition print:bg-white print:border print:border-gray-200">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] bg-blue-500 text-blue-500`}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="text-xs font-bold text-neutral-200 print:text-black">{rec.title}</h4>
                                                        </div>
                                                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed print:text-black">{rec.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* --- TAB 2: CONTEXT --- */}
                                <div className={`${activeTab === 'context' ? 'block' : 'hidden'} print:block print:mb-10 animate-in slide-in-from-bottom-2`}>
                                    <div className="hidden print:flex items-center gap-2 text-lg font-bold text-black border-b border-gray-300 pb-2 mb-4">2. Cultural Context</div>
                                    
                                    <div className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-800 mb-6 print:bg-white print:border print:border-gray-300">
                                        <h3 className="text-teal-400 font-bold mb-4 flex items-center gap-2 text-sm print:text-black">
                                            <Globe2 size={16}/> Cultural Alignment Analysis
                                        </h3>
                                        <p className="text-neutral-300 leading-7 text-sm print:text-black border-l-2 border-teal-500 pl-4">
                                            {result.quote}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 rounded-xl border border-neutral-700 flex flex-col md:flex-row gap-6 items-start print:bg-white print:border print:border-gray-300">
                                        <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 border-2 border-teal-500 shadow-xl print:bg-white print:border-black">
                                            <User size={32} className="text-neutral-300 print:text-black"/>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-white font-bold text-lg print:text-black">{persona}</h4>
                                                <span className="text-[10px] bg-teal-900/50 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 print:bg-white print:text-black print:border-black">Target User</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="bg-black/30 p-4 rounded-lg border border-white/5 print:bg-white print:border print:border-gray-200">
                                                    <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2 flex items-center gap-1 print:text-black">
                                                        <Target size={12}/> Analysis Context
                                                    </div>
                                                    <p className="text-xs text-neutral-400 print:text-black">
                                                        {result.metrics.context}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- TAB 3: VISUAL --- */}
                                <div className={`${activeTab === 'visual' ? 'flex flex-col h-full' : 'hidden'} print:block print:h-auto print:mb-10 animate-in fade-in`}>
                                    <div className="hidden print:flex items-center gap-2 text-lg font-bold text-black border-b border-gray-300 pb-2 mb-6">3. Visual Detection</div>
                                    
                                    {/* Visual Toolbar */}
                                    <div className="flex-none p-4 border-b border-neutral-800 flex justify-between items-center bg-black z-20 print:hidden">
                                        <div className="flex gap-2">
                                            <button onClick={() => setVisualMode('issues')} className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition flex items-center gap-2 ${visualMode === 'issues' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50' : 'bg-black/50 text-neutral-400 border border-white/10 hover:text-white'}`}>
                                                <AlertOctagon size={14}/> Issues Overlay
                                            </button>
                                            <button onClick={() => setVisualMode('heatmap')} className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition flex items-center gap-2 ${visualMode === 'heatmap' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50' : 'bg-black/50 text-neutral-400 border border-white/10 hover:text-white'}`}>
                                                <ScanEye size={14}/> Attention Heatmap
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                             <div className="flex items-center bg-neutral-900 rounded-lg border border-neutral-700 p-1">
                                                <button onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.1))} className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-white"><Minimize2 size={12}/></button>
                                                <span className="text-[10px] w-10 text-center font-mono text-neutral-300">{Math.round(imageZoom * 100)}%</span>
                                                <button onClick={() => setImageZoom(Math.min(3, imageZoom + 0.1))} className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-white"><Maximize2 size={12}/></button>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <button onClick={() => setCurrentVisualStepIndex(Math.max(0, currentVisualStepIndex - 1))} disabled={currentVisualStepIndex === 0} className="p-1.5 rounded hover:bg-neutral-800 text-white disabled:opacity-30 transition"><ChevronLeft size={18}/></button>
                                                 <span className="text-[10px] text-neutral-400">Step {currentVisualStepIndex + 1}/{flowSteps.length}</span>
                                                 <button onClick={() => setCurrentVisualStepIndex(Math.min(flowSteps.length - 1, currentVisualStepIndex + 1))} disabled={currentVisualStepIndex === flowSteps.length - 1} className="p-1.5 rounded hover:bg-neutral-800 text-white disabled:opacity-30 transition"><ChevronRight size={18}/></button>
                                             </div>
                                        </div>
                                    </div>

                                    {/* Canvas Area */}
                                    <div className="flex-1 overflow-auto bg-black relative flex items-center justify-center p-8 print:bg-white print:p-0 print:block">
                                        {currentStepData.previewUrl ? (
                                             <div className="relative inline-block shadow-2xl border border-neutral-800 transition-transform duration-200 ease-out origin-center overflow-hidden print:shadow-none print:border print:border-gray-400 print:w-full print:mx-auto" style={{ width: 'fit-content', transform: `scale(${imageZoom})` }}>
                                                {/* Image */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={currentStepData.previewUrl} alt="visual-analysis" className="block w-auto h-auto max-w-full max-h-[60vh] object-contain select-none pointer-events-none print:max-h-[500px] print:w-full"/>
                                                
                                                {/* Overlay Layer */}
                                                <div className="absolute inset-0 z-10 w-full h-full">
                                                    {/* Issue Markers */}
                                                    {(visualMode === 'issues' || typeof window !== 'undefined') && currentIssues.map((issue, idx) => (
                                                        <div key={idx} 
                                                            onMouseEnter={() => setActiveIssueId(idx)} 
                                                            onMouseLeave={() => setActiveIssueId(null)}
                                                            className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs cursor-pointer z-20 transition-all duration-300
                                                                ${activeIssueId === idx ? 'border-teal-400 bg-teal-500/90 text-black scale-125 shadow-[0_0_20px_rgba(45,212,191,0.8)] z-50' : 'border-red-500 bg-red-600/80 text-white shadow-md'} 
                                                                print:border-red-600 print:bg-transparent print:text-red-600 print:border-2`}
                                                            // 🔥 CLAMPING FIX: Ensure markers don't overflow
                                                            style={{ 
                                                                left: `${Math.min(98, Math.max(2, issue.x))}%`, 
                                                                top: `${Math.min(98, Math.max(2, issue.y))}%`, 
                                                                transform: 'translate(-50%, -50%)' 
                                                            }}
                                                        >
                                                            {idx + 1}
                                                        </div>
                                                    ))}
                                                    
                                                    {/* Heatmap Overlay */}
                                                    {visualMode === 'heatmap' && (
                                                        <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen transition-opacity duration-500 pointer-events-none print:hidden" style={{ background: result.heatmapData }}/>
                                                    )}
                                                </div>
                                             </div>
                                         ) : (
                                             <div className="text-neutral-600 text-xs flex flex-col items-center gap-2 print:hidden">
                                                 <ImageIcon size={32} className="opacity-50"/> 
                                                 <span>No image uploaded</span>
                                             </div>
                                         )}
                                    </div>

                                    {/* Issue List Bottom Panel */}
                                    <div className="p-6 bg-neutral-900/50 border-t border-neutral-800 print:bg-white print:border-none print:pt-4">
                                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 print:text-black">
                                            <AlertTriangle size={16} className="text-red-500"/> Detected Critical Issues
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3 print:gap-4">
                                            {currentIssues.length > 0 ? currentIssues.map((issue, idx) => (
                                                <div 
                                                    key={idx} 
                                                    onMouseEnter={() => setActiveIssueId(idx)} 
                                                    onMouseLeave={() => setActiveIssueId(null)} 
                                                    className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-default 
                                                        ${activeIssueId === idx ? 'bg-neutral-800 border-teal-500/50 shadow-lg scale-[1.01]' : 'bg-black/40 border-neutral-800'} 
                                                        print:bg-white print:border-gray-200`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full border text-sm font-bold flex items-center justify-center shrink-0 transition-colors ${activeIssueId === idx ? 'bg-teal-900/50 border-teal-500 text-teal-400' : 'bg-red-900/20 border-red-500 text-red-500'} print:bg-red-600 print:text-white`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        {/* 🔥 RENDERING FIX: Use description and recommendation */}
                                                        <div className={`font-bold text-sm mb-1 transition-colors ${activeIssueId === idx ? 'text-teal-300' : 'text-red-200'} print:text-black`}>{issue.title}</div>
                                                        <p className="text-sm text-neutral-300 mb-2 leading-relaxed print:text-black">{issue.description}</p>
                                                        <div className="text-xs text-teal-400 flex items-start gap-1.5 print:text-black print:font-bold">
                                                            <CheckCircle2 size={14} className="mt-0.5 shrink-0"/>
                                                            <span>Suggestion: {issue.recommendation}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center text-neutral-500 text-xs py-4">No critical visual violations detected. Minor styling issues have been hidden.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* --- TAB 4: LEGAL (STRICT MODE) --- */}
                                <div className={`${activeTab === 'legal' ? 'block' : 'hidden'} print:block print:break-inside-avoid animate-in slide-in-from-bottom-2`}>
                                    <div className="hidden print:flex items-center gap-2 border-b border-black pb-2 mb-4 mt-8">
                                        <ShieldAlert size={18} className="text-black"/>
                                        <h2 className="text-lg font-bold text-black uppercase tracking-tight">4. Legal & Compliance</h2>
                                    </div>
                                    
                                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8 flex items-start gap-4 print:border-gray-300 print:bg-white">
                                        <div className="bg-red-500/20 p-3 rounded-full print:border print:border-black print:bg-white">
                                            <ShieldAlert className="w-8 h-8 text-red-500 print:text-black" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-red-400 print:text-black">Strict Compliance Warning</h3>
                                            <p className="text-red-300/80 text-sm mt-1 print:text-black">
                                                Showing only violations of enforced statutes in <span className="font-bold text-white underline">{selectedCountries[0]}</span>. General warnings have been hidden.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {legalIssues.length > 0 ? legalIssues.map((issue, index) => (
                                            <div key={index} className="flex flex-col md:flex-row bg-neutral-900/30 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors print:bg-white print:border-gray-300 print:shadow-sm">
                                                {/* Severity Strip */}
                                                <div className={`w-full md:w-24 flex items-center justify-center p-4 md:p-0 bg-red-600/80 print:bg-white print:border-r print:border-gray-300`}>
                                                    <div className="text-center text-white print:text-black">
                                                        <Scale className="w-8 h-8 mx-auto mb-1" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Risk</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 p-6">
                                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                        <div>
                                                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide print:text-black">Legal Category</span>
                                                            <h4 className="text-xl font-bold text-white print:text-black">{issue.title}</h4>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <div className="bg-neutral-800 px-3 py-1 rounded-md border border-neutral-700 flex items-center gap-2 max-w-xs print:bg-white print:border-black">
                                                                <Gavel className="w-4 h-4 text-neutral-400 print:text-black" />
                                                                <span className="text-xs font-semibold text-neutral-300 truncate print:text-black">Violation Detected</span>
                                                            </div>
                                                            {/* 🔥 SPECIFIC LAW BADGE */}
                                                            {issue.lawReference && (
                                                                <div className="bg-red-950/50 text-red-400 px-2 py-0.5 rounded text-[10px] border border-red-500/30 print:text-red-700 print:border-red-700 font-mono">
                                                                    ACT: {issue.lawReference}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h5 className="text-sm font-bold text-neutral-300 mb-2 flex items-center gap-2 print:text-black">
                                                                <Info className="w-4 h-4" /> Description
                                                            </h5>
                                                            <p className="text-neutral-400 text-sm leading-relaxed print:text-black">
                                                                {issue.desc}
                                                            </p>
                                                        </div>
                                                        <div className="bg-teal-900/10 p-4 rounded-lg border border-teal-500/20 print:bg-white print:border print:border-gray-300">
                                                            <h5 className="text-sm font-bold text-teal-400 mb-2 flex items-center gap-2 print:text-black">
                                                                <CheckCircle2 className="w-4 h-4" /> Required Action
                                                            </h5>
                                                            <p className="text-teal-200/80 text-sm font-medium print:text-black">
                                                                Immediate review with legal team required to avoid penalties under {issue.lawReference}.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-xl bg-black/20">
                                                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4"/>
                                                <h3 className="text-white font-bold">No Statute Violations Detected</h3>
                                                <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
                                                    Based on our scan, the visual assets do not clearly violate {COUNTRY_LAW_MAP[selectedCountries[0] || "Global"]?.privacy} or related statutes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
        
        @media print {
            body { background: white !important; color: black !important; font-family: "Inter", Helvetica, Arial, sans-serif; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            main { margin-left: 0 !important; width: 100% !important; height: auto !important; display: block !important; }
            .h-screen { height: auto !important; }
            .xl\\:col-span-8 { width: 100% !important; border: none !important; background: white !important; overflow: visible !important; }
            .text-white, .text-neutral-200, .text-neutral-300, .text-teal-400, .text-teal-300 { color: black !important; }
            .bg-neutral-900, .bg-black { background-color: white !important; border: 1px solid #ddd !important; }
            .border-neutral-800 { border-color: #eee !important; }
        }
      `}</style>
    </div>
  );
}