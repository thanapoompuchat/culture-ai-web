"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, AlertTriangle, CheckCircle2, Globe2 } from "lucide-react";

const caseStudies = [
  {
    id: 1, brand: "Mercedes-Benz", market: "China", meaning: "Rush to die", verdict: "RISK",
    desc: "Original translation implied 'rushing to death'. Rebranded to 'Bēnchí' (Run Fast).",
    color: "from-red-500/20 to-orange-500/5", border: "border-red-500/30", icon: <AlertTriangle className="text-red-400" />
  },
  {
    id: 2, brand: "Coca-Cola", market: "China", meaning: "Tasty Fun", verdict: "SAFE",
    desc: "Perfect phonetic matching + positive meaning. Originally 'Bite the wax tadpole'.",
    color: "from-green-500/20 to-emerald-500/5", border: "border-green-500/30", icon: <CheckCircle2 className="text-green-400" />
  },
  {
    id: 3, brand: "Lumia", market: "Spain", meaning: "Prostitute (Slang)", verdict: "WARNING",
    desc: "In Spanish slang, 'Lumia' can refer to a woman of the night.",
    color: "from-yellow-500/20 to-amber-500/5", border: "border-yellow-500/30", icon: <AlertTriangle className="text-yellow-400" />
  },
  {
    id: 4, brand: "Pee Cola", market: "Ghana", meaning: "Pee (English)", verdict: "RISK",
    desc: "Popular in Ghana, but the name makes export to English markets impossible.",
    color: "from-red-500/20 to-orange-500/5", border: "border-red-500/30", icon: <AlertTriangle className="text-red-400" />
  }
];

export default function CaseStudyGallery() {
  return (
    <section className="py-20 relative text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Famous Failures & Wins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {caseStudies.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-neutral-900/50 border ${item.border} rounded-3xl p-6 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-full bg-black/50 border border-white/10">{item.icon}</div>
                <span className="text-xs font-bold uppercase bg-black/40 px-2 py-1 rounded border border-white/5 flex items-center gap-1">
                   <Globe2 size={12}/> {item.market}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{item.brand}</h3>
              <p className="text-sm text-neutral-400 mb-2 italic">"{item.meaning}"</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}