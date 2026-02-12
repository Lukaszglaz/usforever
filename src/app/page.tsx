"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { riddles, penaltyQuestions } from "./data/riddles";
import GrandFinale from "./components/GrandFinale/GrandFinale";
import {
  CloudLightning,
  LockKeyhole,
  ShieldAlert,
  CheckCircle,
  Zap,
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

  // Pobieramy zagadkę (dodaj rzutowanie na any, jeśli TS krzyczy o extraHint)
  const currentRiddle = (
    isPenaltyMode
      ? penaltyQuestions[penaltyStep]
      : riddles.find((r) => r.day === currentDay)
  ) as any;

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
          { h: 19, m: 0 },
          { h: 20, m: 0 },
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

    if (correct) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
  if (isGrandFinale) return <GrandFinale />;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0607] overflow-hidden relative">
      {/* Tło z sercami */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500/20"
            animate={{
              y: [0, -120, 0],
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: 7 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Heart size={Math.random() * 30 + 15} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-black/80 backdrop-blur-3xl border border-rose-500/30 rounded-[40px] p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <LockKeyhole
                  className="mx-auto text-rose-500/40 mb-6 animate-pulse"
                  size={50}
                />
                <h2 className="text-white text-xl font-serif italic uppercase tracking-wider">
                  System Wstrzymany
                </h2>
                <p className="text-zinc-500 text-[9px] tracking-[0.4em] uppercase mt-6 font-bold">
                  Autoryzacja za: {nextLockTime.h}:{nextLockTime.m}:
                  {nextLockTime.s}
                </p>
              </motion.div>
            ) : isWrong ? (
              <motion.div key="wrong" className="text-center py-10">
                <ShieldAlert className="mx-auto text-rose-600 mb-6" size={60} />
                <h2 className="text-rose-500 font-bold uppercase tracking-widest text-sm">
                  Błąd Weryfikacji
                </h2>
                <button
                  onClick={() => setIsWrong(false)}
                  className="mt-8 px-10 py-3 bg-rose-600 rounded-full text-white text-[10px] font-black uppercase transition-all shadow-lg"
                >
                  Ponów próbę
                </button>
              </motion.div>
            ) : isSolved ? (
              <motion.div key="solved" className="text-center py-10">
                <CheckCircle className="mx-auto text-rose-500 mb-6" size={60} />
                <p className="text-white italic text-lg font-serif">
                  Pomyślnie zweryfikowano.
                </p>
                <div className="flex justify-center gap-2 mt-4 text-rose-500/50">
                  <Sparkles size={16} />
                  <Sparkles size={16} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="active" className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <Fingerprint className="text-rose-500" size={30} />
                  <div className="text-[9px] tracking-[0.5em] text-rose-500 font-black uppercase">
                    {isPenaltyMode
                      ? `KARA: SEKTOR ${penaltyStep + 1}`
                      : "ZAGADKA DNIA"}
                  </div>
                </div>

                <div className="bg-linear-to-b from-white/10 to-transparent p-6 rounded-[30px] border border-white/10 shadow-inner">
                  <p className="text-white text-center text-lg font-serif italic leading-relaxed">
                    "{currentRiddle?.question}"
                  </p>
                </div>

                <div className="space-y-4">
                  {/* GŁÓWNA PODPOWIEDŹ (Z LUPKĄ) */}
                  <div className="flex gap-3 p-4 bg-rose-950/20 rounded-2xl border border-rose-500/20 items-center">
                    <Search size={16} className="text-rose-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[11px] text-zinc-300 font-medium italic">
                        {currentRiddle?.hint}
                      </p>
                    </div>
                  </div>

                  {/* DODATKOWA PODPOWIEDŹ (EXTRA HINT) */}
                  {currentRiddle?.extraHint && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-zinc-600 italic text-center px-6 leading-tight"
                    >
                      {currentRiddle.extraHint}
                    </motion.p>
                  )}
                </div>

                <div className="relative pt-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (isWrong) setIsWrong(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    className="w-full bg-zinc-900/50 border-2 border-rose-500/10 focus:border-rose-500 rounded-2xl p-4 text-center text-white outline-none transition-all text-base shadow-inner"
                    placeholder="Wpisz odpowiedź..."
                  />
                  <button
                    onClick={handleCheck}
                    className="w-full mt-4 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg"
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
