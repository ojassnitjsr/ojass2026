"use client";

import { motion } from "framer-motion";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    { icon: Instagram, href: "https://www.instagram.com/ojass.nitjsr/", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/Ojassnitjamshedpur/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/ojassnitjsr/", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@OJASS.NITJSR", label: "YouTube" },
  ];

  
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.webp" 
                alt="OJASS Logo" 
                width={70} 
                height={70}
                className="object-contain"
              />
              <h3 className="text-2xl font-bold">
                <span className="text-gray-400">Sponsorship</span>
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Partner with OJASS 2026 to reach an engaged student audience with on-ground and digital visibility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                  About
                </a>
              </li>
              <li>
                <a href="#why-sponsor" onClick={(e) => handleNavClick(e, "#why-sponsor")} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Why Sponsor
                </a>
              </li>
              <li>
                <a href="#packages" onClick={(e) => handleNavClick(e, "#packages")} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Packages
                </a>
              </li>
              <li>
                <a href="#past-sponsors" onClick={(e) => handleNavClick(e, "#past-sponsors")} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                  Past Sponsors
                </a>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://ojass.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Main OJASS Website
                </Link>
              </li>
              <li>
                <Link 
                  href="https://ca.ojass.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Campus Ambassador
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:corporate.ojass@nitjar.ac.in"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Sponsorship Inquiry
                </a>
              </li>
              <li>
                <Link 
                  href="/Ojass26_Brochure.pdf" 
                  download
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Download Brochure
                </Link>
              </li>
            </ul>
          </div>

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
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © OJASS 2026 | All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Designed and Developed by <span className="text-blue-400 font-semibold"><Link href="https://digicraft.one" target="_blank">Digicraft</Link></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

