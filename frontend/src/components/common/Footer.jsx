import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Sparkles, Phone, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-16 pb-12 border-t border-stone-800">
      <div className="page-container">
        
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">100% Background-Verified</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Every worker undergoes government ID verification, criminal check, and in-person skill assessment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Safe & Transparent Payments</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct bank transfers, automated receipts, fair wage compliance, and zero predatory middleman fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">AI-Powered Smart Matching</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Gemini-powered semantic parsing matches your exact household needs, timing, and budget in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <span className="text-lg">KC</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Kaam<span className="text-emerald-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-6 max-w-sm">
              Your Home. Your Help. One Connection. Modern marketplace bringing dignity, safety, and transparency to household services across India.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live across Bhopal, Indore & Central India
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/search?service=cooking" className="hover:text-emerald-400 transition-colors">Home Cooks & Chefs</Link></li>
              <li><Link to="/search?service=cleaning" className="hover:text-emerald-400 transition-colors">Housekeeping & Maids</Link></li>
              <li><Link to="/search?service=babysitting" className="hover:text-emerald-400 transition-colors">Babysitters & Nannies</Link></li>
              <li><Link to="/search?service=eldercare" className="hover:text-emerald-400 transition-colors">Elderly Companions</Link></li>
              <li><Link to="/search?service=washing" className="hover:text-emerald-400 transition-colors">Laundry & Ironing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-4">For Professionals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Register as Worker <ArrowUpRight size={13} /></Link></li>
              <li><Link to="/worker/onboarding" className="hover:text-emerald-400 transition-colors">Verification Process</Link></li>
              <li><Link to="/worker/dashboard" className="hover:text-emerald-400 transition-colors">Worker Dashboard</Link></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Fair Wage Promise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-4">Support & Office</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-emerald-400 shrink-0" />
                <span className="text-stone-300">support@kaamconnect.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span className="text-stone-300">+91 (755) 492-8000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-stone-300">MP Nagar Zone II, Bhopal, MP 462011</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} KaamConnect Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
