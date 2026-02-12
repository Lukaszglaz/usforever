"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { riddles, penaltyQuestions } from "./data/riddles";
import GrandFinale from "./components/GrandFinale/GrandFinale";
import {
  LockKeyhole,
  ShieldAlert,
  CheckCircle,
  Fingerprint,
  Heart,
  Sparkles,
  Search,
} from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isGrandFinale, setIsGrandFinale] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [input, setInput] = useState("");
  const [currentDay] = useState(new Date().getDate());

  const [isPenaltyMode, setIsPenaltyMode] = useState(false);
  const [penaltyStep, setPenaltyStep] = useState(0);
  const [nextLockTime, setNextLockTime] = useState({
    h: "00",
    m: "00",
    s: "00",
  });

  // GENEROWANIE SERC - WIĘKSZE I MOCNIEJSZY RUCH
  const backgroundHearts = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 30 + 20, // Większe serca
      duration: 8 + Math.random() * 7, // Szybszy ruch
      delay: Math.random() * -15,
      xAmplitude: Math.random() * 40 - 20, // Mocniejsze bujanie na boki
      yAmplitude: Math.random() * -80 - 40, // Wyższe latanie
    }));
  }, []);

  const currentRiddle = (
    isPenaltyMode
      ? penaltyQuestions[penaltyStep]
      : riddles.find((r) => r.day === currentDay)
  ) as any;

  const reportProgress = async (
    step: number,
    answer: string,
    isCorrect: boolean,
  ) => {
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: isCorrect ? "✅ Natalia ZGADŁA!" : "❌ Natalia WPISAŁA BŁĄD",
          message: `Natalia wpisała: "${answer}"\nStatus: ${isCorrect ? "POPRAWNA" : "BŁĘDNA"}\nEtap: ${isPenaltyMode ? "KARA " + (step + 1) : "Dzień " + currentDay}`,
        }),
      });
    } catch (e) {
      console.error("Błąd raportowania:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    const penanceDone = localStorage.getItem("penance_12_complete");

    if (currentDay >= 12 && !penanceDone) {
      setIsPenaltyMode(true);
      const savedStep = localStorage.getItem("penalty_step");
      if (savedStep) setPenaltyStep(parseInt(savedStep));
    } else {
      const solved = localStorage.getItem(`solved_day_${currentDay}`);
      if (solved) {
        setIsSolved(true);
        if (currentDay === 14) setIsGrandFinale(true);
      }
    }
  }, [currentDay]);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      const now = new Date();
      let target = new Date();
      let shouldLock = true;

      if (isPenaltyMode) {
        const pTimes = [
          { h: 18, m: 0 },
          { h: 18, m: 45 },
          { h: 19, m: 25 },
        ];
        target.setHours(pTimes[penaltyStep].h, pTimes[penaltyStep].m, 0, 0);
        shouldLock = now.getTime() < target.getTime();
      } else {
        target.setHours(14, 44, 0, 0);
        if (now.getTime() >= target.getTime()) {
          shouldLock = false;
          target.setDate(now.getDate() + 1);
        }
      }

      setIsLocked(shouldLock);
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setNextLockTime({
          h: Math.floor((diff / (1000 * 60 * 60)) % 24)
            .toString()
            .padStart(2, "0"),
          m: Math.floor((diff / (1000 * 60)) % 60)
            .toString()
            .padStart(2, "0"),
          s: Math.floor((diff / 1000) % 60)
            .toString()
            .padStart(2, "0"),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPenaltyMode, penaltyStep, currentDay, mounted]);

  const handleCheck = async () => {
    if (!input.trim()) return;
    const guess = input.toLowerCase().trim();
    const correct = guess === currentRiddle?.answer.toLowerCase();

    await reportProgress(penaltyStep, input, correct);

    if (correct) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e11d48", "#fb7185"],
      });
      if (isPenaltyMode) {
        const next = penaltyStep + 1;
        if (next < 3) {
          setPenaltyStep(next);
          localStorage.setItem("penalty_step", next.toString());
          setInput("");
        } else {
          setIsPenaltyMode(false);
          localStorage.setItem("penance_12_complete", "true");
          setInput("");
        }
      } else {
        setIsSolved(true);
        localStorage.setItem(`solved_day_${currentDay}`, "true");
        if (currentDay === 14) setIsGrandFinale(true);
      }
    } else {
      setIsWrong(true);
    }
  };

  if (!mounted) return null;
  // if (isGrandFinale) return <GrandFinale />;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0607] overflow-hidden relative">
      {/* INTENSYWNIEJSZE TŁO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {backgroundHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-rose-500/30" // Większa widoczność
            style={{ left: heart.left, top: heart.top }}
            animate={{
              y: [0, heart.yAmplitude, 0],
              x: [0, heart.xAmplitude, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 25, 0],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "easeInOut",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-black/85 backdrop-blur-3xl border border-rose-500/30 rounded-[45px] p-8 shadow-[0_0_100px_rgba(225,29,72,0.2)]">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <LockKeyhole
                  className="mx-auto text-rose-500/40 mb-6 animate-pulse"
                  size={55}
                />
                <h2 className="text-white text-xl font-serif italic tracking-wider uppercase">
                  System Wstrzymany
                </h2>
                <p className="text-zinc-500 text-[10px] tracking-[0.5em] uppercase mt-8 font-black">
                  Deszyfracja za: {nextLockTime.h}:{nextLockTime.m}:
                  {nextLockTime.s}
                </p>
              </motion.div>
            ) : isWrong ? (
              <motion.div key="wrong" className="text-center py-10">
                <ShieldAlert className="mx-auto text-rose-600 mb-6" size={70} />
                <h2 className="text-rose-500 font-bold uppercase tracking-widest text-sm">
                  Błąd Weryfikacji
                </h2>
                <button
                  onClick={() => setIsWrong(false)}
                  className="mt-10 px-12 py-3 bg-rose-600 rounded-full text-white text-[10px] font-black uppercase transition-all shadow-lg hover:bg-rose-700"
                >
                  Ponów próbę
                </button>
              </motion.div>
            ) : isSolved ? (
              <motion.div key="solved" className="text-center py-12">
                <CheckCircle className="mx-auto text-rose-500 mb-6" size={65} />
                <p className="text-white italic text-xl font-serif">
                  Dostęp przyznany.
                </p>
                <div className="flex justify-center gap-3 mt-6 text-rose-500/60 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Wróć później po więcej...
                </div>
              </motion.div>
            ) : (
              <motion.div key="active" className="space-y-7">
                <div className="flex flex-col items-center gap-2">
                  <Fingerprint className="text-rose-500" size={35} />
                  <div className="text-[10px] tracking-[0.6em] text-rose-500 font-black uppercase">
                    {isPenaltyMode
                      ? `KARA: SEKTOR ${penaltyStep + 1}/3`
                      : "ZADANIE DNIA"}
                  </div>
                </div>

                <div className="bg-linear-to-b from-white/10 to-transparent p-7 rounded-[35px] border border-white/10 shadow-inner">
                  <p className="text-white text-center text-lg font-serif italic leading-relaxed">
                    "{currentRiddle?.question}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-rose-950/30 rounded-2xl border border-rose-500/20 items-center">
                    <Search size={18} className="text-rose-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[12px] text-zinc-300 font-medium italic leading-snug">
                        {currentRiddle?.hint}
                      </p>
                    </div>
                  </div>

                  {currentRiddle?.extraHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 py-1 border-l-2 border-rose-500/30 ml-4"
                    >
                      <p className="text-[11px] text-zinc-500 italic leading-tight">
                        {currentRiddle.extraHint}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="relative pt-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (isWrong) setIsWrong(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    className="w-full bg-zinc-900/60 border-2 border-rose-500/10 focus:border-rose-500 rounded-2xl p-5 text-center text-white outline-none transition-all text-lg"
                    placeholder="Wpisz odpowiedź..."
                  />
                  <button
                    onClick={handleCheck}
                    className="w-full mt-5 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_15px_40px_rgba(225,29,72,0.3)]"
                  >
                    Sprawdź
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
