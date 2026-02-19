"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabaseClient"; // ✅ Import ตัวเชื่อมต่อ
import { 
  ScanEye, Lock, Mail, User, Github, Chrome, LogOut, ArrowLeft 
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // เก็บชื่อตอนสมัคร
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister) {
                // --- 🟢 LOGIC สมัครสมาชิก (Register) ---
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName, // เก็บชื่อไปด้วย
                        }
                    }
                });

                if (error) throw error;
                
                alert("Registration Successful! Please verify your email if required.");
                // สมัครเสร็จอาจจะให้ Login ต่อเลย หรือรอ confirm email ก็ได้
                // ในที่นี้สมมติว่าเข้าได้เลย (ถ้าปิด confirm email ใน supabase)
                if(data.session) {
                    router.push("/");
                } else {
                    // กรณีต้อง confirm email
                    setIsRegister(false); 
                }

            } else {
                // --- 🔵 LOGIC เข้าสู่ระบบ (Login) ---
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                // Login ผ่าน -> ไปหน้าแรก
                router.push("/"); 
            }
        } catch (error: any) {
            alert(error.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-sans text-white relative overflow-hidden selection:bg-teal-500/30">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"/>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"/>

            <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300 relative z-10">
                
                <Link href="/" className="absolute top-6 left-6 text-neutral-500 hover:text-white transition">
                    <ArrowLeft size={20} />
                </Link>

                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <ScanEye className="text-black" size={24}/>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-1">
                    {isRegister ? "Create Account" : "Login"}
                </h1>
                
                <p className="text-center text-neutral-500 text-sm mb-8">
                    {isRegister ? "Start analyzing your designs today" : "Login to continue your analysis"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {isRegister && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in">
                            <label className="text-xs font-bold text-neutral-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-neutral-500" size={16}/>
                                <input 
                                    type="text" 
                                    placeholder="John Doe" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/50 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 transition-colors placeholder:text-neutral-600"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-neutral-500" size={16}/>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com" 
                                className="w-full bg-black/50 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 transition-colors placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-neutral-400 ml-1">Password</label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-neutral-500" size={16}/>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full bg-black/50 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 transition-colors placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isLoading}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-2.5 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-teal-500/20 mt-4 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Processing..." : (isRegister ? "Sign Up" : "Login")}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-neutral-400">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button 
                        onClick={() => setIsRegister(!isRegister)} 
                        className="text-teal-400 hover:text-teal-300 font-bold ml-1 hover:underline"
                    >
                        {isRegister ? "Login" : "Sign up"}
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-400 transition-colors group">
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform"/>
                        Exit to Landing Page
                    </Link>
                </div>

            </div>
        </div>
    );
}