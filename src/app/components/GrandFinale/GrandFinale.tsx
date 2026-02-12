"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Bike,
  MapPin,
  ChevronRight,
  Calendar,
  Infinity as InfinityIcon,
  ArrowRight,
  Smile,
  Sunrise,
  Home,
  Anchor,
  Sparkles,
  Hourglass,
  Quote,
  Send,
  Zap,
  Flame,
  User,
  Users,
  Mic,
  Play,
  Pause,
  Volume2,
  Ticket,
  Star,
  CheckCircle2,
  Coffee,
  Music,
  CloudLightning,
  HeartHandshake,
  Bed,
  Moon,
  Trees,
  Film,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

// --- 1. KOMPONENTY WIZUALNE I TŁO ---

const FallingPetals = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-500/10"
          initial={{ top: -50, left: `${Math.random() * 100}%`, rotate: 0 }}
          animate={{
            top: "110%",
            left: `${Math.random() * 100}%`,
            rotate: 360,
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        >
          <Heart size={Math.random() * 20 + 10} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const AudioVisualizer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-16 z-50 pointer-events-none opacity-50 mix-blend-screen px-2">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-linear-to-t from-rose-600 to-rose-400 rounded-t-sm"
          animate={{
            height: [4, Math.random() * 50 + 4, 4],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.4 + Math.random() * 0.4,
            ease: "easeInOut",
            delay: Math.random() * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const ParticleHeart = ({ onExplode }: { onExplode: () => void }) => {
  const [isExploded, setIsExploded] = useState(false);
  const particles = Array.from({ length: 60 });

  const handleClick = () => {
    setIsExploded(true);
    setTimeout(onExplode, 800);
  };

  return (
    <div
      className="relative w-80 h-80 mx-auto cursor-pointer flex items-center justify-center z-10"
      onClick={handleClick}
    >
      <AnimatePresence>
        {!isExploded ? (
          <motion.div className="relative w-full h-full" exit={{ opacity: 0 }}>
            {particles.map((_, i) => {
              const angle = (i / particles.length) * Math.PI * 2;
              const x = 100 * Math.pow(Math.sin(angle), 3);
              const y =
                (-80 *
                  (13 * Math.cos(angle) -
                    5 * Math.cos(2 * angle) -
                    2 * Math.cos(3 * angle) -
                    Math.cos(4 * angle))) /
                13;
              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                  initial={{ x: 0, y: 0 }}
                  animate={{ x, y }}
                  transition={{
                    type: "spring",
                    stiffness: 45,
                    delay: i * 0.01,
                  }}
                />
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:scale-110 transition-transform shadow-xl">
                Dotknij Serca
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-full">
            {particles.map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-2 h-2 bg-rose-600 rounded-full"
                animate={{
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 2. BAZA DANYCH (TREŚCI) ---

type Challenge = { text: string; target: "Natalia" | "Łukasz" | "Razem" };

const fullChallengesList: Challenge[] = [
  // SŁODKIE
  { text: "Powiedz 3 powody, dla których kochasz Łukasza.", target: "Natalia" },
  {
    text: "Łukasz musi przytulić Cię bardzo mocno na 60 sekund.",
    target: "Łukasz",
  },
  { text: "Pocałuj Łukasza w czoło.", target: "Natalia" },
  { text: "Łukasz bierze Cię na ręce.", target: "Łukasz" },
  { text: "Patrzcie sobie w oczy przez minutę bez słowa.", target: "Razem" },
  { text: "Zróbcie wspólne selfie teraz!", target: "Razem" },
  { text: "Opowiedz o najzabawniejszym wspomnieniu.", target: "Natalia" },
  { text: "Łukasz daje Ci buziaka w nos.", target: "Łukasz" },
  { text: "Trzymajcie się za ręce przez kolejne 2 wyzwania.", target: "Razem" },
  {
    text: "Łukasz głaszcze Cię po włosach i mówi komplement.",
    target: "Łukasz",
  },
  // PIKANTNE
  { text: "Pocałuj Łukasza w szyję... powoli.", target: "Natalia" },
  { text: "Łukasz szepcze Ci do ucha coś niegrzecznego.", target: "Łukasz" },
  { text: "Zrób Łukaszowi masaż karku.", target: "Natalia" },
  { text: "Łukasz gryzie Cię delikatnie w ucho.", target: "Łukasz" },
  { text: "Włóż rękę pod koszulkę Łukasza na chwilę.", target: "Natalia" },
  { text: "Łukasz zgaduje kolor Twojej bielizny.", target: "Łukasz" },
  { text: "Pocałujcie się tak, jak na pierwszej randce.", target: "Razem" },
  {
    text: "Napisz Łukaszowi palcem na plecach tajną wiadomość.",
    target: "Natalia",
  },
  { text: "Łukasz robi Ci masaż stóp.", target: "Łukasz" },
  { text: "Przyciągnij Łukasza do siebie za pasek.", target: "Natalia" },
  // GORĄCE
  { text: "Namiętny pocałunek z języczkiem przez 30 sekund.", target: "Razem" },
  { text: "Zdejmij z Łukasza jedną część garderoby.", target: "Natalia" },
  { text: "Łukasz zdejmuje swoją koszulkę.", target: "Łukasz" },
  { text: "Usiądź Łukaszowi na kolanach.", target: "Natalia" },
  {
    text: "Łukasz całuje Cię w miejsce, które najbardziej lubisz.",
    target: "Łukasz",
  },
  { text: "Zrób Łukaszowi malinkę (lub udawaj).", target: "Natalia" },
  { text: "Łukasz dotyka Cię tam, gdzie masz dreszcze.", target: "Łukasz" },
  { text: "Spróbuj uwieść Łukasza bez użycia słów.", target: "Natalia" },
  { text: "Łukasz przytula Cię od tyłu i mocno przyciska.", target: "Łukasz" },
  { text: "Zróbcie to, na co macie teraz największą ochotę.", target: "Razem" },
];

const memorySteps = [
  {
    title: "Dzień, który zmienił wszystko",
    desc: "06.09.2020. Początek naszej wspólnej drogi, której nie zamieniłbym na nic innego.",
    icon: <Calendar className="text-rose-400" />,
  },
  {
    title: "Plac Zabaw i My",
    desc: "Beztroskie chwile na huśtawkach, gdzie liczył się tylko Twój śmiech i nasze pierwsze, nieśmiałe spojrzenia.",
    icon: <Trees className="text-green-400" />,
  },
  {
    title: "Nasz Przystanek",
    desc: "Te magiczne godziny do 19:00. Pamiętasz? Siedzieliśmy wtuleni przez 3 godziny, moje dłonie na Twoich biodrach, udach... to tam poczułem, że jesteś moja.",
    icon: <MapPin className="text-rose-500" />,
  },
  {
    title: "Gdy Cię podniosłem...",
    desc: "Pamiętasz ten pierwszy raz? Udawałaś niezadowoloną, ale potem przyznałaś, że ci się to podobało. To był moment, kiedy zrozumiałem, że chcę być przy Tobie na zawsze.",
    icon: <Flame className="text-orange-500" />,
  },
  {
    title: "Nocne Wędrówki",
    desc: "Nasze kilometry pod gwiazdami. Ciemność nocy sprawiała, że byliśmy jeszcze bliżej siebie.",
    icon: <Moon className="text-yellow-100" />,
  },
  {
    title: "Walka z Burzą",
    desc: "Ciągnąłem Cię na rowerze przed ulewą, a potem sam wracałem w strugach deszczu. Mokry, ale szczęśliwy, bo wiedziałem, że jesteś już bezpieczna w domu.",
    icon: <Bike className="text-blue-400" />,
  },
  {
    title: "Pierwsze Nocowania",
    desc: "Zasypianie i budzenie się przy Tobie... to wtedy zrozumiałem, że chcę tak spędzić resztę życia.",
    icon: <Bed className="text-indigo-400" />,
  },
  {
    title: "Sztormy między nami",
    desc: "Kłótnie bywały trudne, ale zawsze potrafiliśmy podać sobie rękę. Jeden buziak, mocne przytulenie i świat znów stawał się piękny.",
    icon: <CloudLightning className="text-zinc-400" />,
  },
  {
    title: "Zawsze Ty i Ja",
    desc: "Nieważne co się działo, zawsze wracaliśmy do siebie. Silniejsi, bardziej spragnieni swojego dotyku.",
    icon: <HeartHandshake className="text-rose-400" />,
  },
  {
    title: "Dzisiaj",
    desc: "Mieszkamy razem, jemy wspólne śniadania, śpiewamy w aucie. Każdy dzień to nowa, romantyczna przygoda.",
    icon: <Home className="text-rose-300" />,
  },
];

const reasonsToLove = [
  "Za to, jak marszczysz nos, kiedy się śmiejesz.",
  "Za Twoje nieskończone wsparcie w każdej mojej decyzji.",
  "Za to, że sprawiasz, iż każdy dzień ma swój cel.",
  "Za Twój zapach, który kojarzy mi się z domem.",
  "Za to, że jesteś moją najlepszą przyjaciółką i miłością w jednym.",
  "Za Twoją cierpliwość do moich pomysłów.",
  "Za to, jak patrzysz na mnie, gdy myślisz, że nie widzę.",
];

const futureVisions = [
  {
    title: "Wspólne Poranki",
    desc: "Tysiące kolejnych kaw wypitych w ciszy, która jest najpiękniejszą rozmową.",
    icon: <Sunrise className="text-orange-300" />,
  },
  {
    title: "Dom Pełen Ciebie",
    desc: "Miejsce, które nie jest tylko adresem, ale naszym schronieniem.",
    icon: <Home className="text-rose-400" />,
  },
  {
    title: "Nasze 'Zawsze'",
    desc: "Obiecuję Ci nie tylko dobre dni, ale też moją dłoń w te gorsze.",
    icon: <InfinityIcon className="text-rose-600" />,
  },
];

const ourPlaces = [
  "Ławka przy szkole podstawowej w Rudnie — tam zaczęła się magia",
  "Przystanek, Schody, ławka i plac zabaw w Rudnie — nasze pierwsze godziny tylko dla siebie",
  "Rudno Drugie 1 i Dawidy 101A — dwa domy, jedna historia",
  "Wspólne jazdy rowerami, kiedy świat był nasz i nic innego się nie liczyło",
  "Wyjazdy do Lublina, Białej podlaskiej i Warszawy — nasze małe ucieczki od codzienności",
  "Osiemnastka Kaśki i Patrycji — nasze wspólne śmiechy do rana",
  "Wspólne filmy po nocach — kiedy świat przestawał istnieć",
  "Mazury i Białowieża — nasze małe podróże w wielkim świecie",
  "Jacuzzi w Poniatowej — chwile, które pamięta się całym ciałem",
  "Wspólne śniadania i nocne spacery — codzienność, która stała się marzeniem",
  "Wyjazdy nad Białkę — cisza, woda i tylko my",
];

const loveCoupons = [
  {
    title: "Wieczór bez gotowania (no prawie)",
    desc: "Łukasz przejmuje kuchnię na cały wieczór (z twoją pomocą).",
    icon: <Home />,
  },
  {
    title: "Masaż Relaksacyjny",
    desc: "30 minut pełnego relaksu przy ulubionym serialu. Ty decydujesz, gdzie i jak.",
    icon: <Sparkles />,
  },
  {
    title: "Wygrana kłótnia",
    desc: "Użyj tego, gdy chcesz mieć ostatnie słowo (TYLKO RAZ).",
    icon: <CheckCircle2 />,
  },
  {
    title: "Randka Niespodzianka",
    desc: "Ja organizuję wszystko od A do Z.",
    icon: <Star />,
  },
  {
    title: "Dzień Słodyczy",
    desc: "Kupuję Ci wszystko, na co masz ochotę.",
    icon: <Coffee />,
  },
  {
    title: "Wieczór Filmowy",
    desc: "Ty wybierasz film, ja wszystko przygotowuję i przytulam.",
    icon: <Film className="text-rose-400" />,
  },
];

const complimentsJar = [
  "Twój uśmiech to moja ulubiona pora dnia.",
  "Jesteś mądrzejsza niż myślisz.",
  "Uwielbiam Twój styl i to jak się ubierasz.",
  "Przy Tobie czuję się bezpiecznie jak nigdzie indziej.",
  "Masz najpiękniejsze oczy na świecie, tonę w nich.",
  "Twoja dobroć mnie inspiruje do bycia lepszym.",
  "Jesteś moim najlepszym przyjacielem.",
  "Kocham barwę Twojego głosu, uspokaja mnie.",
  "Jesteś idealna nawet w dresie i bez makijażu.",
  "Nikt nie rozumie mnie tak jak Ty.",
  "Doceniam wszystko, co dla nas robisz.",
  "Jesteś najsilniejszą kobietą, jaką znam.",
];

const photoGallery = [
  {
    url: "/grandfinale/photoFirst.jpeg",
    caption: "Patrzyłem na Ciebie i wiedziałem – to Ty.",
  },
  {
    url: "/grandfinale/photoSecond.jpeg",
    caption: "Twój uśmiech to moje ulubione miejsce na ziemi.",
  },
  {
    url: "/grandfinale/photoThird.jpeg",
    caption: "Zawsze Ty, zawsze ja. Bez wyjątków.",
  },
  {
    url: "/grandfinale/photoFourth.jpeg",
    caption: "Najpiękniejszy widok świata w jednym kadrze.",
  },
  {
    url: "/grandfinale/photoFifth.jpeg",
    caption: "Budujmy dalej nasz wspólny wszechświat.",
  },
  {
    url: "/grandfinale/photoSixth.jpg",
    caption: "Kocham Cię najbardziej na świecie.",
  },
  {
    url: "/grandfinale/photo7.jpg",
    caption: "Każda podróż z Tobą to przygoda życia.",
  },
  {
    url: "/grandfinale/photo8.jpg",
    caption: "W Twoich ramionach czas płynie inaczej.",
  },
  {
    url: "/grandfinale/photo9.jpg",
    caption: "Drobne gesty, które znaczą wszystko.",
  },
  {
    url: "/grandfinale/photo10.jpg",
    caption: "Twoje szczęście jest moim celem.",
  },
  {
    url: "/grandfinale/photo11.jpg",
    caption: "My. Po prostu My. Idealnie niedoskonali.",
  },
  { url: "/grandfinale/photo12.jpg", caption: "Na zawsze. Obiecuję." },
];

// --- 3. GŁÓWNY KOMPONENT ---

export default function OurLoveStory() {
  // Stany aplikacji (kroki)
  const [mode, setMode] = useState<
    | "intro"
    | "lock"
    | "waiting"
    | "memories"
    | "dashboard"
    | "places" // NOWE
    | "coupons" // NOWE
    | "proposal"
    | "challenges"
    | "gallery"
    | "jar"
    | "reasons" // PRZYWRÓCONE
    | "vision" // PRZYWRÓCONE
    | "letter" // PRZYWRÓCONE
    | "final"
  >("intro");

  // Hasło i Liczniki
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(20);
  const [timeTogether, setTimeTogether] = useState({
    y: 0,
    m: 0,
    d: 0,
    h: 0,
    min: 0,
    s: 0,
  });

  // Kroki wewnątrz sekcji
  const [currentStep, setCurrentStep] = useState(0); // Memories
  const [galleryStep, setGalleryStep] = useState(0); // Gallery
  const [reasonStep, setReasonStep] = useState(0); // Reasons
  const [visionStep, setVisionStep] = useState(0); // Vision
  const [showText, setShowText] = useState(false); // Memories transition

  // Wyzwania
  const [availableChallenges, setAvailableChallenges] = useState([
    ...fullChallengesList,
  ]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [challengesDone, setChallengesDone] = useState(0);

  // Słoik
  const [jarIndices, setJarIndices] = useState(
    Array.from({ length: complimentsJar.length }, (_, i) => i),
  );
  const [seenCompliments, setSeenCompliments] = useState(new Set());
  const [currentComplimentIndex, setCurrentComplimentIndex] = useState<
    number | null
  >(null);

  // Proposal Button Logic
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

  // Audio Refs
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  // --- EFEKTY (LOGIKA) ---

  // Zegar czasu razem
  useEffect(() => {
    const startDate = new Date("2020-09-06T00:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      if (days < 0) {
        months -= 1;
        const pm = new Date(now.getFullYear(), now.getMonth(), 0);
        days += pm.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      setTimeTogether({
        y: years,
        m: months,
        d: days,
        h: now.getHours(),
        min: now.getMinutes(),
        s: now.getSeconds(),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Odliczanie startowe
  useEffect(() => {
    if (mode === "waiting" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === "waiting" && countdown === 0) {
      setMode("memories");
    }
  }, [mode, countdown]);

  // Logika logowania
  const handleLogin = () => {
    if (password === "06092020") {
      bgAudioRef.current?.play().catch(() => {});
      setMode("waiting");
    }
  };

  // Losowanie wyzwania
  const drawChallenge = () => {
    if (availableChallenges.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    setCurrentChallenge(availableChallenges[randomIndex]);
    setAvailableChallenges((prev) => prev.filter((_, i) => i !== randomIndex));
    setChallengesDone((prev) => prev + 1);
  };

  // Losowanie komplementu (bez powtórzeń)
  const drawCompliment = () => {
    if (jarIndices.length === 0) return;
    const randomIdxOfIndices = Math.floor(Math.random() * jarIndices.length);
    const actualComplimentIndex = jarIndices[randomIdxOfIndices];
    setJarIndices((prev) => prev.filter((_, i) => i !== randomIdxOfIndices));
    setCurrentComplimentIndex(actualComplimentIndex);
    setSeenCompliments((prev) => new Set(prev).add(actualComplimentIndex));
  };

  // Obsługa Voice Audio
  const handlePlayVoice = () => {
    if (voiceAudioRef.current) {
      if (isVoicePlaying) {
        voiceAudioRef.current.pause();
        setIsVoicePlaying(false);
        if (bgAudioRef.current) {
          bgAudioRef.current.volume = 1;
          bgAudioRef.current.play();
        }
      } else {
        if (bgAudioRef.current) bgAudioRef.current.pause();
        voiceAudioRef.current.play();
        setIsVoicePlaying(true);
      }
    }
  };

  const getTargetIcon = (target: string) => {
    if (target === "Natalia")
      return <User className="text-pink-400" size={20} />;
    if (target === "Łukasz")
      return <User className="text-blue-400" size={20} />;
    return <Users className="text-purple-400" size={20} />;
  };

  // --- DRUK KUPONÓW ---

  const contentToPrint = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: contentToPrint,
    documentTitle: "Kupony_Milosci",
  });

  // --- RENDEROWANIE WIDOKÓW ---

  return (
    <div className="fixed inset-0 bg-[#0a0607] text-rose-50 font-serif overflow-y-auto overflow-x-hidden selection:bg-rose-500/30">
      <FallingPetals />

      {/* Audio Players */}
      <audio ref={bgAudioRef} src="/music/taniecdusz.mp3" loop />
      <audio
        ref={voiceAudioRef}
        src="/music/voice.mp3"
        onEnded={() => {
          setIsVoicePlaying(false);
          bgAudioRef.current?.play();
        }}
      />

      {mode !== "intro" && mode !== "lock" && <AudioVisualizer />}

      <AnimatePresence mode="wait">
        {/* 1. INTRO */}
        {mode === "intro" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, scale: 1.1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-light italic text-white mb-12"
            >
              Moja <span className="text-rose-500 font-normal">Walentynka</span>
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setMode("lock")}
              className="px-12 py-4 border border-rose-500/40 rounded-full uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-rose-500 transition-all cursor-pointer"
            >
              Otwórz serce
            </motion.button>
          </motion.div>
        )}

        {/* 2. LOCK SCREEN */}
        {mode === "lock" && (
          <motion.div
            key="lock"
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 text-center z-10 relative"
          >
            <div className="max-w-sm w-full bg-rose-900/10 p-10 rounded-3xl backdrop-blur-sm border border-rose-500/20">
              <Sparkles className="w-8 h-8 text-rose-600 mx-auto mb-6 animate-pulse" />
              <h2 className="text-xs mb-8 tracking-[0.4em] uppercase font-bold text-rose-400">
                Podaj hasło
              </h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-rose-900/40 p-3 text-center text-2xl mb-10 outline-none focus:border-rose-500 text-white placeholder-rose-900/50"
                placeholder="********"
              />
              <button
                onClick={handleLogin}
                className="text-rose-500 hover:text-white uppercase tracking-widest text-[10px] font-bold border border-rose-500/20 px-8 py-3 rounded-full transition-all hover:bg-rose-600"
              >
                Wejdź
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. WAITING */}
        {mode === "waiting" && (
          <motion.div
            key="waiting"
            className="min-h-screen flex flex-col items-center justify-center text-center z-10 relative"
          >
            <Hourglass
              size={40}
              className="text-rose-500/30 mx-auto mb-8 animate-spin"
            />
            <div className="text-8xl font-light text-white mb-6 font-mono">
              {countdown}
            </div>
            <p className="text-rose-100/40 italic text-sm tracking-widest uppercase text-[10px]">
              Ładowanie wspomnień...
            </p>
          </motion.div>
        )}

        {/* 4. MEMORIES (PARTICLE HEART) */}
        {mode === "memories" && (
          <motion.div
            key="memories"
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            {!showText ? (
              <ParticleHeart onExplode={() => setShowText(true)} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-white/5"
              >
                <div className="mb-10 flex justify-center scale-[1.8]">
                  {memorySteps[currentStep].icon}
                </div>
                <h2 className="text-3xl font-light mb-6 italic text-white">
                  {memorySteps[currentStep].title}
                </h2>
                <p className="text-xl text-rose-100/80 leading-relaxed italic">
                  "{memorySteps[currentStep].desc}"
                </p>
                <button
                  onClick={() => {
                    if (currentStep < memorySteps.length - 1) {
                      setCurrentStep(currentStep + 1);
                      setShowText(false);
                    } else {
                      setMode("dashboard");
                    }
                  }}
                  className="mt-20 px-10 py-4 border border-rose-500/30 rounded-full text-[10px] uppercase font-bold hover:bg-rose-500/20 transition-all flex items-center gap-3 mx-auto"
                >
                  Dalej <ChevronRight size={14} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 5. DASHBOARD (STATS) */}
        {mode === "dashboard" && (
          <motion.div
            key="dash"
            className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative"
          >
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-rose-500 mb-16 font-extrabold">
              Jesteśmy ze sobą już...
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl w-full mb-20">
              {[
                { v: timeTogether.y, u: "Lat" },
                { v: timeTogether.m, u: "Miesięcy" },
                { v: timeTogether.d, u: "Dni" },
                { v: timeTogether.h, u: "Godzin" },
                { v: timeTogether.min, u: "Minut" },
                { v: timeTogether.s, u: "Sekund" },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-6 border border-rose-900/30 rounded-2xl bg-rose-900/10 text-center shadow-lg hover:border-rose-500/50 transition-colors backdrop-blur-sm"
                >
                  <div className="text-4xl font-light text-white mb-1 font-mono">
                    {t.v}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-rose-500/60 font-bold">
                    {t.u}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMode("proposal")}
              className="px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-rose-900/20"
            >
              Chcę zapytać cię o coś ważnego{" "}
              <ChevronRight size={14} className="inline ml-2" />
            </button>
          </motion.div>
        )}

        {/* 8. PROPOSAL */}
        {mode === "proposal" && (
          <motion.div
            key="proposal"
            className="min-h-screen flex items-center justify-center text-center p-6 z-10 relative"
          >
            <div className="max-w-lg">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart
                  size={100}
                  className="text-rose-600 fill-rose-600 mx-auto mb-12 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                />
              </motion.div>
              <h2 className="text-5xl italic font-light mb-16 text-white leading-tight">
                Zostaniesz moją <br />
                <span className="text-rose-500 font-normal">Walentynką?</span>
              </h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative h-32">
                <button
                  onClick={() => {
                    setMode("places");
                    confetti({
                      particleCount: 200,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                  }}
                  className="w-48 py-5 bg-rose-600 text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-lg shadow-rose-900/50 hover:bg-rose-500 transition-all transform hover:scale-105 z-20"
                >
                  Tak!
                </button>
                <motion.button
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  onMouseEnter={() =>
                    setNoBtnPos({
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150,
                    })
                  }
                  className="w-48 py-5 border border-rose-500/20 text-rose-500/40 rounded-full font-bold uppercase tracking-widest text-sm cursor-default absolute md:static z-10"
                >
                  Nie
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6. PLACES (NOWOŚĆ) */}
        {mode === "places" && (
          <motion.div
            key="places"
            className="min-h-screen flex flex-col items-center justify-center p-6 py-20 z-10 relative"
          >
            <MapPin className="text-rose-500 mb-6 w-12 h-12" />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-rose-500 mb-12 font-extrabold text-center">
              Nasza mapa wspomnień
            </h2>
            <div className="max-w-xl w-full space-y-4">
              {ourPlaces.map((place, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="p-5 border border-rose-900/30 rounded-2xl bg-rose-900/10 flex items-center gap-4 backdrop-blur-md"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-xs">
                    {i + 1}
                  </div>
                  <span className="text-lg italic text-rose-100">{place}</span>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setMode("coupons")}
              className="mt-12 px-10 py-4 bg-rose-600 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-lg hover:bg-rose-500 transition-colors"
            >
              Zróbmy coś razem
            </button>
          </motion.div>
        )}

        {/* 7. COUPONS */}
        {mode === "coupons" && (
          <motion.div
            key="coupons"
            className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative"
          >
            <style>{`
      @media print {
        @page { size: A4; margin: 15mm; }
        body { background: white !important; }
        .print-header { 
          display: block !important; 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #e11d48;
          padding-bottom: 20px;
        }
        .print-area { 
          display: grid !important; 
          grid-template-columns: 1fr 1fr !important; 
          gap: 15px !important;
        }
        .coupon-card { 
          border: 2px dashed #e11d48 !important; 
          background: #fff5f7 !important; 
          break-inside: avoid;
          padding: 20px !important;
          border-radius: 20px !important;
          text-align: center !important;
        }
        .coupon-title { color: #e11d48 !important; font-size: 16pt !important; font-weight: bold !important; margin-bottom: 5px !important; }
        .coupon-desc { color: #333 !important; font-size: 10pt !important; font-style: italic !important; }
        .print-footer {
          display: block !important;
          text-align: center;
          margin-top: 40px;
          font-style: italic;
          color: #e11d48;
        }
        .no-print { display: none !important; }
      }
      .print-header, .print-footer { display: none; }
    `}</style>

            <Ticket className="text-rose-500 mb-6 w-12 h-12 no-print" />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-rose-500 mb-12 font-extrabold text-center no-print">
              Twoje Przywileje
            </h2>

            {/* OBSZAR WYDRUKU */}
            <div ref={contentToPrint} className="w-full max-w-4xl">
              {/* Nagłówek PDF */}
              <div className="print-header">
                <h1
                  style={{
                    color: "#e11d48",
                    fontSize: "26pt",
                    marginBottom: "5px",
                  }}
                >
                  Kupony Miłości
                </h1>
                <p
                  style={{
                    color: "#666",
                    fontSize: "11pt",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Specjalnie dla mojej Walentynki - Natalii
                </p>
                <p
                  style={{ color: "#999", fontSize: "9pt", marginTop: "10px" }}
                >
                  Ważne bezterminowo • Wydano z miłością w 2026 roku
                </p>
              </div>

              <div className="print-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loveCoupons.map((coupon, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="coupon-card p-6 border-2 border-dashed border-rose-500/30 rounded-3xl bg-rose-900/5 text-center group hover:bg-rose-900/20 transition-all backdrop-blur-sm"
                  >
                    <div className="text-rose-500 mb-4 flex justify-center group-hover:scale-110 transition-transform no-print">
                      {coupon.icon}
                    </div>
                    <h3 className="coupon-title text-lg font-bold mb-2 uppercase tracking-tighter text-white">
                      {coupon.title}
                    </h3>
                    <p className="coupon-desc text-sm italic text-rose-200/60 leading-relaxed">
                      {coupon.desc}
                    </p>
                    <div className="hidden print:block mt-4 text-[7pt] text-rose-400 border-t border-rose-200 pt-2 opacity-50">
                      KOD: NATALIA-2026-VAL0{i + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stopka PDF */}
              <div className="print-footer">
                <p>
                  „Jeden kupon to jeden uśmiech. Korzystaj z nich, kiedy tylko
                  zapragniesz.”
                </p>
                <p
                  style={{
                    fontSize: "10pt",
                    marginTop: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Na zawsze Twój, Łukasz
                </p>
              </div>
            </div>

            {/* PRZYCISKI NA DOLE */}
            <div className="mt-16 flex flex-col items-center gap-6 no-print">
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-3 px-10 py-4 bg-rose-600/10 border border-rose-500/40 text-rose-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all shadow-2xl"
              >
                <Sparkles size={16} /> Pobierz zestaw kuponów (PDF)
              </button>

              <button
                onClick={() => setMode("challenges")}
                className="text-rose-500/50 uppercase tracking-widest text-[9px] font-bold border-b border-rose-500/10 hover:border-rose-500 hover:text-rose-500 transition-all"
              >
                Przejdź do naszych wyzwań
              </button>
            </div>
          </motion.div>
        )}

        {/* 9. CHALLENGES */}
        {mode === "challenges" && (
          <motion.div
            key="challenges"
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            <h2 className="text-rose-500 text-[10px] uppercase tracking-[0.6em] font-extrabold mb-8">
              Nasze Wyzwania ({challengesDone}/30)
            </h2>
            <div className="max-w-md w-full min-h-87.5 flex flex-col items-center justify-center p-10 border border-rose-500/30 rounded-[3rem] bg-rose-900/10 backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.1)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChallenge?.text || "start"}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  {currentChallenge ? (
                    <>
                      <div className="text-rose-300 uppercase text-[10px] tracking-widest font-bold mb-6 flex items-center gap-2 bg-rose-900/30 px-4 py-2 rounded-full border border-rose-500/20">
                        {getTargetIcon(currentChallenge.target)}{" "}
                        <span>Cel: {currentChallenge.target}</span>
                      </div>
                      <p className="text-2xl italic font-light text-white leading-relaxed">
                        {currentChallenge.text}
                      </p>
                    </>
                  ) : (
                    <p className="text-xl text-rose-200/50 italic">
                      Kliknij poniżej, aby wylosować zadanie.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-12 flex flex-col gap-4 items-center w-full max-w-xs">
              <button
                onClick={drawChallenge}
                className="w-full py-5 bg-linear-to-r from-rose-700 to-rose-500 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Zap size={16} fill="white" />{" "}
                {currentChallenge ? "Losuj kolejne" : "Rozpocznij grę"}
              </button>
              <button
                onClick={() => setMode("gallery")}
                className="mt-4 text-rose-500/40 hover:text-rose-500 uppercase tracking-widest text-[9px] border-b border-transparent hover:border-rose-500 transition-all pb-1"
              >
                Przejdź do galerii zdjęć
              </button>
            </div>
          </motion.div>
        )}

        {/* 10. GALLERY */}
        {mode === "gallery" && (
          <motion.div
            key="gallery"
            className="min-h-screen flex items-center justify-center p-6 z-10 relative"
          >
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-rose-500 text-[10px] uppercase tracking-[0.6em] mb-12 font-extrabold">
                Nasze wspólne kadry ({galleryStep + 1}/{photoGallery.length})
              </h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                >
                  <div className="aspect-video max-h-[50vh] mx-auto bg-rose-900/20 rounded-3xl overflow-hidden border border-rose-500/10 mb-8 shadow-2xl relative">
                    <img
                      src={photoGallery[galleryStep].url}
                      className="w-full h-full object-cover"
                      alt="Memory"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>
                  </div>
                  <p className="text-2xl italic font-light text-rose-100/90 h-20 flex items-center justify-center">
                    "{photoGallery[galleryStep].caption}"
                  </p>
                </motion.div>
              </AnimatePresence>
              <button
                onClick={() =>
                  galleryStep < photoGallery.length - 1
                    ? setGalleryStep(galleryStep + 1)
                    : setMode("jar")
                }
                className="mt-8 px-10 py-4 bg-rose-600 rounded-full font-bold uppercase tracking-widest text-xs inline-flex items-center gap-3 hover:bg-rose-500 transition-colors"
              >
                Następne <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* 11. JAR OF COMPLIMENTS */}
        {mode === "jar" && (
          <motion.div
            key="jar"
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            <h2 className="text-rose-500 text-[10px] uppercase tracking-[0.6em] mb-12 font-extrabold">
              Słoik Komplementów
            </h2>
            <div
              onClick={drawCompliment}
              className="w-72 h-96 border-4 border-rose-300/30 rounded-[3rem] rounded-t-lg flex items-center justify-center bg-rose-900/5 backdrop-blur-sm relative overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.15)] cursor-pointer hover:border-rose-500/50 transition-colors"
            >
              <div className="absolute inset-x-0 top-0 h-6 bg-rose-300/20 border-b border-rose-500/20" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentComplimentIndex || "init"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="p-8"
                >
                  {currentComplimentIndex !== null ? (
                    <>
                      <Quote
                        size={24}
                        className="text-rose-500/30 mb-4 mx-auto"
                      />
                      <p className="text-xl italic text-white font-light leading-relaxed">
                        {complimentsJar[currentComplimentIndex]}
                      </p>
                    </>
                  ) : (
                    <span className="text-rose-500/50 uppercase tracking-widest text-xs font-bold animate-pulse">
                      Kliknij, aby wylosować
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
              {seenCompliments.size === complimentsJar.length && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span className="text-rose-500 font-bold uppercase tracking-widest text-xs">
                    Słoik pusty!
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 text-[10px] uppercase tracking-widest text-rose-500/30">
              Odkryto: {seenCompliments.size} / {complimentsJar.length}
            </div>
            <button
              onClick={() => setMode("reasons")}
              className="mt-16 text-rose-500 uppercase tracking-widest text-[10px] font-bold border border-rose-500/30 px-8 py-3 rounded-full hover:bg-rose-500 hover:text-white transition-all"
            >
              Dalej
            </button>
          </motion.div>
        )}

        {/* 12. REASONS (PRZYWRÓCONE) */}
        {mode === "reasons" && (
          <motion.div
            key="reasons"
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            <div className="max-w-2xl">
              <h2 className="text-[10px] uppercase tracking-[0.6em] text-rose-500 mb-20 font-extrabold">
                Dlaczego Ty?
              </h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={reasonStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h3 className="text-3xl md:text-5xl font-light italic text-white mb-10 leading-tight">
                    "{reasonsToLove[reasonStep]}"
                  </h3>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2 justify-center mt-12 mb-12">
                {reasonsToLove.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i === reasonStep ? "w-8 bg-rose-500" : "w-2 bg-rose-900/50"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (reasonStep < reasonsToLove.length - 1)
                    setReasonStep((prev) => prev + 1);
                  else setMode("vision");
                }}
                className="px-10 py-4 bg-transparent border border-rose-500/40 rounded-full text-rose-100 uppercase tracking-widest text-[10px] font-bold hover:bg-rose-500/10 transition-colors"
              >
                {reasonStep < reasonsToLove.length - 1
                  ? "Kolejny powód"
                  : "Moja wizja"}
              </button>
            </div>
          </motion.div>
        )}

        {/* 13. VISION (PRZYWRÓCONE) */}
        {mode === "vision" && (
          <motion.div
            key="vision"
            className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative"
          >
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-rose-500 mb-16 font-extrabold text-center">
              Nasza Przyszłość
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
              {futureVisions.map((vision, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  key={i}
                  className="bg-rose-900/10 border border-rose-500/20 p-8 rounded-3xl text-center hover:bg-rose-900/20 transition-colors"
                >
                  <div className="mb-6 flex justify-center scale-125">
                    {vision.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {vision.title}
                  </h3>
                  <p className="text-rose-200/60 text-sm leading-relaxed">
                    {vision.desc}
                  </p>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setMode("letter")}
              className="mt-20 flex items-center gap-3 text-rose-500 uppercase tracking-widest text-[10px] font-bold hover:scale-105 transition-transform"
            >
              Chcę Ci coś napisać <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {/* 14. LETTER (PRZYWRÓCONE) */}
        {mode === "letter" && (
          <motion.div
            key="letter"
            className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative"
          >
            <div className="max-w-2xl w-full bg-black/40 p-10 rounded-3xl border border-rose-500/20 backdrop-blur-md">
              <h2 className="text-2xl italic font-light text-white mb-8 flex items-center gap-3">
                <Send size={24} className="text-rose-500" /> List do Ciebie
              </h2>
              <div className="prose prose-invert prose-p:text-rose-100/80 prose-p:font-light prose-p:text-lg max-h-[40vh] overflow-y-auto mb-8 pr-4 custom-scrollbar">
                <p>Moja Najdroższa,</p>
                <p>
                  Piszę to, bo czasem słowa grzęzną w gardle, a tutaj mogę je
                  ułożyć tak, jak na to zasługujesz. Każdy dzień z Tobą to dla
                  mnie lekcja tego, jak piękne może być życie, gdy dzieli się je
                  z właściwą osobą.
                </p>
                <p>
                  Dziękuję Ci za Twoją cierpliwość, za Twój śmiech, który
                  rozgania moje chmury, i za to, że po prostu Jesteś. Nie
                  potrzebuję wielkich fajerwerków, wystarczy mi Twoja dłoń w
                  mojej.
                </p>
                <p>
                  Kocham Cię nie za to, jaka bywasz w idealne dni, ale za to,
                  kim jesteś zawsze.
                </p>
                <p className="text-right font-bold mt-8">- Twój Łukasz</p>
              </div>
              <button
                onClick={() => setMode("final")}
                className="w-full py-4 bg-rose-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-500 transition-colors"
              >
                Odsłuchaj ostatnią wiadomość
              </button>
            </div>
          </motion.div>
        )}

        {/* 15. FINAL (Z INSTRUKCJĄ SŁUCHAWEK) */}
        {mode === "final" && (
          <motion.div
            key="final"
            className="min-h-screen flex items-center justify-center text-center p-10 z-10 relative"
          >
            <div className="max-w-lg w-full">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-12"
              >
                <Heart
                  size={80}
                  className="text-rose-600 fill-rose-600 mx-auto drop-shadow-2xl"
                />
              </motion.div>
              <h2 className="text-3xl italic font-light mb-8 text-white leading-relaxed">
                Jesteś moim najpiękniejszym przeznaczeniem.
              </h2>

              {/* Sekcja Audio ze Słuchawkami */}
              <div className="bg-linear-to-br from-rose-900/40 to-black/60 border border-rose-500/30 rounded-3xl p-8 mb-10 backdrop-blur-xl shadow-2xl">
                <div className="flex justify-center items-center gap-4 mb-6 text-rose-400">
                  <div className="p-3 bg-rose-500/10 rounded-full">
                    <Volume2 size={24} />
                  </div>
                  <div className="h-px w-10 bg-rose-500/30"></div>
                  <span className="text-2xl">🎧</span>
                </div>
                <p className="text-rose-100 text-sm italic mb-8 font-light">
                  "To wiadomość przeznaczona tylko dla Twoich uszu. Proszę,
                  załóż słuchawki, zamknij oczy i wsłuchaj się w to, co mam Ci
                  do powiedzenia..."
                </p>
                <button
                  onClick={handlePlayVoice}
                  className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 ${isVoicePlaying ? "bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)]" : "bg-white text-black hover:bg-rose-50"}`}
                >
                  {isVoicePlaying ? (
                    <div className="flex gap-1 items-end h-6">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-white"
                          animate={{ height: [4, 20, 4] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Play fill="black" size={20} />
                  )}
                  <span className="font-bold uppercase tracking-widest text-xs">
                    {isVoicePlaying ? "Odtwarzanie..." : "Odsłuchaj wyznanie"}
                  </span>
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-[10px] tracking-[1em] uppercase text-rose-500/40 font-bold mb-2"
              >
                Na zawsze Twój
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="text-4xl font-light italic text-white underline decoration-rose-500/50 decoration-1 underline-offset-8"
              >
                Łukasz
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
