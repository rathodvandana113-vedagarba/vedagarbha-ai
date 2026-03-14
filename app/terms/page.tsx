"use client";

import React from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { FileText, Gavel, Handshake, CreditCard, Ban, ShieldCheck, Mail, Info } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans relative overflow-x-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-[#0A0A0B]">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/5 blur-[150px] rounded-full"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="flex flex-col gap-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-max">
            <Gavel size={14} className="text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1A6]">Legal Framework</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-[#A1A1A6] text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully. By using Vedagarbha, you agree to our policies regarding AI generation tools: Text to Video, Image to Video, Text to Image, and Text to Speech.
          </p>
        </div>

        <div className="space-y-12 text-[#A1A1A6] leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          
          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Handshake size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
             </div>
             <p>By accessing or using the Vedagarbha AI platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Info size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
             </div>
             <p>Users must create an account to access our AI tools. You are responsible for maintaining the confidentiality of your credentials and providing accurate, complete information.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">3. Credit System</h2>
             </div>
             <div className="space-y-4">
                <p>The platform operates on a credit-based system. Each generation requires a specific amount of credits depending on complexity and quality settings.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Purchase</div>
                    <p className="text-xs">Credits can be purchased securely using Razorpay integration.</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Refunds</div>
                    <p className="text-xs">Credits are strictly non-refundable once they have been used to generate content.</p>
                  </div>
                </div>
             </div>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Ban size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">4. Acceptable Use Policy</h2>
             </div>
             <p>Users must not use the platform to generate illegal, harmful, offensive, sexually explicit, or copyrighted content. We reserve the right to monitor and flag such content.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">5. AI Generated Content Disclaimer</h2>
             </div>
             <p>Content is generated by artificial intelligence. It may not always be accurate, realistic, or unbiased. Users are solely responsible for how they use and share generated outputs.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Handshake size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">6. Intellectual Property</h2>
             </div>
             <p>Users generally hold the rights to the content they generate, subject to these terms. However, Vedagarbha retains all rights to the underlying platform technology, models, and UI.</p>
          </section>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
             <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-white font-bold mb-2">7. Payment Terms</h3>
                  <p className="text-sm">Payments are processed via Razorpay. Prices listed may include applicable taxes depending on your region.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">8. Account Suspension</h3>
                  <p className="text-sm">We reserve the right to suspend accounts that violate our guidelines or abuse platform credits.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">9. Limitation of Liability</h3>
                  <p className="text-sm">Vedagarbha is not responsible for any damages resulting from the use or misuse of AI-generated content.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">10. Changes to Terms</h3>
                  <p className="text-sm">We may update these terms periodically. Your continued use of the site constitutes acceptance of updated terms.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">11. Governing Law</h3>
                  <p className="text-sm">These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai.</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center text-center pt-8 border-t border-white/10">
             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
                <Mail size={24} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Legal Contact</h2>
             <p className="text-sm">For legal inquiries or support questions, please email <a href="mailto:support@vedagarbha.ai" className="text-white underline font-bold transition-all hover:text-[#3B82F6]">support@vedagarbha.ai</a></p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#0B0B0F] py-12 text-center text-sm text-[#6E6E73]">
         &copy; {new Date().getFullYear()} Vedagarbha AI. All rights reserved.
      </footer>
    </div>
  );
}
