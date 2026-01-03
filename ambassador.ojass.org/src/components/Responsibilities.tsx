"use client";

import { motion } from "framer-motion";
import { UserPlus, Share2, ClipboardCheck, Trophy } from "lucide-react";

const Responsibilities = () => {
  const responsibilities = [
    {
      icon: UserPlus,
      title: "1. Register Yourself",
      description: "First, register on ojass.org to generate your unique OJASS ID. This will be your Referral Code.",
    },
    {
      icon: Share2,
      title: "2. Share Your ID",
      description: "Promote OJASS among your network. Share your unique OJASS ID with friends and classmates.",
    },
    {
      icon: ClipboardCheck,
      title: "3. Ensure Correct Entry",
      description: "Make sure they enter YOUR OJASS ID in the 'Referral ID' field when they register on the portal.",
    },
    {
      icon: Trophy,
      title: "4. Unlock & Earn",
      description: "Hit 8 referrals to unlock 100% fee reimbursement and VIP access. Keep tracking your progress!",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-[#FF8C00]">Works</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple 4-step process to become a Campus Ambassador and claim your rewards.
          </p>
        </motion.div>

        {/* Responsibilities Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {responsibilities.map((responsibility, index) => {
            const Icon = responsibility.icon;
            return (
              <motion.div
                key={responsibility.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF8C00] transition-colors">
                    {responsibility.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {responsibility.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Responsibilities;

