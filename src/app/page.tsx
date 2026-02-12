"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { riddles, penaltyQuestions } from "./data/riddles";
import GrandFinale from "./components/GrandFinale/GrandFinale";
import { Lock, AlertCircle, Heart, Info } from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isGrandFinale, setIsGrandFinale] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [input, setInput] = useState("");
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  // LOGIKA KARY
  const [isPenaltyMode, setIsPenaltyMode] = useState(false);
  const [penaltyStep, setPenaltyStep] = useState(0);
  const [nextLockTime, setNextLockTime] = useState({
    h: "00",
    m: "00",
    s: "00",
  });

  useEffect(() => {
    setMounted(true);
    // Sprawdzamy, czy kara za dzień 12 została już wykonana
    const penanceDone = localStorage.getItem("penance_12_complete");

    // Kara aktywuje się TYLKO jeśli jest dzień 12 (lub późniejszy, jeśli go nie zrobiła)
    // i dopóki flaga penance_12_complete nie jest true.
    if (currentDay >= 12 && !penanceDone) {
      setIsPenaltyMode(true);
      const savedStep = localStorage.getItem("penalty_step");
      if (savedStep) setPenaltyStep(parseInt(savedStep));
      setIsSolved(false);
    } else {
      // Normalny tryb dla dnia 13 i 14
      setIsPenaltyMode(false);
      const solved = localStorage.getItem(`solved_day_${currentDay}`);
      if (solved) {
        setIsSolved(true);
        if (currentDay === 14) setIsGrandFinale(true);
      }
    }
  }, [currentDay]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      let lock = true;
      const target = new Date();

      if (isPenaltyMode) {
        if (penaltyStep === 0) {
          target.setHours(18, 0, 0, 0);
          lock = h < 18;
        } else if (penaltyStep === 1) {
          target.setHours(18, 30, 0, 0);
          lock = h < 18 || (h === 18 && m < 30);
        } else if (penaltyStep === 2) {
          target.setHours(19, 0, 0, 0);
          lock = h < 19;
        }
      } else {
        // Standardowe odblokowanie kolejnych dni o 14:44
        target.setHours(14, 44, 0, 0);
        if (now >= target) target.setDate(now.getDate() + 1);

        // Dzień 5 (startowy) jest zawsze odblokowany, reszta po 14:44
        const unlockTime = new Date();
        unlockTime.setHours(14, 44, 0, 0);
        lock = now < unlockTime && currentDay !== 5;
      }

      setIsLocked(lock);
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
  }, [isPenaltyMode, penaltyStep, currentDay]);

  const handleCheck = async () => {
    const guess = input.toLowerCase().trim();
    if (isPenaltyMode) {
      if (guess === penaltyQuestions[penaltyStep].answer.toLowerCase()) {
        confetti({ particleCount: 50, colors: ["#e11d48"] });
        const nextStep = penaltyStep + 1;
        if (nextStep < 3) {
          setPenaltyStep(nextStep);
          localStorage.setItem("penalty_step", nextStep.toString());
          setInput("");
        } else {
          // KONIEC KARY
          setIsPenaltyMode(false);
          localStorage.setItem("penance_12_complete", "true");
          localStorage.setItem("solved_day_12", "true");
          setIsSolved(true);
          setInput("");
          confetti({ particleCount: 200, spread: 80 });
        }
      } else {
        setIsWrong(true);
      }
      return;
    }

    // Standardowe sprawdzanie dla dnia 13 i 14
    const res = await fetch("/api/check", {
      method: "POST",
      body: JSON.stringify({ day: currentDay, guess: input }),
    });
    if (res.ok) {
      confetti({ particleCount: 150, colors: ["#ff71ce", "#01cdfe"] });
      setIsSolved(true);
      localStorage.setItem(`solved_day_${currentDay}`, "true");
      if (currentDay === 14) setTimeout(() => setIsGrandFinale(true), 1500);
    } else {
      setIsWrong(true);
      setInput("");
    }
  };

  const currentRiddle = isPenaltyMode
    ? penaltyQuestions[penaltyStep]
    : riddles.find((r) => r.day === currentDay);

  if (!mounted) return null;
  // if (isGrandFinale) return <GrandFinale />;

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-[#0a0607]">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0vh) rotate(0deg); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .heart-bg { position: absolute; color: rgba(225, 29, 72, 0.2); animation: float 15s linear infinite; z-index: 1; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="heart-bg"
            size={Math.random() * 20 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100 + 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="backdrop-blur-[25px] bg-black/40 border border-rose-500/20 rounded-[45px] p-8 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <Lock className="mx-auto mb-6 text-rose-600/50" size={30} />
                <h2 className="text-[10px] tracking-[0.6em] uppercase mb-10 font-bold text-rose-500/60">
                  Blokada Czasowa
                </h2>
                <div className="text-3xl font-extralight text-white italic">
                  Odpocznij, Natalia...
                </div>
                <p className="mt-3 text-zinc-400 text-sm">
                  {isPenaltyMode
                    ? "Kara przystąpi do działania o określonej godzinie."
                    : "Kolejne wspomnienie wkrótce."}
                </p>
                <p className="mt-8 text-[9px] text-zinc-500 uppercase tracking-widest">
                  Wróć za:{" "}
                  <span className="text-rose-500 ml-1 font-mono font-bold">
                    {nextLockTime.h}:{nextLockTime.m}:{nextLockTime.s}
                  </span>
                </p>
              </motion.div>
            ) : isWrong ? (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-6"
              >
                <AlertCircle className="mx-auto text-rose-500" size={40} />
                <h3 className="text-rose-500 text-lg font-bold tracking-[0.2em] uppercase">
                  Błędna Odpowiedź
                </h3>
                <button
                  onClick={() => setIsWrong(false)}
                  className="px-10 py-3 bg-rose-950/30 border border-rose-500/30 rounded-full text-white text-[9px] uppercase tracking-[0.2em]"
                >
                  Spróbuj ponownie
                </button>
              </motion.div>
            ) : isSolved ? (
              <motion.div key="solved" className="text-center space-y-6 py-4">
                <Heart
                  className="mx-auto text-rose-500 fill-rose-500/20"
                  size={40}
                />
                <p className="text-xl font-light text-white italic">
                  Zapisano pomyślnie.
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Wróć jutro o 14:44
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span
                    className={`text-[10px] tracking-[0.4em] uppercase font-bold ${isPenaltyMode ? "text-rose-500" : "text-blue-400"}`}
                  >
                    {isPenaltyMode
                      ? `⚠️ PRÓBA ODKUPIENIA (${penaltyStep + 1}/3)`
                      : "ZAGADKA DNIA"}
                  </span>
                  {isPenaltyMode && (
                    <p className="text-[9px] text-rose-400/60 uppercase tracking-tighter mt-2">
                      To kara za błąd. Wykaż się skupieniem.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-[30px]">
                    <p className="text-xl text-zinc-100 font-light italic leading-relaxed font-serif text-center">
                      "{currentRiddle?.question}"
                    </p>
                  </div>

                  {currentRiddle?.hint && (
                    <div className="flex items-start gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl">
                      <Info className="text-rose-500/50 shrink-0" size={14} />
                      <div className="text-[11px] text-zinc-400 leading-snug">
                        <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-1">
                          Podpowiedź:
                        </span>
                        {currentRiddle.hint}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative pt-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Twoja odpowiedź..."
                    className="w-full bg-black/40 border border-rose-500/20 rounded-2xl py-5 px-6 text-center text-white outline-none focus:border-rose-500/60 transition-all font-serif italic"
                  />
                  {input.length >= 1 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleCheck}
                      className="absolute right-2 top-6 bottom-2 px-6 text-[10px] font-bold uppercase rounded-xl bg-rose-600 text-white shadow-lg"
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
