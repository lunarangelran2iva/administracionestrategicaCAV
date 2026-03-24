/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Compass, 
  MessageSquare,
  ArrowDown,
  Sparkles,
  BookOpen,
  Layers,
  Activity,
  Video,
  Music,
  ExternalLink
} from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center relative px-6 py-24 md:px-12 lg:px-24 overflow-hidden ${className}`}>
    {children}
  </section>
);

const ParallaxImage = ({ src, speed = 0.2, className = "" }: { src: string, speed?: number, className?: string }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -500 * speed]);
  return (
    <motion.div style={{ y }} className={`absolute z-0 pointer-events-none ${className}`}>
      <img src={src} alt="Parallax" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
    </motion.div>
  );
};

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = [
    {
      question: "¿Qué significa 'Strategeia' en griego?",
      options: ["Arte de vender", "Arte de ser general", "Ciencia del mercado", "Poder político"],
      answer: 1
    },
    {
      question: "¿Cuál es el horizonte de tiempo de la Planeación Estratégica?",
      options: ["1 mes", "1 año", "3 a 5 años", "10 a 20 años"],
      answer: 2
    },
    {
      question: "¿Qué herramienta analiza Fortalezas, Oportunidades, Debilidades y Amenazas?",
      options: ["Matriz MPC", "FODA", "Diagrama de Gantt", "Rejilla Gerencial"],
      answer: 1
    }
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-white/10 text-white w-full max-w-md">
      {showScore ? (
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-bold">¡Resultado!</h3>
          <p className="text-5xl font-black text-cyan-400">{score} / {questions.length}</p>
          <button 
            onClick={() => { setCurrentQuestion(0); setScore(0); setShowScore(false); }}
            className="px-6 py-2 bg-cyan-500 rounded-full font-bold uppercase text-xs"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Pregunta {currentQuestion + 1} de {questions.length}</span>
            <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <h3 className="text-xl font-bold leading-tight">{questions[currentQuestion].question}</h3>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleAnswer(i)}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-left text-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WordSearch = () => {
  const words = ["FODA", "MISION", "VISION", "CONTROL", "LIDER"];
  const [found, setFound] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  
  const grid = [
    ['F', 'O', 'D', 'A', 'X', 'L'],
    ['M', 'I', 'S', 'I', 'O', 'N'],
    ['V', 'I', 'S', 'I', 'O', 'N'],
    ['C', 'O', 'N', 'T', 'R', 'O'],
    ['L', 'I', 'D', 'E', 'R', 'Z'],
    ['A', 'B', 'C', 'D', 'E', 'F']
  ];

  const handleCellClick = (index: number) => {
    const newSelected = selectedCells.includes(index) 
      ? selectedCells.filter(i => i !== index)
      : [...selectedCells, index];
    
    setSelectedCells(newSelected);

    // Simple check: if selected letters form a word
    const selectedWord = newSelected.map(i => grid.flat()[i]).join('');
    const reversedWord = [...selectedWord].reverse().join('');
    
    words.forEach(word => {
      if ((selectedWord.includes(word) || reversedWord.includes(word)) && !found.includes(word)) {
        setFound([...found, word]);
        setSelectedCells([]); // Reset selection after finding a word
      }
    });
  };

  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-white/10 text-white w-full max-w-md shadow-2xl">
      <h3 className="text-xl font-bold mb-2 text-center">Sopa de Letras</h3>
      <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mb-6">Selecciona las letras para formar palabras</p>
      
      <div className="grid grid-cols-6 gap-2 mb-8">
        {grid.flat().map((char, i) => (
          <button 
            key={i} 
            onClick={() => handleCellClick(i)}
            className={`aspect-square flex items-center justify-center border rounded-lg font-black text-lg transition-all ${
              selectedCells.includes(i) 
                ? 'bg-cyan-500 border-cyan-400 text-white scale-110 z-10' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {words.map((word, i) => (
            <span 
              key={i}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                found.includes(word) 
                  ? 'bg-green-500/20 border-green-500 text-green-400' 
                  : 'bg-white/5 border-white/10 text-zinc-600'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
        
        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest">
            Progreso: <span className="text-cyan-400">{found.length} / {words.length}</span>
          </p>
          {found.length === words.length && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 bg-green-500 rounded-xl text-xs font-black uppercase">
              ¡Misión Cumplida! Puntaje Máximo
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReadingComprehension = () => {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      text: "¿La visión estratégica es estática y solo se enfoca en el presente?",
      correct: false
    },
    {
      text: "¿El pensamiento estratégico de Ohmae se basa en la intuición pura sin análisis?",
      correct: false
    },
    {
      text: "¿La planeación táctica sirve como puente entre la estrategia y la operación?",
      correct: true
    }
  ];

  const handleAnswer = (qIdx: number, val: boolean) => {
    setAnswers({ ...answers, [qIdx]: val });
  };

  const score = Object.entries(answers).filter(([idx, val]) => val === questions[Number(idx)].correct).length;

  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-white/10 text-white w-full max-w-lg shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="text-pink-500" /> Comprensión Lectora
      </h3>
      
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 text-sm text-zinc-400 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
        <p className="mb-4">
          La <strong>Administración Estratégica</strong> no es un destino, sino un proceso continuo de adaptación. Según Kenichi Ohmae, la "mente del estratega" combina la capacidad analítica con la intuición creativa para diseccionar problemas complejos y encontrar soluciones innovadoras que la competencia no puede prever.
        </p>
        <p className="mb-4">
          El proceso se despliega en niveles: mientras la <strong>Planeación Estratégica</strong> define el "qué" y el "hacia dónde" a largo plazo, la <strong>Planeación Táctica</strong> se encarga de coordinar los recursos de las áreas funcionales para hacer realidad esos objetivos. Finalmente, la <strong>Planeación Operativa</strong> aterriza todo en acciones diarias medibles.
        </p>
        <p>
          Sin un sistema de control robusto (como el MIS o el MDSS), la estrategia corre el riesgo de desviarse. El control no debe verse como una restricción, sino como un mecanismo de retroalimentación vital que permite corregir el rumbo en tiempo real.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="space-y-3">
            <p className="text-sm font-medium text-zinc-200">{i + 1}. {q.text}</p>
            <div className="flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => handleAnswer(i, val)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                    answers[i] === val 
                      ? 'bg-pink-500 border-pink-400 text-white' 
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:border-pink-500/50'
                  }`}
                >
                  {val ? "Verdadero" : "Falso"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowResults(true)}
        disabled={Object.keys(answers).length < questions.length}
        className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 font-black uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Finalizar Lectura
      </button>

      {showResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-white/5 border border-pink-500/30 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Tu Puntaje de Comprensión</p>
          <p className="text-4xl font-black text-pink-500">{score} / {questions.length}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {score === questions.length ? "¡Excelente análisis!" : "Te recomendamos repasar los niveles de planeación."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

const MultimediaSection = () => {
  const resources = [
    {
      type: 'video',
      title: 'Presentación Estratégica',
      description: 'Fundamentos y estructura del proyecto de Administración Estratégica.',
      url: 'https://drive.google.com/file/d/1WbUKQbpDsHACSGRsf-c8ihJ4nhTJkfJZ/view?usp=drive_link',
      color: 'cyan'
    },
    {
      type: 'video',
      title: 'Análisis de Habilidades',
      description: 'Desafíos interactivos y análisis profundo de la teoría académica.',
      url: 'https://drive.google.com/file/d/18ZHaEtov6OPIjZCdR55jeFBadLM3YpBs/view?usp=drive_link',
      color: 'purple'
    },
    {
      type: 'audio',
      title: 'Podcast: El Estratega',
      description: 'Episodio 01 — Fundamentos de la Planeación.',
      url: 'https://drive.google.com/file/d/1OkkQld4wG0m0WBrR6yxpObOg3tekf0xw/view?usp=drive_link',
      color: 'pink'
    },
    {
      type: 'audio',
      title: 'Podcast: El Estratega',
      description: 'Episodio 02 — Casos de Éxito y Estrategia.',
      url: 'https://drive.google.com/file/d/1bzksqocJ4sA3kJLPpyq-mG6h65uRkIb4/view?usp=drive_link',
      color: 'rose'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Recursos <span className="text-cyan-400">Multimedia</span></h2>
        <p className="text-zinc-500 tracking-[0.3em] text-sm font-bold uppercase">Enlaces a Contenido Audiovisual</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((res, i) => (
          <motion.a
            key={i}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-6 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${res.color}-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-${res.color}-500/20 transition-all`} />
            
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-4 rounded-2xl bg-${res.color}-500/20 text-${res.color}-400 shadow-inner`}>
                {res.type === 'video' ? <Video size={32} /> : <Music size={32} />}
              </div>
              <div className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-500 group-hover:text-white transition-colors">
                <ExternalLink size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="font-bold text-2xl mb-2 group-hover:text-cyan-400 transition-colors">{res.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{res.description}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {res.type === 'video' ? 'Ver Video' : 'Escuchar Audio'}
              </span>
              <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-${res.color}-500/10 text-${res.color}-400 border border-${res.color}-500/20`}>
                Google Drive
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    async function generateImages() {
      try {
        const prompts = [
          "Vibrant abstract geometric background with neon blues and purples, high tech aesthetic, 4k",
          "Colorful data visualization background, glowing lines and nodes, futuristic, 4k",
          "Dynamic business strategy illustration, abstract shapes representing growth and vision, vibrant colors, 4k",
          "Abstract leadership and teamwork concept, colorful silhouettes and connections, bright palette, 4k",
          "Futuristic classroom or learning environment, neon lights, digital screens, abstract, 4k",
          "Strategic mind map or brain with glowing connections, vibrant colors, 4k",
          "Success and achievement abstract concept, mountain peak with glowing path, vibrant, 4k"
        ];

        const generated = await Promise.all(prompts.map(async (prompt) => {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
          });
          const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
          return part ? `data:image/png;base64,${part.inlineData.data}` : `https://picsum.photos/seed/${prompt.length}/1920/1080`;
        }));
        
        setBgImages(generated);
      } catch (error) {
        console.error("Error generating images:", error);
        setBgImages([
          "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920"
        ]);
      } finally {
        setLoading(false);
      }
    }
    generateImages();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white gap-6">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-yellow-400 rounded-full"
        />
        <h2 className="text-xl font-bold tracking-widest uppercase animate-pulse bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Diseñando tu Estrategia...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* HERO SECTION */}
      <Section className="bg-gradient-to-br from-indigo-900 via-zinc-950 to-purple-900">
        <ParallaxImage src={bgImages[0]} speed={0.3} className="inset-0 opacity-40" />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-12"
          >
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Maestría en Administración Educativa</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8"
          >
            ADMINISTRACIÓN <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic font-serif">ESTRATÉGICA</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
            <div className="space-y-2">
              <p className="text-zinc-400 uppercase tracking-[0.5em] text-sm font-medium">Presentado por</p>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Juan Carlos Aranda Villalpando</h2>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] uppercase tracking-widest">Explorar Documento</span>
          <ArrowDown size={20} />
        </motion.div>
      </Section>

      {/* SECTION 1: FUNDAMENTOS */}
      <Section className="bg-zinc-950 border-y border-white/5">
        <ParallaxImage src={bgImages[1]} speed={0.1} className="top-0 right-0 w-1/2 h-full opacity-10" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Fundamentos y <span className="text-cyan-400">Origen</span></h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              La palabra estrategia deriva del griego <span className="text-white italic font-serif">strategeia</span>, que significa "arte o ciencia de ser general". 
              Desde la antigüedad, implica un componente vital de planeación y toma de decisiones para alcanzar objetivos complejos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Certo", desc: "Proceso para asegurar una estrategia apropiada." },
                { title: "Stoner", desc: "Proceso administrativo de actuar conforme a planes." },
                { title: "Pérez Moya", desc: "Conjunto de políticas para alcanzar objetivos a largo plazo." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-cyan-400 mb-2">{item.title}</h4>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10"
          >
            <img src={bgImages[1]} alt="Strategy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </motion.div>
        </div>
      </Section>

      {/* ACTIVITY 1: QUIZ INTERLEAVED */}
      <Section className="bg-zinc-900 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl font-black tracking-tighter">DESAFÍO <span className="text-cyan-400">01</span></h2>
            <p className="text-zinc-400 text-lg">
              Después de conocer los fundamentos, es momento de poner a prueba tu retención. ¿Estás listo para el primer reto estratégico?
            </p>
            <div className="flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-widest text-xs">
              <Zap size={20} /> Actividad Interactiva de Opción Múltiple
            </div>
          </div>
          <div className="flex justify-center">
            <Quiz />
          </div>
        </div>
      </Section>

      {/* IMAGE 1: LARGE VISUAL */}
      <Section className="p-0 min-h-[60vh]">
        <img src={bgImages[4]} alt="Visual 1" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 opacity-60" />
      </Section>

      {/* NEW SECTION: EL PROCESO MAESTRO */}
      <Section className="bg-zinc-900">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">El Proceso <span className="text-yellow-400">Maestro</span></h2>
            <p className="text-zinc-500 tracking-[0.3em] text-sm font-bold">5 PASOS PARA LA EXCELENCIA ESTRATÉGICA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Identidad", desc: "Establecimiento de Misión, Visión y Valores fundamentales.", color: "border-cyan-500" },
              { step: "02", title: "Entorno", desc: "Análisis Externo: Oportunidades y Amenazas del mercado.", color: "border-purple-500" },
              { step: "03", title: "Interno", desc: "Análisis Interno: Fortalezas y Debilidades de la organización.", color: "border-pink-500" },
              { step: "04", title: "Formulación", desc: "Creación de estrategias competitivas y funcionales.", color: "border-yellow-500" },
              { step: "05", title: "Ejecución", desc: "Implementación y Control de los planes de acción.", color: "border-green-500" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl bg-zinc-950 border-t-4 ${item.color} shadow-2xl flex flex-col gap-4`}
              >
                <span className="text-4xl font-black opacity-20">{item.step}</span>
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ACTIVITY 2: WORDSEARCH INTERLEAVED */}
      <Section className="bg-zinc-950 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1 flex justify-center">
            <WordSearch />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-5xl font-black tracking-tighter">DESAFÍO <span className="text-purple-500">02</span></h2>
            <p className="text-zinc-400 text-lg">
              La agudeza mental es clave para un estratega. Encuentra los conceptos pilares ocultos en nuestra sopa de letras interactiva.
            </p>
            <div className="flex items-center gap-4 text-purple-400 font-bold uppercase tracking-widest text-xs">
              <Layers size={20} /> Sopa de Letras con Puntuación en Tiempo Real
            </div>
          </div>
        </div>
      </Section>

      {/* IMAGE 2: LARGE VISUAL */}
      <Section className="p-0 min-h-[60vh]">
        <img src={bgImages[5]} alt="Visual 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950 opacity-60" />
      </Section>

      {/* SECTION 2: EL CORAZÓN ESTRATÉGICO (MISIÓN/VISIÓN) */}
      <Section className="bg-zinc-900/30">
        <div className="max-w-6xl mx-auto space-y-24 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">EL CORAZÓN <span className="text-purple-500">ORGANIZACIONAL</span></h2>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-sm">Misión, Visión y Valores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-b from-purple-600 to-indigo-700 text-white shadow-xl"
            >
              <Target size={48} className="mb-8" />
              <h3 className="text-3xl font-bold mb-4">Misión</h3>
              <p className="text-purple-100 leading-relaxed">
                Define el negocio de la empresa, establece su visión y articula sus principales valores. 
                Responde a la pregunta: <span className="font-bold italic">"¿En qué negocio estamos?"</span>
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-xl"
            >
              <Compass size={48} className="mb-8" />
              <h3 className="text-3xl font-bold mb-4">Visión</h3>
              <p className="text-cyan-100 leading-relaxed">
                Es la perspectiva de la dirección superior sobre el futuro. Inspira, establece retos y 
                muestra la esencia de lo que la empresa debe llegar a ser.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-xl"
            >
              <ShieldCheck size={48} className="mb-8" />
              <h3 className="text-3xl font-bold mb-4">Valores</h3>
              <p className="text-pink-100 leading-relaxed">
                Principios morales y filosóficos que guían la acción. Incluyen ética, calidad, 
                innovación y responsabilidad social.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ACTIVITY 3: READING COMPREHENSION INTERLEAVED */}
      <Section className="bg-zinc-950 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl font-black tracking-tighter">DESAFÍO <span className="text-pink-500">03</span></h2>
            <p className="text-zinc-400 text-lg">
              La comprensión profunda separa a los administradores de los estrategas. Analiza el texto y demuestra tu capacidad de síntesis.
            </p>
            <div className="flex items-center gap-4 text-pink-400 font-bold uppercase tracking-widest text-xs">
              <BookOpen size={20} /> Lectura de Comprensión con Evaluación Final
            </div>
          </div>
          <div className="flex justify-center">
            <ReadingComprehension />
          </div>
        </div>
      </Section>

      {/* IMAGE 3: LARGE VISUAL */}
      <Section className="p-0 min-h-[60vh]">
        <img src={bgImages[6]} alt="Visual 3" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 opacity-60" />
      </Section>

      {/* SECTION 3: ANÁLISIS Y TÉCNICAS */}
      <Section className="bg-zinc-950">
        <ParallaxImage src={bgImages[2]} speed={0.4} className="bottom-0 left-0 w-full h-1/2 opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-5xl font-bold tracking-tighter leading-none">ANÁLISIS <br /><span className="text-yellow-400">ESTRATÉGICO</span></h2>
              <p className="text-zinc-400">
                Herramientas críticas para diagnosticar la salud organizacional y el entorno competitivo.
              </p>
              <div className="space-y-4">
                {["Matriz MPC", "FODA Cruzado", "Auditoría Administrativa", "Ingeniería de Valor"].map((t, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-zinc-900 border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BarChart3 size={120} />
                </div>
                <h3 className="text-4xl font-black mb-6 text-white">FODA</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-tighter">
                  <div className="p-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">Fortalezas</div>
                  <div className="p-4 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">Oportunidades</div>
                  <div className="p-4 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">Debilidades</div>
                  <div className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">Amenazas</div>
                </div>
                <p className="mt-6 text-sm text-zinc-500 leading-relaxed">
                  Acrónimo para evaluar puntos fuertes y débiles internos frente a oportunidades y amenazas externas. Permite generar estrategias FO, DO, FA y DA.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5"
              >
                <Layers size={40} className="text-cyan-400 mb-6" />
                <h3 className="text-3xl font-bold mb-4 text-white">Matriz MPC</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  La Matriz de Perfil Competitivo identifica a los principales competidores de la empresa, así como sus fortalezas y debilidades particulares en relación con una muestra de la posición estratégica de la empresa.
                </p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Factores Críticos de Éxito</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Peso Relativo</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Calificación Competitiva</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* NEW SECTION: NIVELES DE PLANEACIÓN */}
      <Section className="bg-zinc-900/50">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-cyan-400" />
                  <h4 className="text-2xl font-bold text-cyan-400 mb-2">Planeación Estratégica</h4>
                  <p className="text-sm text-zinc-400 italic">Largo Plazo (3-5 años)</p>
                  <p className="mt-4 text-zinc-500">Enfocada en la organización como un todo. Define el rumbo general y los objetivos maestros.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-purple-500" />
                  <h4 className="text-2xl font-bold text-purple-500 mb-2">Planeación Táctica</h4>
                  <p className="text-sm text-zinc-400 italic">Mediano Plazo (1-2 años)</p>
                  <p className="mt-4 text-zinc-500">Enfocada en áreas o departamentos. Traduce los objetivos estratégicos en planes específicos.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-pink-500" />
                  <h4 className="text-2xl font-bold text-pink-500 mb-2">Planeación Operativa</h4>
                  <p className="text-sm text-zinc-400 italic">Corto Plazo (Día a día / Meses)</p>
                  <p className="mt-4 text-zinc-500">Enfocada en tareas y actividades específicas. Detalla el uso de recursos y tiempos.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-6xl font-black tracking-tighter leading-none">JERARQUÍA DE LA <br /><span className="text-cyan-400">PLANEACIÓN</span></h2>
              <p className="text-xl text-zinc-400 leading-relaxed">
                La planeación no es un evento único, sino un sistema en cascada que conecta la visión de la alta dirección con la ejecución en el campo.
              </p>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10">
                <h5 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-cyan-400" /> Alineación Estratégica</h5>
                <p className="text-sm text-zinc-500">
                  Cada nivel debe estar perfectamente alineado con el superior para asegurar que cada esfuerzo individual contribuya al éxito global de la empresa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4: DIRECCIÓN Y LIDERAZGO */}
      <Section className="bg-white text-zinc-950">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">DIRECCIÓN Y <br /><span className="text-purple-600">LIDERAZGO</span></h2>
              <p className="text-zinc-500 uppercase tracking-[0.4em] text-sm">El factor humano en la administración</p>
            </div>
            <div className="flex gap-4">
              <div className="px-8 py-4 rounded-full bg-zinc-100 font-bold text-xs uppercase tracking-widest border border-zinc-200">Motivación</div>
              <div className="px-8 py-4 rounded-full bg-purple-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/30">Comunicación</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users />, title: "Liderazgo", color: "bg-blue-500", desc: "Capacidad de influir sobre las personas para metas comunes." },
              { icon: <Zap />, title: "Motivación", color: "bg-yellow-500", desc: "Interacción entre el individuo y la situación laboral." },
              { icon: <MessageSquare />, title: "Comunicación", color: "bg-purple-500", desc: "Transferencia y comprensión de significados simbólicos." },
              { icon: <Activity />, title: "Control", color: "bg-pink-500", desc: "Asegurar que los eventos ocurran según lo planeado." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col gap-6"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg`}>
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold tracking-tight">{item.title}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[3rem] bg-zinc-950 text-white grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-4xl font-bold tracking-tight">Sistemas de <span className="text-cyan-400">Información y Control</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-xl mb-2 text-cyan-400">MIS / SIA</h5>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Sistemas de Información Administrativa que proporcionan informes periódicos para la toma de decisiones rutinarias.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="font-black text-xl mb-2 text-purple-400">MDSS</h5>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Sistemas de Apoyo a las Decisiones de Marketing. Herramientas interactivas para analizar datos y resolver problemas específicos.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">Tipos de Control</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-[10px] font-bold uppercase">Previo (Preventivo)</span>
                  <span className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-[10px] font-bold uppercase">Concurrente (Durante)</span>
                  <span className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-[10px] font-bold uppercase">Posterior (Retroalimentación)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="w-48 h-48 rounded-full border-8 border-cyan-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 border-8 border-cyan-500 border-t-transparent rounded-full animate-spin-slow" />
                <span className="text-xs font-black uppercase tracking-widest text-center">Rejilla <br /> Gerencial</span>
              </div>
              <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">Modelo de Blake & Mouton</p>
            </div>
          </div>
        </div>
      </Section>

      {/* MULTIMEDIA SECTION */}
      <Section className="bg-zinc-950 border-t border-white/5">
        <MultimediaSection />
      </Section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tighter">Juan Carlos Aranda Villalpando</h2>
            <p className="text-zinc-500 uppercase tracking-[0.6em] text-xs">Administración Estratégica © 2026</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            {["Estrategia", "Planeación", "Liderazgo", "Control"].map((link, i) => (
              <a key={i} href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-32 text-center">
          <p className="text-[10px] text-zinc-700 uppercase tracking-[1em]">CINADE — Centro de Investigación para la Administración Educativa</p>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
