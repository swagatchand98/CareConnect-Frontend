'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CareConnect
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Connecting families with trusted caregivers for compassionate, professional care that feels like family.
              </p>
            </div>
            
            {/* Trust Badges */}
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-3">Trusted & Certified</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/30">
                  Licensed
                </span>
                <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/30">
                  Insured
                </span>
                <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/30">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 border border-slate-600/30 hover:border-blue-500"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/services', label: 'Our Services' },
                { href: '/about', label: 'About Us' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-slate-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* For Caregivers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-blue-400">For Caregivers</h3>
            <ul className="space-y-3">
              {[
                { href: '/auth/provider-register', label: 'Become a Caregiver' },
                { href: '/provider/resources', label: 'Resources' },
                { href: '/provider/training', label: 'Training Programs' },
                { href: '/provider/support', label: 'Support Center' },
                { href: '/provider/benefits', label: 'Benefits' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-slate-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Get In Touch</h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center mr-3 mt-0.5 border border-slate-600/30">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    123 Care Street, Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center mr-3 border border-slate-600/30">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <p className="text-slate-300 text-sm">(555) 123-CARE</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center mr-3 border border-slate-600/30">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <p className="text-slate-300 text-sm">hello@careconnect.com</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-xs text-slate-400 mb-3">Get care tips and updates</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 min-w-0"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg sm:rounded-r-lg sm:rounded-l-none text-sm font-medium hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-slate-700/50 mt-16 pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} CareConnect. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Made with</span>
                <span className="text-red-400">💙</span>
                <span>for families everywhere</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/accessibility', label: 'Accessibility' },
                { href: '/sitemap', label: 'Sitemap' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
