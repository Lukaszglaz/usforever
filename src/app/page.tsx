"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { riddles } from "./data/riddles";

export default function ValentinePage() {
  const [mounted, setMounted] = useState(false);
  const [nextLockTime, setNextLockTime] = useState({
    h: "00",
    m: "00",
    s: "00",
  });
  const [daysToFinal, setDaysToFinal] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [input, setInput] = useState("");

  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  useEffect(() => {
    setMounted(true);
    const solved = localStorage.getItem(`solved_day_${currentDay}`);
    if (solved) setIsSolved(true);
  }, [currentDay]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // 1. Obliczanie czasu do jutra 14:44
      const target = new Date();
      if (
        now.getHours() > 14 ||
        (now.getHours() === 14 && now.getMinutes() >= 44)
      ) {
        target.setDate(now.getDate() + 1);
      }
      target.setHours(14, 44, 0, 0);
      const diffNext = target.getTime() - now.getTime();

      // 2. Obliczanie dni do 14 lutego
      const finalDate = new Date(now.getFullYear(), 1, 14, 14, 44);
      const diffFinal = Math.ceil(
        (finalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      setDaysToFinal(diffFinal > 0 ? diffFinal : 0);

      setNextLockTime({
        h: Math.floor((diffNext / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        m: Math.floor((diffNext / (1000 * 60)) % 60)
          .toString()
          .padStart(2, "0"),
        s: Math.floor((diffNext / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      });

      // 3. Logika blokady (5 lutego zawsze otwarte dla Ciebie)
      const today = now.getDate();
      const month = now.getMonth();
      const unlockTime = new Date();
      unlockTime.setHours(14, 44, 0, 0);

      if (month === 1 && today >= 5 && today <= 14) {
        if (today === 5 || now >= unlockTime) {
          setIsLocked(false);
        } else {
          setIsLocked(true);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSolved]);

  const handleCheck = async () => {
    const res = await fetch("/api/check", {
      method: "POST",
      body: JSON.stringify({ day: currentDay, guess: input }),
    });

    if (res.ok) {
      confetti({
        particleCount: 150,
        spread: 100,
        colors: ["#ff71ce", "#01cdfe"],
      });
      setIsSolved(true);
      setIsWrong(false);
      localStorage.setItem(`solved_day_${currentDay}`, "true");
    } else {
      setIsWrong(true);
      setInput("");
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#030303] flex items-center justify-center p-4">
      {/* Efekty tła */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#ff71ce]/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#01cdfe]/10 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-120"
      >
        <div className="bg-white/3 backdrop-blur-[25px] border border-white/10 rounded-[45px] p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <h2 className="text-[10px] tracking-[0.6em] uppercase text-zinc-500 mb-12 font-bold">
                  Zabezpieczone
                </h2>
                <div className="text-4xl font-extralight text-white tracking-tighter">
                  Cierpliwości...
                </div>
                <p className="mt-8 text-[9px] text-zinc-600 uppercase tracking-widest">
                  Wróć jutro o 14:44
                </p>
              </motion.div>
            ) : isWrong ? (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-6"
              >
                <motion.div
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                >
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff4444"
                    strokeWidth="1"
                    className="mx-auto drop-shadow-[0_0_15px_rgba(255,68,68,0.5)]"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    <line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                      stroke="#ff4444"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>
                <div className="space-y-4">
                  <h3 className="text-[#ff4444] text-lg font-bold tracking-widest uppercase">
                    Błędny ślad
                  </h3>
                  <button
                    onClick={() => setIsWrong(false)}
                    className="px-10 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Powrót i ponowna próba
                  </button>
                </div>
              </motion.div>
            ) : isSolved ? (
              <motion.div
                key="solved"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="relative aspect-square w-full max-w-60 mx-auto rounded-[40px] bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#01cdfe"
                      strokeWidth="1"
                      className="drop-shadow-[0_0_20px_#01cdfe]"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.div>
                  <p className="mt-6 text-[#01cdfe] text-[9px] tracking-[0.4em] uppercase font-bold">
                    Ślad {currentDay}.02 zapisany
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em]">
                      Następny dostęp za:
                    </p>
                    <p className="text-xl font-light text-white tabular-nums tracking-widest">
                      {nextLockTime.h}h {nextLockTime.m}m {nextLockTime.s}s
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[#ff71ce] text-[10px] tracking-[0.2em] uppercase">
                      Jesteśmy coraz bliżej celu...
                    </p>
                    <p className="text-zinc-600 text-[8px] uppercase mt-1">
                      Pozostało dni: {daysToFinal}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <span className="text-[#ff71ce] text-[10px] tracking-[0.4em] uppercase font-bold block">
                    Wspomnienie dnia
                  </span>
                  <p className="text-xl text-zinc-200 font-light px-4 leading-relaxed">
                    {riddles.find((r) => r.day === currentDay)?.question}
                  </p>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Wpisz odpowiedź..."
                    className="w-full bg-white/2 border border-white/10 rounded-2xl py-5 px-6 text-center text-white outline-none focus:border-[#01cdfe]/40 transition-all placeholder:text-zinc-800"
                  />
                  {input.length > 1 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleCheck}
                      className="absolute right-2 top-2 bottom-2 px-6 bg-[#01cdfe] text-black text-[10px] font-bold uppercase rounded-xl hover:scale-105 transition-transform"
                    >
                      OK
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
