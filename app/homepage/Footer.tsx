"use client"

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Trophy, 
  Shield, 
  ArrowRight,
  Send,
  Globe,
  Phone
} from 'lucide-react';

const Footer = () => {
  const competitions = [
    { name: "Vice Chancellor's Cup", isLive: true },
    { name: "Freshers League", isLive: false },
    { name: "Faculty Super 8", isLive: true },
    { name: "Inter-Departmental", isLive: false },
    { name: "SUG Games", isLive: false }
  ];

  const topFaculties = [
    'Faculty of Science',
    'Faculty of Law',
    'Social Sciences',
    'Management Sciences',
    'School of Transport',
    'College of Medicine'
  ];

  const quickLinks = [
    { name: 'Live Scores', path: '/live' },
    { name: 'Standings', path: '/standings' },
    { name: 'Fixtures', path: '/fixtures' },
    { name: 'Statistics', path: '/stats' },
    { name: 'Top Scorers', path: '/top-scorers' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        
        {/* Top Accent Strip */}
        <div className="w-full bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-600/10 border-t-2 border-amber-500/30 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" />
                <span className="text-sm font-bold text-white">
                  Official Sports Hub of LASU
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-400 tracking-wide">
                Student Union  • Sports Directorate
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Column 1: Brand & Newsletter */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-6">
              <div className="space-y-3">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="relative flex items-center justify-center w-12 h-12 bg-linear-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-amber-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <Trophy size={28} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-black bg-linear-to-r from-amber-400 via-orange-300 to-red-500 bg-clip-text text-transparent tracking-tight">
                      LASU SPORTS
                    </h2>
                    <p className="text-xs font-bold text-amber-400 tracking-widest">
                      CAMPUS ATHLETICS
                    </p>
                  </div>
                </Link>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time scores, live updates, and comprehensive statistics from every faculty and departmental match on campus.
              </p>

              {/* Newsletter Subscription */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  📬 Match Alerts & Updates
                </label>
                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 hover:border-amber-500/50 transition-colors">
                  <input 
                    type="email" 
                    placeholder="lasuballersunion@gmail.com" 
                    className="bg-transparent flex-1 text-sm text-white placeholder-slate-500 outline-none px-3 py-2"
                  />
                  <button className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-2 rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Competitions */}
            <div>
              <h3 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-sm">
                <div className="w-1 h-6 bg-linear-to-r from-amber-500 to-orange-600 rounded-full"></div>
                Competitions
              </h3>
              <ul className="space-y-3">
                {competitions.map((comp, index) => (
                  <li key={index}>
                    <Link 
                      href="#" 
                      className="group flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {comp.name}
                      </span>
                      {comp.isLive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-linear-to-r from-red-600 to-red-500 px-2 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                          ● LIVE
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h3 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-sm">
                <div className="w-1 h-6 bg-linear-to-r from-orange-500 to-red-600 rounded-full"></div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.path} 
                      className="text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Top Faculties */}
            <div>
              <h3 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-sm">
                <div className="w-1 h-6 bg-linear-to-r from-blue-500 to-purple-600 rounded-full"></div>
                Top Faculties
              </h3>
              <ul className="space-y-2">
                {topFaculties.slice(0, 5).map((faculty, index) => (
                  <li key={index}>
                    <Link 
                      href="/faculties" 
                      className="flex items-center gap-3 text-sm group"
                    >
                      <span className="flex items-center justify-center w-6 h-6 bg-linear-to-br from-amber-500 to-orange-600 rounded-md text-xs font-bold text-white shadow-lg group-hover:shadow-amber-500/50 transition-all duration-200">
                        {index + 1}
                      </span>
                      <span className="text-slate-400 group-hover:text-white transition-colors duration-200">
                        {faculty}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link 
                    href="/" 
                    className="text-xs font-black text-amber-500 hover:text-amber-400 flex items-center gap-1. 5 group"
                  >
                    VIEW ALL 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Contact & Social */}
            <div>
              <h3 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-sm">
                <div className="w-1 h-6 bg-linear-to-r from-green-500 to-emerald-600 rounded-full"></div>
                Connect
              </h3>
              
              <div className="space-y-5">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-amber-500/20 flex-shrink-0 mt-0.5 group-hover:bg-amber-500/40 transition-colors">
                      <MapPin size={16} className="text-amber-500" />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                      Sports center LASU Ojo<br/>Lagos State, Nigeria
                    </span>
                  </div>

                  <a href="tel:+2341234567890" className="flex items-center gap-3 group">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-orange-500/20 flex-shrink-0 group-hover:bg-orange-500/40 transition-colors">
                      <Phone size={16} className="text-orange-500" />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                      +2348125966950
                    </span>
                  </a>

                  <a href="mailto:sports@lasu.edu. ng" className="flex items-center gap-3 group">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/20 flex-shrink-0 group-hover:bg-red-500/40 transition-colors">
                      <Mail size={16} className="text-red-500" />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                      sports@lasu
                    </span>
                  </a>
                </div>

                {/* Social Icons */}
                <div className="flex gap-2 pt-2">
                  {socialLinks.map(({ icon: Icon, label, href }, i) => (
                    <a 
                      key={i} 
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-linear-to-br hover:from-amber-500 hover:to-orange-600 hover:text-white hover:border-amber-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-amber-500/50"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-16 pt-8 border-t border-slate-800/50"></div>

          {/* Footer Bottom */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-slate-500 text-xs text-center lg:text-left space-y-2">
              <p>
                &copy; {new Date().getFullYear()} LASU Sports Hub. All rights reserved.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start text-slate-600">
                <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Privacy Policy</Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Terms of Service</Link>
                <span className="text-slate-700">•</span>
                <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Contact</Link>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="inline-flex items-center gap-3 px-4 py-2. 5 bg-linear-to-r from-slate-900 to-slate-800 rounded-full border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 shadow-lg">
              <span className="w-2. 5 h-2.5 bg-linear-to-r from-amber-500 to-orange-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></span>
              <span className="text-xs font-medium text-slate-400">
                Built with <span className="text-amber-400 font-bold">❤️</span> by
              </span>
              <a 
                href="/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white hover:text-amber-400 transition-colors"
              >
                @codebyriven
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;