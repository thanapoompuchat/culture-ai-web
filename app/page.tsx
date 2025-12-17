import Image from "next/image";

// Component การ์ด (Bento Box) ปรับสี Glow เป็นสีฟ้ามิ้นท์ (cyan/teal)
const BentoCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between hover:border-cyan-400/50 transition-colors duration-500 group ${className}`}>
    {/* Glow Effect สีมิ้นท์ */}
    <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden">
      
      {/* --- Background Gradients (แสงออโรร่าสีน้ำทะเล) --- */}
      {/* มุมซ้ายบน: สีฟ้ามิ้นท์สว่าง */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-500/20 blur-[130px] rounded-full pointer-events-none" />
      {/* มุมขวาล่าง: สีน้ำเงินลึก */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none" />

      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center mb-16 max-w-7xl mx-auto backdrop-blur-md bg-white/5 px-6 py-4 rounded-full border border-white/10 z-50 relative">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-1">
          CULTURE<span className="text-teal-400">AI</span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-neutral-400 font-medium">
          <a href="#" className="hover:text-teal-300 transition">Product</a>
          <a href="#" className="hover:text-teal-300 transition">Solutions</a>
          <a href="#" className="hover:text-teal-300 transition">Pricing</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-teal-50 transition">
          Get Started
        </button>
      </nav>

      {/* --- Main Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-[200px]">
        
        {/* LEFT HERO */}
        <div className="lg:col-span-5 lg:row-span-3 flex flex-col justify-center pr-8 space-y-6 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-medium w-fit shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            AI-Powered Design Analysis
          </div>
          
          {/* Headline Gradient สีมิ้นท์-ฟ้า */}
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight">
            Design for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500">
              Global Culture
            </span>
          </h1>
          
          <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
            Validate your UI designs against cultural norms. 
            Analyze <span className="text-teal-200">colors, symbols, and layouts</span> instantly with our Sea-Mint Engine.
          </p>

          <div className="flex gap-4 pt-4">
            {/* ปุ่มหลักสีมิ้นท์สว่าง */}
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-bold text-lg hover:brightness-110 transition shadow-[0_0_25px_rgba(45,212,191,0.4)]">
              Try Check Now
            </button>
          </div>
        </div>

        {/* RIGHT BENTO GRID */}

        {/* Box 1: Score Card */}
        <BentoCard className="lg:col-span-3 lg:row-span-2 bg-gradient-to-br from-neutral-900 to-neutral-800/80">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">Culture Score</span>
              <span className="text-cyan-400 flex items-center gap-1">
                ▲ 98%
              </span>
            </div>
            <div className="text-center my-auto relative">
              {/* วงแหวนเรืองแสงข้างหลังตัวเลข */}
              <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full"></div>
              <div className="relative text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-teal-200 mb-2">96</div>
              <div className="text-sm text-teal-100/70">Excellent Fit</div>
            </div>
            {/* กราฟแท่งสีมิ้นท์ไล่ระดับ */}
            <div className="flex items-end gap-1 h-12 justify-center opacity-80">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <div key={i} className="w-2 rounded-t-sm bg-gradient-to-t from-teal-600 to-cyan-300" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Box 2: Image Card */}
        <BentoCard className="lg:col-span-4 lg:row-span-2 !p-0 group">
           {/* เปลี่ยนรูปเป็นแนวทะเล/ตึกกระจก ให้เข้าธีม */}
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1483794344563-d27a8d1801ac?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center transition duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0">
             <div className="absolute inset-0 bg-cyan-900/30 mix-blend-overlay"></div>
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <p className="font-medium text-teal-100">Modern Architecture</p>
                <p className="text-xs text-cyan-400">Analysis Complete</p>
             </div>
           </div>
        </BentoCard>

        {/* Box 3: Feature Icon */}
        <BentoCard className="lg:col-span-2 lg:row-span-1 flex items-center justify-center">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(20,184,166,0.15)]">
               🌊
             </div>
             <p className="mt-3 text-sm font-medium text-teal-100">Sea Flow</p>
        </BentoCard>

        {/* Box 4: Analysis Text */}
        <BentoCard className="lg:col-span-3 lg:row-span-1">
             <h3 className="text-lg font-semibold mb-1 text-teal-50">Deep Analysis</h3>
             <p className="text-xs text-neutral-400">
               Checking fit for <span className="text-cyan-400">Thailand</span> region...
             </p>
             <div className="mt-4 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
               <div className="h-full bg-teal-400 w-3/4 animate-pulse"></div>
             </div>
        </BentoCard>

        {/* Box 5: Call to Action small */}
        <BentoCard className="lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-teal-500 to-cyan-600 !border-teal-400 group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="flex items-center justify-center h-full text-white font-bold text-xl relative z-10 gap-2">
              Start <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
        </BentoCard>

      </div>
    </main>
  );
}