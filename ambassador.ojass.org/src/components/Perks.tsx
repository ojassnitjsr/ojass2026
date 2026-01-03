"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Award,
  Briefcase,
  Network,
  MessageSquare,
  FileText,
} from "lucide-react";

const Perks = () => {
  const perks = [
    {
      icon: Gift,
      title: "Referral Champion Rewards",
      description: "Bring 8 Referrals to get 100% Registration Fee Reimbursement & Front Row Seats in all segments!",
      className: "md:col-span-2",
      gradient: "from-orange-500/10 to-amber-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: Award,
      title: "Internship Certificate",
      description: "Earn a certified internship certificate upon completion.",
      className: "md:col-span-1",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Briefcase,
      title: "Sponsor Internships",
      description: "Unlock opportunities with OJASS’s prestigious partners.",
      className: "md:col-span-1",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: Network,
      title: "Networking & Endorsements",
      description: "Connect with alumni, industry leaders, and gain LinkedIn endorsements.",
      className: "md:col-span-2",
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-600",
    },
    {
      icon: MessageSquare,
      title: "Monthly Shoutouts",
      description: "Get featured on OJASS social media for your contributions.",
      className: "md:col-span-1",
      gradient: "from-rose-500/10 to-red-500/10",
      iconColor: "text-rose-600",
    },
    {
      icon: FileText,
      title: "Letter of Recommendation",
      description: "Receive a personalized LOR recognizing your dedication and performance.",
      className: "md:col-span-2",
      gradient: "from-indigo-500/10 to-violet-500/10",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <section id="perks" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Perks & <span className="text-[#FF8C00]">Incentives</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Become a Part of OJASS Campus Ambassador Program — unlock
            perks, opportunities, and growth!
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${perk.className} overflow-hidden`}
              >
                {/* Hover Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-white/80 transition-colors duration-300 mb-4 shadow-sm`}
                    >
                      <Icon className={`w-6 h-6 ${perk.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                      {perk.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700">
                      {perk.description}
                    </p>
                  </div>


                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Perks;

