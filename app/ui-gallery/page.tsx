"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  Search, 
  ArrowLeft, 
  Heart, 
  Eye, 
  Bookmark, 
  User,
  LogOut,
  Layers
} from "lucide-react";

// --- Interface ---
interface DesignItem {
  id: number;
  title: string;
  author: string;
  authorAvatar: string; // เพิ่มรูปคนทำให้ดูเหมือนเว็บ community จริง
  category: string;
  image: string;
  likes: number;
  views: string;
}

// --- Curated UI/UX Data (คัดเฉพาะรูปที่เป็น UI Design จริงๆ) ---
const ALL_DESIGN_ITEMS: DesignItem[] = [
  { 
    id: 1, 
    title: "Crypto Dashboard Dark Mode", 
    author: "Aurélien Salomon", 
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "Dashboard", 
    image: "https://cdn.dribbble.com/users/1615584/screenshots/15710069/media/1d9d5926c4a6a575cb2e1e0d3cb21df3.jpg?resize=1000x750&vertical=center", 
    likes: 1240,
    views: "12.5k"
  },
  { 
    id: 2, 
    title: "Travel App Concept", 
    author: "Paperpillar", 
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    category: "Mobile", 
    image: "https://cdn.dribbble.com/users/653699/screenshots/15383548/media/6a0c0f8a846f363c3294354c00994f79.png?resize=1000x750&vertical=center", 
    likes: 854,
    views: "8.2k"
  },
  { 
    id: 3, 
    title: "Smart Home Control", 
    author: "Halo Lab", 
    authorAvatar: "https://randomuser.me/api/portraits/men/85.jpg",
    category: "IOT", 
    image: "https://cdn.dribbble.com/users/418188/screenshots/16386408/media/c8e3d938556c323602d1d052a6504246.png?resize=1000x750&vertical=center", 
    likes: 2300,
    views: "21k"
  },
  { 
    id: 4, 
    title: "E-Commerce Mobile App", 
    author: "Tubik", 
    authorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    category: "Mobile", 
    image: "https://cdn.dribbble.com/users/418188/screenshots/14470438/media/3c2a4729f273295b9d33f2e15cb992ae.png?resize=1000x750&vertical=center", 
    likes: 543,
    views: "5.1k"
  },
  { 
    id: 5, 
    title: "Finance & Banking Web", 
    author: "Fireart Studio", 
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    category: "Web", 
    image: "https://cdn.dribbble.com/users/1253245/screenshots/15724252/media/4c7676644407b9a52865955615757966.jpg?resize=1000x750&vertical=center", 
    likes: 900,
    views: "9.9k"
  },
  { 
    id: 6, 
    title: "NFT Marketplace UI", 
    author: "Odama", 
    authorAvatar: "https://randomuser.me/api/portraits/men/11.jpg",
    category: "Dashboard", 
    image: "https://cdn.dribbble.com/users/5031392/screenshots/15509984/media/673752763f08d62680197ee4ca299c85.png?resize=1000x750&vertical=center", 
    likes: 3100,
    views: "34k"
  },
  { 
    id: 7, 
    title: "Food Delivery App", 
    author: "Riotters", 
    authorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    category: "Mobile", 
    image: "https://cdn.dribbble.com/users/2564256/screenshots/15536553/media/c869c3a3782782b784a0d87920199709.png?resize=1000x750&vertical=center", 
    likes: 670,
    views: "6.5k"
  },
  { 
    id: 8, 
    title: "SaaS Landing Page", 
    author: "Tran Mau Tri Tam", 
    authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    category: "Web", 
    image: "https://cdn.dribbble.com/users/1627885/screenshots/16568864/media/311746f32e01df2855219f4a8677c784.png?resize=1000x750&vertical=center", 
    likes: 1500,
    views: "15k"
  },
  { 
    id: 9, 
    title: "Health Tracker Dashboard", 
    author: "Keitoto", 
    authorAvatar: "https://randomuser.me/api/portraits/women/21.jpg",
    category: "Dashboard", 
    image: "https://cdn.dribbble.com/users/1615584/screenshots/14691459/media/252924375b472e35b719002235c36398.jpg?resize=1000x750&vertical=center", 
    likes: 420,
    views: "4.8k"
  },
  { 
    id: 10, 
    title: "Car Dashboard Interface", 
    author: "Glow Team", 
    authorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    category: "IOT", 
    image: "https://cdn.dribbble.com/users/4804374/screenshots/15368625/media/371e7d23d838964893798993f88b56f2.png?resize=1000x750&vertical=center", 
    likes: 880,
    views: "7.7k"
  },
  { 
    id: 11, 
    title: "Fashion Store Mobile", 
    author: "Zeyox Studio", 
    authorAvatar: "https://randomuser.me/api/portraits/women/90.jpg",
    category: "Mobile", 
    image: "https://cdn.dribbble.com/users/2564256/screenshots/14986427/media/592314644a95638c41f71dfac5a78635.png?resize=1000x750&vertical=center", 
    likes: 2100,
    views: "18k"
  },
  { 
    id: 12, 
    title: "Music Player App", 
    author: "Piqo Design", 
    authorAvatar: "https://randomuser.me/api/portraits/men/66.jpg",
    category: "Mobile", 
    image: "https://cdn.dribbble.com/users/5031392/screenshots/11885536/media/9d604928f6424df99c4c44246062f275.png?resize=1000x750&vertical=center", 
    likes: 1100,
    views: "11k"
  },
];

const CATEGORIES = ["All", "Mobile", "Web", "Dashboard", "IOT", "Saved"];

export default function UIGallery() {
  const router = useRouter();
  
  // --- Auth & Data State ---
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  // Check Login
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();
  }, []);

  // --- Actions ---
  const toggleLike = (id: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleSave = (id: number) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // หรือจะให้ refresh อยู่หน้าเดิมก็ได้
    window.location.reload(); 
  };

  // Filter Items
  const filteredItems = ALL_DESIGN_ITEMS.filter((item) => {
    const isSavedTab = activeCategory === "Saved";
    if (isSavedTab && !savedItems.has(item.id)) return false;
    
    const matchesCategory = isSavedTab || activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-pink-500/30">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Logo & Back */}
            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors">
                    <ArrowLeft size={20} className="text-neutral-400" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-bold text-black">
                        Dr
                    </div>
                    <span className="font-bold text-lg tracking-tight">DribbbleClone</span>
                </div>
            </div>

            {/* Search & Categories */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto w-full">
                 {/* Categories */}
                 <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat 
                            ? "bg-neutral-800 text-white" 
                            : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-neutral-900 border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-pink-500/50 outline-none placeholder:text-neutral-600 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="group relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-[2px] cursor-pointer">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                {/* ใช้ User Icon แทนรูปจริงไปก่อน */}
                                <User size={20} /> 
                            </div>
                        </div>
                        {/* Hover Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right">
                             <div className="px-3 py-2 border-b border-neutral-800 mb-2">
                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                             </div>
                             <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                                <LogOut size={16} /> Sign Out
                             </button>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
                        Sign In
                    </Link>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* --- GALLERY GRID (Masonry Style) --- */}
      <main className="max-w-[1800px] mx-auto px-6 py-8 pb-20">
        
        {filteredItems.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
             <Layers className="w-16 h-16 mb-4 opacity-20" />
             <p>No shots found.</p>
           </div>
        ) : (
            // ใช้ columns-count เพื่อทำ Masonry Layout (เรียงสับหว่าง)
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                {filteredItems.map((item) => (
                    <div key={item.id} className="break-inside-avoid group relative">
                        
                        {/* 1. Image Card */}
                        <div className="relative rounded-lg overflow-hidden bg-neutral-900 mb-3">
                            {/* รูปภาพ */}
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Overlay (โชว์ตอน Hover) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-white font-bold text-lg truncate w-2/3">{item.title}</span>
                                    
                                    <div className="flex gap-2">
                                        {/* ปุ่ม Save */}
                                        <button 
                                            onClick={(e) => { e.preventDefault(); toggleSave(item.id); }}
                                            className={`p-2 rounded-lg bg-white text-black hover:scale-110 transition-transform ${savedItems.has(item.id) ? 'bg-pink-500 text-white' : ''}`}
                                            title="Save"
                                        >
                                            <Bookmark size={18} className={savedItems.has(item.id) ? "fill-current" : ""} />
                                        </button>
                                        {/* ปุ่ม Like */}
                                        <button 
                                            onClick={(e) => { e.preventDefault(); toggleLike(item.id); }}
                                            className={`p-2 rounded-lg bg-white text-black hover:scale-110 transition-transform ${likedItems.has(item.id) ? 'bg-red-500 text-white' : ''}`}
                                            title="Like"
                                        >
                                            <Heart size={18} className={likedItems.has(item.id) ? "fill-current" : ""} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Info Below Image (Dribbble Style) */}
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <img src={item.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover bg-neutral-800" />
                                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors cursor-pointer">
                                    {item.author}
                                </span>
                                <span className="bg-neutral-800 text-[10px] px-1 rounded text-neutral-400 uppercase font-bold">Pro</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                                <div className="flex items-center gap-1 group-hover:text-pink-500 transition-colors">
                                    <Heart size={12} className={likedItems.has(item.id) ? "fill-pink-500 text-pink-500" : "fill-current"} />
                                    <span>{likedItems.has(item.id) ? item.likes + 1 : item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye size={12} className="fill-current" />
                                    <span>{item.views}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}