"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Github, Chrome } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[120px]"></div>

        <div className="w-full max-w-md bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-xl relative z-10 shadow-2xl">
            
            <Link href="/" className="absolute top-6 left-6 text-neutral-500 hover:text-white transition">
                <ArrowLeft size={20} />
            </Link>

            <div className="text-center mb-6 mt-4">
                <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                <p className="text-sm text-neutral-400 mt-2">Join CultureAI to analyze your global impact</p>
            </div>

            <form className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-neutral-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full bg-black/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-neutral-600" size={18} />
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            className="w-full bg-black/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-neutral-600" size={18} />
                        <input 
                            type="password" 
                            placeholder="Create a password" 
                            className="w-full bg-black/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition shadow-lg">
                        Create Account
                    </button>
                </div>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-900/50 px-2 text-neutral-500">Or register with</span></div>
            </div>

            <div className="flex justify-center gap-4">
                <button className="p-3 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition"><Chrome size={20} /></button>
                <button className="p-3 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition"><Github size={20} /></button>
            </div>

            <p className="text-center text-xs text-neutral-500 mt-6">
                Already have an account? <Link href="/login" className="text-teal-400 font-bold hover:underline">Log in</Link>
            </p>
        </div>
    </div>
  );
}