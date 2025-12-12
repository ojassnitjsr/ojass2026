"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Wifi, Activity, Terminal, Zap, Users, Code, Layers, Hexagon, Radio, Share2, Box, Coffee, Linkedin, Mail } from 'lucide-react';

// --- Team Data Configuration ---
const teamData = [
  { name: "Vishal", role: "Convenor", icon: Shield, color: "text-cyan-400", borderColor: "border-cyan-400", linkedin: "#", email: "mailto:vishal@example.com" },
  { name: "Anurag Das", role: "Convenor", icon: Shield, color: "text-cyan-400", borderColor: "border-cyan-400", linkedin: "#", email: "mailto:anurag@example.com" },
  { name: "Haritima Sinha", role: "Joint Tech Secretary", icon: Cpu, color: "text-purple-400", borderColor: "border-purple-400", linkedin: "#", email: "mailto:haritima@example.com" },
  { name: "Ankit Kumar", role: "General Secretary", icon: Terminal, color: "text-yellow-400", borderColor: "border-yellow-400", linkedin: "#", email: "mailto:ankit@example.com" },
  { name: "Shrestha Agrawal", role: "General Secretary", icon: Terminal, color: "text-yellow-400", borderColor: "border-yellow-400", linkedin: "#", email: "mailto:shrestha@example.com" },
  { name: "Prince Kumar", role: "Executive Secretary", icon: Activity, color: "text-emerald-400", borderColor: "border-emerald-400", linkedin: "#", email: "mailto:prince@example.com" },
  { name: "Priyanshu Raj", role: "Joint Secretary", icon: Layers, color: "text-blue-400", borderColor: "border-blue-400", linkedin: "#", email: "mailto:priyanshu.r@example.com" },
  { name: "Aditya Pal", role: "Joint Secretary", icon: Layers, color: "text-blue-400", borderColor: "border-blue-400", linkedin: "#", email: "mailto:aditya@example.com" },
  { name: "Prem Raj", role: "Web & App Head", icon: Code, color: "text-pink-500", borderColor: "border-pink-500", linkedin: "#", email: "mailto:prem@example.com" },
  { name: "Shristy Singh", role: "CA Head", icon: Users, color: "text-rose-400", borderColor: "border-rose-400", linkedin: "#", email: "mailto:shristy@example.com" },
  { name: "Divyanshu Prasad", role: "CA Head", icon: Users, color: "text-rose-400", borderColor: "border-rose-400", linkedin: "#", email: "mailto:divyanshu@example.com" },
  { name: "Avinash Kanaujia", role: "PR Head", icon: Share2, color: "text-orange-400", borderColor: "border-orange-400", linkedin: "#", email: "mailto:avinash@example.com" },
  { name: "Prinshu Gupta", role: "PR Head", icon: Share2, color: "text-orange-400", borderColor: "border-orange-400", linkedin: "#", email: "mailto:prinshu@example.com" },
  { name: "Lokesh Kumar Kori", role: "EM Head", icon: Zap, color: "text-indigo-400", borderColor: "border-indigo-400", linkedin: "#", email: "mailto:lokesh@example.com" },
  { name: "Pritish Nair", role: "EM Head", icon: Zap, color: "text-indigo-400", borderColor: "border-indigo-400", linkedin: "#", email: "mailto:pritish@example.com" },
  { name: "Ayushi Kumari", role: "Creative Head", icon: Hexagon, color: "text-fuchsia-400", borderColor: "border-fuchsia-400", linkedin: "#", email: "mailto:ayushi@example.com" },
  { name: "Priyanshu Vats", role: "Logistics Head", icon: Box, color: "text-amber-600", borderColor: "border-amber-600", linkedin: "#", email: "mailto:priyanshu.v@example.com" },
  { name: "Anuj Bajpai", role: "Hospitality Head", icon: Coffee, color: "text-teal-400", borderColor: "border-teal-400", linkedin: "#", email: "mailto:anuj@example.com" },
];

// --- Helper Components ---

const GlitchText = ({ text, className }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse group-hover:translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse group-hover:-translate-x-[2px]">
        {text}
      </span>
    </div>
  );
};

const TechCorner = ({ className }) => (
  <svg className={`absolute w-4 h-4 ${className}`} viewBox="0 0 20 20" fill="none">
    <path d="M1 1H19V6M1 1V19H6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const MemberCard = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = member.icon;

  // Placeholder image generator (Use real images in production)
  const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0f172a&color=fff&size=256&bold=true`;

  return (
    <div 
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connecting Lines (Visual flair) */}
      <div className={`absolute -top-4 left-1/2 w-[1px] h-4 bg-gray-800 transition-all duration-300 ${isHovered ? 'bg-cyan-500 h-8 -top-8' : ''}`}></div>
      
      {/* Main Card Container */}
      <div className={`
        relative bg-slate-900/80 backdrop-blur-md 
        border border-slate-700 hover:border-cyan-500/50 
        transition-all duration-300 ease-out
        overflow-hidden
        flex flex-col items-center
        p-6
        h-full
        clip-path-polygon
      `}>
        
        {/* Background Scanline Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
        
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

        {/* HUD Corners */}
        <div className={`absolute top-0 left-0 p-2 transition-colors duration-300 ${isHovered ? 'text-cyan-400' : 'text-slate-600'}`}>
          <TechCorner />
        </div>
        <div className={`absolute top-0 right-0 p-2 rotate-90 transition-colors duration-300 ${isHovered ? 'text-cyan-400' : 'text-slate-600'}`}>
          <TechCorner />
        </div>
        <div className={`absolute bottom-0 right-0 p-2 rotate-180 transition-colors duration-300 ${isHovered ? 'text-cyan-400' : 'text-slate-600'}`}>
          <TechCorner />
        </div>
        <div className={`absolute bottom-0 left-0 p-2 -rotate-90 transition-colors duration-300 ${isHovered ? 'text-cyan-400' : 'text-slate-600'}`}>
          <TechCorner />
        </div>

        {/* Floating Status Label */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
           <span className={`text-[10px] font-mono uppercase tracking-widest ${isHovered ? 'text-cyan-400' : 'text-slate-500'}`}>
             {isHovered ? 'ONLINE' : 'IDLE'}
           </span>
           <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></div>
        </div>

        {/* Image Section */}
        <div className="relative z-10 mb-4 group-hover:scale-105 transition-transform duration-300">
          <div className={`relative w-24 h-24 rounded-full p-1 border-2 border-dashed ${isHovered ? 'border-cyan-400 animate-[spin_10s_linear_infinite]' : 'border-slate-600'}`}>
             <div className="absolute inset-0 rounded-full border border-slate-800"></div>
          </div>
          <div className="absolute top-1 left-1 w-22 h-22 rounded-full overflow-hidden">
            <img 
              src={imageUrl} 
              alt={member.name} 
              className={`w-22 h-22 rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300`}
            />
            {/* Hologram overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-50"></div>
          </div>
          
          {/* Role Icon Badge */}
          <div className={`absolute -bottom-2 -right-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700 ${member.color}`}>
             <Icon size={16} />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center z-10 relative w-full">
          <div className="mb-1">
            <span className={`text-xs font-mono uppercase tracking-widest ${member.color} bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800`}>
              {member.role}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-sans tracking-wide mt-2">
            <GlitchText text={member.name} />
          </h3>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-4 mt-3 mb-2">
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/30 transition-all duration-300 group/icon"
              aria-label={`${member.name}'s LinkedIn`}
            >
              <Linkedin size={16} className="group-hover/icon:scale-110 transition-transform" />
            </a>
            <a 
              href={member.email}
              className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/30 transition-all duration-300 group/icon"
              aria-label={`Email ${member.name}`}
            >
              <Mail size={16} className="group-hover/icon:scale-110 transition-transform" />
            </a>
          </div>
          
          {/* Faux Data Bars */}
          <div className="mt-2 w-full space-y-1 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
             <div className="flex items-center justify-between text-[9px] font-mono text-cyan-300">
               <span>SYNC</span>
               <span>98%</span>
             </div>
             <div className="w-full h-0.5 bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-500 w-[98%]"></div>
             </div>
             <div className="flex items-center justify-between text-[9px] font-mono text-cyan-300">
               <span>PWR</span>
               <span>100%</span>
             </div>
             <div className="w-full h-0.5 bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 w-full"></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Grid Floor */}
         <div 
            className="absolute inset-0 opacity-20"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #1e293b 1px, transparent 1px),
                    linear-gradient(to bottom, #1e293b 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                transformOrigin: 'top center'
            }}
         />
         {/* Vignette */}
         <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#05050a]"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-16 pb-8 text-center">
        <div className="inline-flex items-center space-x-2 mb-4 px-4 py-1 rounded-full border border-cyan-900 bg-cyan-950/30 backdrop-blur-sm">
           <Radio size={14} className="text-cyan-400 animate-pulse" />
           <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">System Online // Personnel Database</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CORE TEAM</span>
          <span className="text-slate-600 mx-2">///</span>
          <span className="outline-text">MEMBERS</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-mono text-sm">
          Authorized personnel only. Establishing secure connection to team mainframe.
        </p>
      </header>

      {/* Grid Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Decorative Top Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {teamData.map((member, index) => (
            <MemberCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Decorative Bottom Details */}
        <div className="mt-16 flex justify-between items-center border-t border-slate-800 pt-8 text-xs font-mono text-slate-600">
           <div className="flex items-center space-x-4">
              <span>SYS.VER.4.0.2</span>
              <span className="hidden md:inline">LATENCY: 12ms</span>
           </div>
           <div className="flex items-center space-x-2">
              <Wifi size={14} />
              <span>ENCRYPTED CONNECTION</span>
           </div>
        </div>
      </main>

      <style>{`
        .clip-path-polygon {
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            0 100%
          );
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, #05050a 100%);
        }
      `}</style>
    </div>
  );
};

export default App;