"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { riddles } from "./data/riddles";
import GrandFinale from "./components/GrandFinale/GrandFinale";
import {
  LockKeyhole,
  ShieldAlert,
  CheckCircle,
  Fingerprint,
  Heart,
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

  const [marathonStep, setMarathonStep] = useState(0);
  const [nextLockTime, setNextLockTime] = useState({
    h: "00",
    m: "00",
    s: "00",
  });

  const currentRiddle = useMemo(() => {
    const marathonRiddles = riddles.filter((r) => r.day === 13 || r.day === 14);
    return marathonRiddles[marathonStep];
  }, [marathonStep]);

  const backgroundHearts = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 30 + 20,
      duration: 8 + Math.random() * 7,
      delay: Math.random() * -15,
      xAmplitude: Math.random() * 40 - 20,
      yAmplitude: Math.random() * -80 - 40,
    }));
  }, []);

  const reportProgress = async (answer: string, isCorrect: boolean) => {
    try {
      await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: isCorrect ? "✅ Natalia ZGADŁA!" : "❌ Natalia WPISAŁA BŁĄD",
          message: `Natalia wpisała: "${answer}"\nStatus: ${isCorrect ? "POPRAWNA" : "BŁĘDNA"}\nEtap: Finałowy Maraton Krok ${marathonStep + 1}`,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    const marathonDone = localStorage.getItem("marathon_complete");
    const savedMStep = localStorage.getItem("marathon_step");

    if (marathonDone) {
      setIsSolved(true);
    } else if (savedMStep) {
      setMarathonStep(parseInt(savedMStep));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      const now = new Date();
      let target = new Date();

      if (!isSolved) {
        target.setHours(14, 44, 0, 0);
        if (now.getDate() === 12) target.setDate(13);

        setIsLocked(now.getTime() < target.getTime());
      } else {
        target.setHours(20, 30, 0, 0);
        setIsLocked(false);

        if (now.getTime() >= target.getTime()) {
          setIsGrandFinale(true);
        }
      }

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
  }, [mounted, isSolved]);

  const handleCheck = async () => {
    if (!input.trim() || !currentRiddle) return;
    const guess = input.toLowerCase().trim();
    const correct = guess === (currentRiddle as any).answer.toLowerCase();

    await reportProgress(input, correct);

    if (correct) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      const nextM = marathonStep + 1;
      if (nextM < 2) {
        setMarathonStep(nextM);
        localStorage.setItem("marathon_step", nextM.toString());
        setInput("");
      } else {
        setIsSolved(true);
        localStorage.setItem("marathon_complete", "true");
        setInput("");
      }
    } else {
      setIsWrong(true);
    }
  };

  if (!mounted) return null;
  if (isGrandFinale) return <GrandFinale />;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0607] overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {backgroundHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-rose-500/30"
            style={{ left: heart.left, top: heart.top }}
            animate={{
              y: [0, heart.yAmplitude, 0],
              x: [0, heart.xAmplitude, 0],
              rotate: [0, 25, 0],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div className="w-full max-w-md relative z-10">
        <div className="bg-black/85 backdrop-blur-3xl border border-rose-500/30 rounded-[45px] p-8 shadow-[0_0_100px_rgba(225,29,72,0.2)]">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div key="lock" className="text-center py-12">
                <LockKeyhole
                  className="mx-auto text-rose-500/40 mb-6 animate-pulse"
                  size={55}
                />
                <h2 className="text-white text-xl italic uppercase tracking-wider">
                  Zagadki wstrzymane
                </h2>
                <h2 className="text-zinc-400 text-sm mt-2">
                  Wróć jutro o 14:44, by poznać kolejne pytania i zbliżyć się do
                  finału...
                </h2>
                <p className="text-rose-500 font-mono text-lg tracking-[0.3em] mt-8 font-black">
                  {nextLockTime.h}:{nextLockTime.m}:{nextLockTime.s}
                </p>
              </motion.div>
            ) : isSolved ? (
              <motion.div key="solved" className="text-center py-8">
                <CheckCircle className="mx-auto text-rose-500 mb-6" size={65} />
                <h2 className="text-white text-lg font-bold uppercase tracking-widest mb-2">
                  To koniec pytań.
                </h2>
                <p className="text-rose-400 italic text-sm mb-6">
                  Włącz dźwięki w telefonie i czekaj na finał...
                </p>

                <div className="bg-rose-950/20 py-6 rounded-3xl border border-rose-500/10 mb-6">
                  <p className="text-rose-500 font-mono text-3xl tracking-[0.3em] animate-pulse mb-2">
                    TIK TAK TIK TAK
                  </p>
                  <p className="text-zinc-500 text-[10px] tracking-[0.5em] uppercase font-black">
                    Wróć o 20:30
                  </p>
                  <p className="text-white font-mono text-xl mt-4">
                    {nextLockTime.h}:{nextLockTime.m}:{nextLockTime.s}
                  </p>
                </div>
              </motion.div>
            ) : isWrong ? (
              <motion.div key="wrong" className="text-center py-10">
                <ShieldAlert className="mx-auto text-rose-600 mb-6" size={70} />
                <h2 className="text-rose-500 font-bold uppercase tracking-widest text-sm">
                  Błąd Weryfikacji
                </h2>
                <button
                  onClick={() => setIsWrong(false)}
                  className="mt-10 px-12 py-3 bg-rose-600 rounded-full text-white text-[10px] font-black uppercase"
                >
                  Ponów próbę
                </button>
              </motion.div>
            ) : (
              <motion.div key="active" className="space-y-7">
                <div className="flex flex-col items-center gap-2">
                  <Fingerprint className="text-rose-500" size={35} />
                  <div className="text-[10px] tracking-[0.6em] text-rose-500 font-black uppercase text-center">
                    FINAL MARATHON: {marathonStep + 1}/2
                  </div>
                </div>

                <div className="bg-linear-to-b from-white/10 to-transparent p-7 rounded-[35px] border border-white/10 shadow-inner">
                  <p className="text-white text-center text-lg font-serif italic leading-relaxed">
                    "{currentRiddle?.question}"
                  </p>
                </div>

                <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-500/20 flex gap-4 items-center">
                  <Search size={18} className="text-rose-500 shrink-0" />
                  <p className="text-[12px] text-zinc-300 font-medium italic">
                    {currentRiddle?.hint}
                  </p>
                </div>

                <div className="relative pt-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setIsWrong(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    className="w-full bg-zinc-900/60 border-2 border-rose-500/10 focus:border-rose-500 rounded-2xl p-5 text-center text-white outline-none text-lg"
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
