"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import StudentVerificationModal from '../../components/auth/StudentVerificationModal';
import Script from 'next/script';
import { Sparkles, Zap, Shield, Cpu, ArrowRight, Check, GraduationCap } from 'lucide-react';

export default function PricingPage() {
  const { user, updateCredits, addHistoryItem, setAuthOpen } = useAuth();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [credits, setCredits] = useState(100);

  const PRICING_MAP: Record<number, number> = {
    25: 159,
    50: 329,
    100: 699,
    200: 1299,
    300: 1899,
    500: 2999,
    800: 4499,
    1300: 6499,
  };

  const calculatePrice = (amount: number, studentStatus: boolean) => {
    const basePrice = PRICING_MAP[amount] || amount * 10;
    if (studentStatus) return Math.round(basePrice * 0.75);
    return basePrice;
  };

  const handleCheckout = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      if (window.location.hostname === 'localhost') {
        updateCredits(credits);
        addHistoryItem({
           id: `mock_pay_${Date.now()}`,
           type: 'credit_purchase',
           prompt: `Purchased ${credits} Credits (Mocked)`,
           cost: 0, 
           timestamp: new Date().toISOString()
        });
        alert(`Payment Bypass Active:\nSuccessfully simulated adding ${credits} credits to your account!`);
        return;
      }

      const price = calculatePrice(credits, isStudent);
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        const errorMsg = orderData.details || orderData.error || "Failed to initialize payment";
        throw new Error(errorMsg);
      }

      if (!orderData.keyId && window.location.hostname !== 'localhost') {
        throw new Error("Razorpay Configuration Error: Missing Gateway ID");
      }

      const options = {
        key: orderData.keyId, 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Vedagarbha AI",
        description: `${credits} Credits Pack`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              updateCredits(credits);
              addHistoryItem({
                id: response.razorpay_payment_id,
                type: 'credit_purchase',
                prompt: `Purchased ${credits} Credits`,
                cost: 0, 
                timestamp: new Date().toISOString()
              });
              alert(`Payment Success:\nSuccessfully added ${credits} credits to your account!`);
            } else {
              const verifyData = await verifyRes.json();
              alert("Payment Verification Failed: " + verifyData.error);
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment completed but verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "user@example.com",
        },
        theme: { color: "#FFFFFF" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => alert("Payment Failed: " + response.error.description));
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Network Error: Could not reach backend.");
    }
  };

  const handleStudentToggle = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (user.studentStatus !== 'verified') {
      setIsStudentModalOpen(true);
      return;
    }
    setIsStudent(!isStudent);
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white/30">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      
      <main className="pt-[160px] pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <header className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-3 glass bg-white/5 px-4 py-2 rounded-full border-glow mb-8">
              <Shield size={16} className="text-[#3B82F6] animate-pulse" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[#E2E2E2] uppercase text-glow">Secure Credits & Packs</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 gradient-text">SIMPLE & <span className="text-white">POWERFUL</span></h1>
            <p className="text-xl text-[#A1A1A6] max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              Fuel your creativity with high-performance AI credits. Choose a pack that scales with your needs.
            </p>

            {/* Student Discount Toggle Box */}
            <div className="mx-auto w-full max-w-[600px] glass p-8 rounded-[40px] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-float">
               <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="flex items-center gap-5 text-left">
                     <div className="w-16 h-16 glass-card bg-white/5 flex items-center justify-center rounded-3xl animate-pulse">
                        <GraduationCap className="text-[#3B82F6]" size={36}/>
                     </div>
                     <div>
                        <h4 className="text-xl font-black tracking-tight text-white leading-none mb-2">STUDENT DISCOUNT</h4>
                        <p className="text-sm font-bold text-[#8E8E93] uppercase tracking-widest">Verify & Save 25% Instant</p>
                     </div>
                  </div>
                  <div 
                    onClick={handleStudentToggle}
                    className="cursor-pointer group relative flex flex-col items-center gap-3"
                  >
                     <div className={`w-20 h-10 rounded-full border-2 transition-all duration-500 relative ${isStudent ? 'bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/10'}`}>
                        <div className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-xl transition-all duration-500 ease-out ${isStudent ? 'left-11' : 'left-1'}`}></div>
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isStudent ? 'text-white text-glow' : 'text-[#6E6E73]'}`}>
                        {user?.studentStatus === 'verified' ? (isStudent ? 'DISCOUNT ACTIVE' : 'UNLOCKED') : 'VERIFY NOW'}
                     </span>
                  </div>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10 perspective-1000">
             {/* Main Select Area */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
                {[25, 50, 100, 200, 300, 500, 800, 1300].map((amount, i) => (
                   <div 
                    key={amount}
                    onClick={() => setCredits(amount)}
                    className={`glass-card cursor-pointer group p-8 flex flex-col items-start gap-4 transition-all duration-500 hover:scale-[1.03] active:scale-95 border border-white/5 ${credits === amount ? 'bg-white/5 border-white shadow-[0_0_50px_rgba(255,255,255,0.05)]' : 'hover:bg-white/5 hover:border-white/20'}`}
                   >
                     {amount === 800 && <div className="absolute top-0 right-0 bg-white text-black px-4 py-1.5 font-bold text-[10px] tracking-widest rounded-bl-2xl uppercase shadow-xl animate-pulse">BEST VALUE</div>}
                     {amount === 1300 && <div className="absolute top-0 right-0 bg-white text-black px-4 py-1.5 font-bold text-[10px] tracking-widest rounded-bl-2xl uppercase shadow-xl">ULTRA LUXE</div>}
                     
                     <div className="flex items-center gap-4 w-full">
                        <div className={`w-12 h-12 glass flex items-center justify-center rounded-2xl transition-all ${credits === amount ? 'bg-white text-black shadow-[0_0_20px_white]' : 'bg-white/5 text-[#8E8E93]'}`}>
                           <Zap size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-2xl font-black tracking-tight text-white">{amount} CREDITS</span>
                           <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Digital Tokens</span>
                        </div>
                     </div>

                     <div className="mt-4 flex flex-col">
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black text-white">₹{calculatePrice(amount, isStudent)}</span>
                           {isStudent && <span className="text-sm font-bold text-[#8E8E93] text-glow line-through">₹{PRICING_MAP[amount]}</span>}
                        </div>
                        <span className="text-xs font-bold text-[#8E8E93] tracking-wide mt-1">
                           ₹{(calculatePrice(amount, isStudent) / amount).toFixed(2)} per credit
                        </span>
                     </div>

                     <ul className="mt-6 flex flex-col gap-3 w-full">
                        {["No Expiry", "4K Video Access", "HD Image Generation"].map(feature => (
                           <li key={feature} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#6E6E73] group-hover:text-white transition-colors">
                              <Check size={14} className="text-[#3B82F6]" /> {feature}
                           </li>
                        ))}
                     </ul>
                   </div>
                ))}
             </div>

             {/* Checkout Panel */}
             <div className="lg:sticky lg:top-[120px] glass-card border-white/20 p-10 animate-in fade-in slide-in-from-right-8 duration-700 bg-[#020202]/60 depth-3">
                <h3 className="text-3xl font-black tracking-tighter mb-8 gradient-text">ORDER SUMMARY</h3>
                
                <div className="flex flex-col gap-8">
                   <div className="flex justify-between items-center text-sm font-black tracking-[0.2em] uppercase opacity-60">
                      <span>PACKAGE</span>
                      <span>{credits} CREDITS</span>
                   </div>
                   
                   <div className="space-y-4 py-8 border-y border-white/5">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-[#8E8E93] font-medium">Market Price</span>
                         <span className="font-black">₹{PRICING_MAP[credits]}</span>
                      </div>
                      {isStudent && (
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-[#3B82F6] font-medium">Student Discount</span>
                            <span className="font-black text-[#3B82F6]">-₹{PRICING_MAP[credits] - calculatePrice(credits, isStudent)}</span>
                         </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-[#8E8E93] font-medium">Processing Fee</span>
                         <span className="font-black text-green-500 uppercase">FREE</span>
                      </div>
                   </div>

                   <div className="flex justify-between items-center">
                      <span className="text-xl font-black tracking-tighter uppercase">Total</span>
                      <div className="flex flex-col items-end">
                         <span className="text-4xl font-black bg-gradient-to-r from-white to-[#3B82F6] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            ₹{calculatePrice(credits, isStudent)}
                         </span>
                         <span className="text-[10px] font-bold text-[#6E6E73] tracking-widest mt-1">ALL TAXES INCLUDED</span>
                      </div>
                   </div>

                   <button 
                     onClick={handleCheckout}
<<<<<<< HEAD
                     className="glass-card bg-white text-black px-8 py-5 rounded-[22px] font-black text-lg uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.2)] hover:-translate-y-2 transition-all group flex items-center justify-center gap-3 mt-4"
=======
                     className="bg-white text-black px-8 py-5 rounded-[22px] font-black text-lg uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:shadow-[0_0_40px_rgba(255,255,255,1)] hover:-translate-y-2 transition-all group flex items-center justify-center gap-3 mt-4"
>>>>>>> origin/main
                   >
                     Complete Order <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                   </button>
                   
                   <div className="flex flex-col items-center gap-4 mt-4 opacity-40">
                      <div className="flex items-center gap-3">
                         <Shield size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Bank Grade Security</span>
                      </div>
                      <p className="text-[9px] text-center font-bold tracking-widest">POWERED BY RAZORPAY WORLDWIDE</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <StudentVerificationModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} />
    </div>
  );
}
