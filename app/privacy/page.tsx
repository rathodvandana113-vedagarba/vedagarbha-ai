"use client";

import React from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { Shield, Lock, Eye, FileText, UserCheck, Smartphone, Info } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans relative overflow-x-hidden">
      <Navbar />
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-[#0A0A0B]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="flex flex-col gap-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-max">
            <Shield size={14} className="text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1A6]">Legal & Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-[#A1A1A6] text-lg max-w-2xl leading-relaxed">
            The platform provides AI generation tools including Text to Video, Image to Video, Text to Image, and Text to Speech. Users can create accounts, generate AI content, and purchase credits using Razorpay.
          </p>
        </div>

        <div className="space-y-12 text-[#A1A1A6] leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Info size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
             </div>
             <p>Vedagarbha is an AI platform that allows users to generate high-quality videos, images, and speech using artificial intelligence. This Privacy Policy explains how we collect, use, and protect your information.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
             </div>
             <p className="mb-4">We may collect the following types of information when you use our platform:</p>
             <ul className="grid md:grid-cols-2 gap-4 list-none">
                {[
                  "Name and Email address",
                  "Account login information",
                  "Prompts entered by users",
                  "Generated AI outputs",
                  "Platform usage data",
                  "Payment details (via Razorpay)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    {item}
                  </li>
                ))}
             </ul>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Smartphone size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">3. How We Use Information</h2>
             </div>
             <p className="mb-4">We use the collected information for various purposes:</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Operate and maintain AI services",
                  "Generate and deliver requested content",
                  "Improve platform performance & UX",
                  "Process secure payments via Razorpay",
                  "Prevent abuse and platform fraud",
                  "Provide reliable customer support"
                ].map((use, i) => (
                  <div key={i} className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">{use}</div>
                ))}
             </div>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">4. AI Generated Content</h2>
             </div>
             <p>User-provided prompts and generated outputs may be stored temporarily on our servers to improve system performance, ensure service quality, and provide history features.</p>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">5. Third Party Services</h2>
             </div>
             <p>We integrate with trusted third-party services to provide our platform:</p>
             <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2"><span className="text-white filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] font-bold px-2 py-0.5 bg-white/10 rounded text-xs select-none uppercase tracking-tighter">PAYMENT</span> Razorpay for secure transactions</li>
                <li className="flex items-center gap-2"><span className="text-white/60 font-bold px-2 py-0.5 bg-white/10 rounded text-xs select-none uppercase tracking-tighter">INFRA</span> Advanced cloud hosting providers</li>
                <li className="flex items-center gap-2"><span className="text-white/60 font-bold px-2 py-0.5 bg-white/10 rounded text-xs select-none uppercase tracking-tighter">METRICS</span> Internal & external analytics tools</li>
             </ul>
          </section>

          <section className="group">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">6. Data Security</h2>
             </div>
             <p>We implement robust technical and organizational security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <section>
              <h3 className="text-white font-bold mb-3">7. User Data Control</h3>
              <p className="text-sm">Users have full control over their account. You can request account deletion or removal of specific data by contacting us.</p>
            </section>
            <section>
              <h3 className="text-white font-bold mb-3">8. Children's Privacy</h3>
              <p className="text-sm">Vedagarbha is not intended for users under 13 years old. we do not knowingly collect data from children.</p>
            </section>
            <section>
              <h3 className="text-white font-bold mb-3">9. Policy Updates</h3>
              <p className="text-sm">We may update this policy periodically. Your continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </section>
            <section>
              <h3 className="text-white font-bold mb-3">10. AI Training Disclosure</h3>
              <p className="text-sm">Generated outputs may be used in an aggregated, de-identified manner to improve the quality of our underlying AI models and services.</p>
            </section>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#121218] to-[#0A0A0B] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-sm mb-6 max-w-md">If you have any questions about this Privacy Policy or how we handle your data, please reach out to our legal team.</p>
            <a href="mailto:privacy@vedagarbha.ai" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-xl transition-transform hover:scale-105">
               Contact Support
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#0B0B0F] py-12 text-center text-sm text-[#6E6E73]">
         &copy; {new Date().getFullYear()} Vedagarbha AI. All rights reserved.
      </footer>
    </div>
  );
}
