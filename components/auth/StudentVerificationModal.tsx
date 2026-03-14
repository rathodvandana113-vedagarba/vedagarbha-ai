"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X, Mail, Image as ImageIcon, Upload, CheckCircle2 } from "lucide-react";

type StudentVerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StudentVerificationModal({ isOpen, onClose }: StudentVerificationModalProps) {
  const [method, setMethod] = useState<"email" | "upload">("email");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { applyForStudentAuth, adminApproveStudent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === "email") {
        if (!email.endsWith(".edu") && !email.endsWith(".ac.in")) {
          alert("Please enter a valid institutional email (.edu or .ac.in)");
          setLoading(false);
          return;
        }
        applyForStudentAuth(email);
      } else {
        if (!file) {
          alert("Please upload a valid ID image.");
          setLoading(false);
          return;
        }
        applyForStudentAuth("uploaded_id");
      }

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Auto-approve for demo purposes
      adminApproveStudent();
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Force refresh to show discount
        window.location.reload(); 
      }, 2000);
      
    } catch (error) {
      console.error(error);
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-[#121218]/90 backdrop-blur-2xl border border-white/5 rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.05)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 transition-colors hover:text-white rounded-full hover:bg-white/5"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 size={64} className="text-[#3B82F6] mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Successful!</h2>
            <p className="text-gray-400">Your 25% student discount is now active.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-white to-[#E2E2E2] flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="text-xl font-black text-[#0B0B0F]">🎓</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Student Verification</h2>
              <p className="mt-2 text-sm text-gray-400">
                Verify your student status to unlock 25% off all credit packs.
              </p>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-[#0B0B0F] rounded-xl border border-white/5">
              <button 
                onClick={() => setMethod("email")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === "email" ? "bg-[#1C1C1F] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                Edu Email
              </button>
              <button 
                onClick={() => setMethod("upload")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${method === "upload" ? "bg-[#1C1C1F] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                Upload ID
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {method === "email" ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    placeholder="Institutional Email (.edu / .ac.in)"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0B0F] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="id-upload"
                  />
                  <label 
                    htmlFor="id-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl bg-[#0B0B0F] hover:bg-white/5 hover:border-[#3B82F6]/50 transition-colors cursor-pointer group"
                  >
                    {file ? (
                      <div className="flex flex-col items-center text-[#3B82F6]">
                        <ImageIcon size={24} className="mb-2" />
                        <span className="text-sm font-medium text-center truncate max-w-[200px]">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-500 group-hover:text-white transition-colors">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm font-medium">Click to upload Student ID</span>
                        <span className="text-xs mt-1 opacity-70">JPG, PNG, WEBP (Max 5MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 font-black uppercase tracking-widest text-[#0B0B0F] transition-all bg-white rounded-xl hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Status"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
