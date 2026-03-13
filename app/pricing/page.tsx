"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import StudentVerificationModal from '../../components/auth/StudentVerificationModal';
import Script from 'next/script';

export default function PricingPage() {
  const { user, updateCredits, addHistoryItem } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [credits, setCredits] = useState(100);

  const PRICING_MAP: Record<number, number> = {
    100: 699,
    200: 1299,
    300: 2000,
    500: 3299,
    850: 6000,
    1299: 6600,
  };

  const calculatePrice = (amount: number, studentStatus: boolean) => {
    const basePrice = PRICING_MAP[amount] || amount * 10;

    if (studentStatus) {
      // 25% off
      return Math.round(basePrice * 0.75);
    }
    
    return basePrice;
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      // 0. Mock Bypass if localhost
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
      
      // 1. Create Order on Backend
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // 2. Setup Razorpay Options
      const options = {
        key: orderData.keyId || "rzp_test_YOUR_TEST_KEY", 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Vedagarbha AI",
        description: `${credits} Credits Pack`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
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

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              updateCredits(credits);
              
              // Add to history
              addHistoryItem({
                id: response.razorpay_payment_id,
                type: 'credit_purchase',
                prompt: `Purchased ${credits} Credits`,
                cost: 0, 
                timestamp: new Date().toISOString()
              });
              
              alert(`Payment Success:\nSuccessfully added ${credits} credits to your account!`);
            } else {
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
        theme: {
          color: "#D4AF37"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
      
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Network Error: Could not reach backend.");
    }
  };

  const handleStudentToggle = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (user.studentStatus !== 'verified') {
      setIsStudentModalOpen(true);
      return;
    }
    setIsStudent(!isStudent);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      
      <main className="pt-[72px] pb-24">
        <div className="max-w-[1000px] mx-auto px-8 pt-16 flex flex-col gap-12">
          
          <header className="text-center flex flex-col items-center gap-4">
            <h1 className="text-5xl md:text-[56px] font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
            <p className="text-lg text-[#A1A1A6] max-w-[600px]">Pay only for what you generate. Buy credit packs that never expire.</p>
            
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-6 py-3 rounded-xl mt-6">
              Students get 25% OFF on all AI credits. Verify your student status to unlock the discount.
            </div>

            <div className="flex items-center gap-4 bg-[#121218]/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5 mt-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className={`text-[15px] transition-colors duration-300 ${!isStudent ? 'text-white font-semibold' : 'text-[#6E6E73] font-medium'}`}>Regular User</span>
              
              <div 
                className={`w-14 h-8 bg-[#1C1C1F] rounded-full border border-white/10 relative cursor-pointer transition-all duration-300 ${(!user || user.studentStatus !== 'verified') ? 'opacity-50' : ''}`}
                onClick={handleStudentToggle}
              >
                <div className={`absolute top-[2px] left-[2px] w-[26px] h-[26px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isStudent ? 'translate-x-6 bg-[#D4AF37]' : 'bg-[#A1A1A6]'}`}></div>
              </div>
              
              <span className={`text-[15px] transition-colors duration-300 flex items-center gap-2 ${isStudent ? 'text-white font-semibold' : 'text-[#6E6E73] font-medium'}`}>
                Verified Student 
                <span className="bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-1 rounded-[4px] text-[11px] font-bold uppercase tracking-wider border border-[#D4AF37]/20">Save 25%</span>
              </span>
            </div>
          </header>

          <div className="bg-[#121218]/60 backdrop-blur-2xl border border-white/5 rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            <div className="p-8 md:p-12 flex flex-col gap-8">
              <h2 className="text-2xl font-semibold text-center">Select Credit Pack</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[100, 200, 300, 500, 850, 1299].map(amount => (
                  <button 
                    key={amount}
                    className={`bg-[#0B0B0F]/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 relative border ${credits === amount ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] glow-active' : 'border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/[0.02]'}`}
                    onClick={() => setCredits(amount)}
                  >
                    {amount === 850 && (
                      <span className="absolute -top-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-[#F5D97A]/50">MOST POPULAR</span>
                    )}
                    {amount === 1299 && (
                      <span className="absolute -top-3 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/50 animate-pulse">ULTRA PACK</span>
                    )}
                    {isStudent && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur text-[#D4AF37] text-[9px] font-bold px-2 py-1 rounded-full border border-[#D4AF37]/20 whitespace-nowrap">🎓 STUDENT: 25% OFF</span>
                    )}
                    <span className="text-xl font-semibold text-white">{amount} Credits</span>
                    <div className="flex flex-col items-center">
                      <span className="text-lg text-white font-bold">₹{calculatePrice(amount, isStudent)}</span>
                      {isStudent && (
                        <span className="text-xs text-[#A1A1A6] line-through">₹{PRICING_MAP[amount]}</span>
                      )}
                    </div>
                    <span className="text-xs text-[#A1A1A6]/60 mt-1">(₹{(calculatePrice(amount, isStudent) / amount).toFixed(2)} per credit)</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0B0B0F] border border-white/5 rounded-2xl p-8 flex flex-col gap-4 mt-4 shadow-inner">
                <div className="flex justify-between items-center text-base text-[#A1A1A6]">
                  <span>Selected Pack</span>
                  <span className="font-medium text-white">{credits} Credits</span>
                </div>
                <div className="flex justify-between items-center text-base text-[#A1A1A6]">
                  <span>Base Price</span>
                  <span className={isStudent ? "line-through opacity-50" : "font-medium text-white"}>₹{PRICING_MAP[credits]}</span>
                </div>
                <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-center text-xl font-semibold text-white">
                  <span>Total Amount</span>
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-transparent bg-clip-text text-2xl font-bold drop-shadow-[0_0_10px_rgba(245,217,122,0.4)]">
                    ₹{calculatePrice(credits, isStudent)}
                  </span>
                </div>
                
                <button 
                  className="w-full mt-4 bg-[#0B0B0F] text-white border border-[#D4AF37] py-4 rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_35px_rgba(245,217,122,0.4)] hover:border-[#F5D97A] hover:-translate-y-[1px]"
                  onClick={handleCheckout}
                >
                  Pay with Razorpay
                </button>
                <p className="text-center text-[13px] text-[#6E6E73] mt-2">Secure payment processed by Razorpay. All prices inclusive of taxes.</p>
              </div>
            </div>
          </div>
          
          
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <StudentVerificationModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} />
    </div>
  );
}
