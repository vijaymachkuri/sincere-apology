'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Music4, Heart, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

// --- Types & Constants ---
type Star = { id: number; x: number; y: number };
type Particle = { id: number; left: string; top: string; duration: number; delay: number; scale: number; tx: number; ty: number };

// --- Sub-components ---

const Background = ({ isLetterOpen }: { isLetterOpen: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 15,
      delay: Math.random() * 5,
      scale: 0.5 + Math.random() * 1.5,
      tx: (Math.random() - 0.5) * 100,
      ty: (Math.random() - 0.5) * 100,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out"
        animate={{
          backgroundColor: isLetterOpen ? '#FFE8DD' : '#FFF9F4', // Warm peach vs Soft cream
        }}
        style={{ opacity: 0.6 }}
      />
      {/* Blurred pastel circles */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50"
        animate={{
          backgroundColor: isLetterOpen ? '#FDECEC' : '#F7F2FF',
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50"
        animate={{
          backgroundColor: isLetterOpen ? '#FDECEC' : '#F7F2FF',
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Fireflies & Hearts */}
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: i % 5 === 0 ? 12 : 6,
            height: i % 5 === 0 ? 12 : 6,
            backgroundColor: i % 5 === 0 ? 'transparent' : '#F2C57C',
            boxShadow: i % 5 === 0 ? 'none' : '0 0 10px 2px rgba(242, 197, 124, 0.4)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [p.scale, p.scale * 1.5, p.scale],
            x: [0, p.tx, 0],
            y: [0, p.ty, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {i % 5 === 0 && <Heart size={12} className="text-[#D98C9A] fill-current opacity-60" />}
        </motion.div>
      ))}
    </div>
  );
};

const Entrance = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 2, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="w-96 h-96 rounded-full bg-[#FFE8DD] filter blur-[80px]"
      />
    </motion.div>
  );
};

export default function ApologyPage() {
  const [isEntered, setIsEntered] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [rainingHearts, setRainingHearts] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sparkle interaction
  const handleGlobalClick = useCallback((e: React.MouseEvent) => {
    // Avoid triggering if clicking on interactive elements directly
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.no-sparkle')) return;

    const newStar = { id: Date.now(), x: e.clientX, y: e.clientY };
    setStars((prev) => [...prev, newStar]);
    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== newStar.id));
    }, 1000);
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (musicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {
        console.log("Audio playback requires user interaction and a valid source.");
      });
    }
    setMusicPlaying(!musicPlaying);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    setRainingHearts(true);
    setTimeout(() => setRainingHearts(false), 5000);
  };

  return (
    <div 
      className="relative min-h-screen w-full font-sans text-gray-800 overflow-x-hidden selection:bg-[#FDECEC] selection:text-[#D98C9A]"
      onClick={handleGlobalClick}
    >
      <Entrance onComplete={() => setIsEntered(true)} />
      
      <Background isLetterOpen={isLetterOpen} />

      {/* Hidden audio element - placeholder src */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_51bf1218ac.mp3?filename=soft-piano-100-bpm-121529.mp3" />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center justify-start min-h-screen">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isEntered ? 1 : 0, y: isEntered ? 0 : 30 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto space-y-6 mt-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-[#D98C9A]">
            I owe you an apology <span className="inline-block animate-pulse">❤️</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-[#A98BC9] tracking-wide leading-relaxed">
            Not because I expect forgiveness...<br />
            but because you deserve honesty.
          </p>
        </motion.div>

        {/* Envelope & Letter Section */}
        <motion.div 
          className="mt-32 mb-40 relative flex justify-center items-center w-full max-w-3xl min-h-[400px] no-sparkle"
          initial={{ opacity: 0 }}
          animate={{ opacity: isEntered ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <AnimatePresence mode="wait">
            {!isLetterOpen ? (
              <motion.button
                key="envelope"
                onClick={() => setIsLetterOpen(true)}
                className="relative group cursor-pointer"
                animate={{ rotate: [-2, 2, -2], y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)", transition: { duration: 0.8 } }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Envelope Graphic */}
                <div className="w-80 h-52 md:w-96 md:h-64 bg-[#FFF9F4] rounded-lg shadow-xl relative overflow-hidden border border-[#FDECEC] transition-shadow duration-500 group-hover:shadow-2xl">
                  {/* Flap */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FDECEC] origin-top transform scale-y-100 z-10 border-b border-[#F2C57C]/30" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                  {/* Body */}
                  <div className="absolute bottom-0 left-0 w-full h-full bg-[#FFF9F4] z-0" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 pt-10">
                    <div className="px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm font-serif text-[#A98BC9] shadow-sm tracking-widest border border-white">
                      TAP TO OPEN
                    </div>
                  </div>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-[#FFFDFB] p-10 md:p-16 rounded-2xl shadow-2xl relative"
                style={{
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                  boxShadow: '0 20px 60px -15px rgba(217, 140, 154, 0.2), 0 0 40px rgba(253, 236, 236, 0.5)'
                }}
              >
                {/* Letter Content */}
                <div className="font-handwriting text-3xl md:text-4xl leading-relaxed text-gray-700 space-y-6">
                  <p>Dear Gem,</p>
                  <p className="whitespace-pre-wrap">
                    {"I am so deeply sorry for how I hurt you. You didn't deserve that, and it was entirely my fault.\n\nI've been reflecting a lot, and I realize now how my actions made you feel unheard and unvalued. A true partner should be a source of safety and peace, not stress or pain. I am taking full responsibility for my mistakes, and I am committed to working on myself so I never make you feel that way again.\n\nI don't expect you to forgive me right away. Please take all the time and space you need. I just wanted you to know how truly sorry I am, and how much you mean to me."}
                  </p>
                  <p className="pt-8">Sincerely,</p>
                  <p>Vijay</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Memory Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full max-w-5xl my-24 space-y-12 no-sparkle"
        >
          <div className="text-center space-y-2">
             <h2 className="font-serif text-3xl text-[#A98BC9]">Moments I Cherish</h2>
             <p className="text-gray-500 font-light">Things I'll never forget.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-12 pt-4 px-4 snap-x snap-mandatory hide-scrollbar gap-6 md:gap-8 justify-start md:justify-center">
            {[
              { id: 1, title: "Your beautiful smile", image: "/images/photo1.jpg" },
              { id: 2, title: "Radiant in nature", image: "/images/photo2.jpg" },
              { id: 3, title: "Lost in your eyes", image: "/images/photo3.jpg" },
              { id: 4, title: "The purple bouquet", image: "/images/photo4.jpg" },
              { id: 5, title: "Dinner dates with you", image: "/images/photo5.jpg" }
            ].map((card, i) => (
              <motion.div
                key={card.id}
                className="snap-center shrink-0 w-64 h-80 bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white flex flex-col items-center cursor-pointer group"
                whileHover={{ scale: 1.05, y: -10, backgroundColor: 'rgba(255,255,255,0.9)' }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-full h-56 relative rounded-lg mb-4 overflow-hidden shadow-inner group-hover:shadow-md transition-shadow duration-500">
                  <Image src={card.image} alt={card.title} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <p className="font-serif italic text-lg text-gray-700 text-center mt-auto mb-2">{card.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mt-32 mb-20 text-center space-y-8 flex flex-col items-center"
        >
          <p className="font-sans font-light text-gray-500 text-lg tracking-wide max-w-md leading-relaxed">
            Whether today, tomorrow, or much later... <br/>
            Thank you for reading this.
          </p>
          <p className="font-serif text-2xl text-[#D98C9A] italic">
            Take all the time you need ❤️
          </p>

          <motion.button
            onClick={handleHeartClick}
            className="mt-16 text-[#D98C9A] hover:text-[#A98BC9] transition-colors duration-500 focus:outline-none no-sparkle"
            animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 2px rgba(217, 140, 154, 0.5))', 'drop-shadow(0 0 10px rgba(217, 140, 154, 0.8))', 'drop-shadow(0 0 2px rgba(217, 140, 154, 0.5))'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Heart size={20} className="fill-current" />
          </motion.button>
        </motion.div>
      </main>

      {/* Floating Music Button */}
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-white text-[#A98BC9] hover:bg-white/60 transition-all duration-300 no-sparkle"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isEntered ? 1 : 0, scale: isEntered ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {musicPlaying ? <Music size={24} className="animate-pulse" /> : <Music4 size={24} />}
      </motion.button>

      {/* Interactive Stars Render */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            className="fixed pointer-events-none z-50 text-[#F2C57C]"
            style={{ left: star.x - 12, top: star.y - 12 }}
          >
            <Sparkles size={24} className="fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modal / Surprise */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-[#FDECEC] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="space-y-6">
                <Heart size={40} className="mx-auto text-[#D98C9A] fill-current animate-bounce" />
                <p className="font-serif text-2xl text-gray-800 leading-relaxed">
                  "No matter what happens...<br/>
                  Meeting you has been one of the happiest parts of my life. <br/>
                  Thank you for every smile you've given me."
                </p>
              </div>
            </motion.div>
            
            {/* Raining Hearts when modal opens */}
            {rainingHearts && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-[#D98C9A]"
                    initial={{ top: -50, left: `${Math.random() * 100}%`, opacity: 0, rotate: 0 }}
                    animate={{ 
                      top: '120%', 
                      opacity: [0, 1, 1, 0], 
                      rotate: Math.random() * 360,
                      x: (Math.random() - 0.5) * 100
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2, 
                      ease: "linear",
                      delay: Math.random() * 2
                    }}
                  >
                    <Heart size={16 + Math.random() * 16} className="fill-current opacity-60" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
