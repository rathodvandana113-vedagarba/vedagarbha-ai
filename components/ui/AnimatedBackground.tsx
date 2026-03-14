"use client";

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        if (!canvas) {
          this.x = 0;
          this.y = 0;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 30 : 100;
      
      for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        if (isMobile) {
          p.size *= 1.5; // Larger but fewer for performance
        }
        particles.push(p);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden bg-[#030303]">
      {/* Grid Overlay */}
      <div className="grid-overlay opacity-30 md:opacity-40"></div>
      
      {/* Noise Texture */}
      <div className="noise-bg opacity-[0.08] md:opacity-[0.15]"></div>

      {/* Floating Glowing Orbs - Optimized for Mobile */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white rounded-full blur-[80px] md:blur-[160px] opacity-[0.03] md:opacity-[0.05] animate-float"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#3B82F6] rounded-full blur-[100px] md:blur-[180px] opacity-[0.03] md:opacity-[0.05] animate-float" style={{ animationDelay: '-3s' }}></div>
      <div className="hidden md:block absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-white rounded-full blur-[120px] opacity-[0.03] animate-float" style={{ animationDelay: '-1.5s' }}></div>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40"></canvas>
      
      {/* Perspective Shading */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303]"></div>
    </div>
  );
};

export default AnimatedBackground;
