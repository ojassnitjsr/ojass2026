"use client";

import { motion } from "framer-motion";
import { Linkedin, Instagram, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return; // Only handle hash links
    e.preventDefault();
    
    const scrollDelay = window.innerWidth < 768 ? 300 : 50;
    
    setTimeout(() => {
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = window.scrollY + elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, scrollDelay);
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/ojass.nitjsr", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@ojass.nitjsr", label: "YouTube" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/ojassnitjsr/", label: "LinkedIn" },
    { icon: Facebook, href: "https://www.facebook.com/share/1CfzSfszvm/", label: "Facebook" },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent">
                OJASS
              </span>
              <span className="text-gray-400"> | CA</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Connecting campuses with innovation. Join the OJASS Campus Ambassador Program and be part of India&apos;s premier tech fest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="text-gray-400 hover:text-[#FF8C00] transition-colors cursor-pointer">
                  About
                </a>
              </li>
              <li>
                <a href="#perks" onClick={(e) => handleNavClick(e, "#perks")} className="text-gray-400 hover:text-[#FF8C00] transition-colors cursor-pointer">
                  Perks
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleNavClick(e, "#faq")} className="text-gray-400 hover:text-[#FF8C00] transition-colors cursor-pointer">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#register" onClick={(e) => handleNavClick(e, "#register")} className="text-gray-400 hover:text-[#FF8C00] transition-colors cursor-pointer">
                  Register
                </a>
              </li>
            </ul>
          </div>

          <div>
            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF8C00] hover:bg-gray-700 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                  <a href="mailto:ojass@nitjsr.ac.in" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                    ojass@nitjsr.ac.in
                  </a>, 
                  <a href="tel:+918340671871" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                    +918340671871
                  </a>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright and Designed By */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-400 mb-4 sm:mb-0">
            © OJASS 2026 | All rights reserved.
          </p>
          <p className="text-gray-400">
            Designed and Developed by{" "}
            <a
              href="https://digicraft.one"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8C00] hover:underline"
            >
              DigiCraft
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

