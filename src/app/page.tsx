"use client";
import { useRef, useState, useEffect } from "react";
import TypingFrases from "./TypingFrases";
import TypingReflection from "./TypingReflection";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { TbMusicOff } from "react-icons/tb";
import CountdownButton from "./CountdownButton";
import DailyClickButton from "./DailyClickButton";
import Image from "next/image";

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [streak, setStreak] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [mensagem, setMensagem] = useState<{
    frases: string[];
    reflexao: string;
  } | null>(null);

  useEffect(() => {
    const storedStreak = localStorage.getItem("streak");
    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }

    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.warn("Autoplay bloqueado pelo navegador:", error);
      }
    };

    playAudio();
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const muted = !audioRef.current.muted;
      audioRef.current.muted = muted;
      setIsMuted(muted);
      if (!muted) {
        audioRef.current.play();
      }
    }
  };

  const gerarMensagem = async () => {
    const res = await fetch("/api/gerar-mensagem");
    const data = await res.json();
    setMensagem(data);
    setClicked(true);
    localStorage.setItem("lastInspireMessage", JSON.stringify(data));
  };

  const handleDailyClick = () => {
    setClicked(true);
    gerarMensagem();
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streak", newStreak.toString());
  };

  const handleViewLastMessage = () => {
    const lastMessage = localStorage.getItem("lastInspireMessage");
    if (lastMessage) {
      const parsedMessage = JSON.parse(lastMessage);
      setMensagem(parsedMessage);

      setClicked(true);
    } else {
      alert("Nenhuma inspiração salva. Clique em 'Me Inspire' primeiro.");
    }
  };

  return (
    <div className="bg-black min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-col">
      {/* Linhas de fundo */}
      <div id="lines">
        {Array.from({ length: 10 }).map((_, i) => (
          <div id="line" key={i}></div>
        ))}
      </div>

      {/* Música de fundo */}
      <audio ref={audioRef} autoPlay muted loop>
        <source
          src="/Music/relaxing-ambient-music-rain-354479.mp3"
          type="audio/mp3"
        />
      </audio>

      {!clicked ? (
        // Tela inicial
        <div className="flex flex-col items-center justify-center flex-grow">
          <span>
            <Image
              className="relative z-10 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-bounce max-sm:w-20"
              style={{ animationDuration: "4s" }}
              src="/Inspira-icon.png"
              alt="Foto"
              height={100}
              width={100}
            />
          </span>
          <h1 className="text-amber-500 text-4xl md:text-5xl lg:text-6xl font-thin tracking-tighter text-center mb-6">
            Hoje Inspira
          </h1>
          <p className="text-zinc-400 mt-2 text-center max-md:text-sm italic">
            “Em 1 clique, você recebe algo inspirador para refletir no seu dia.”
          </p>

          <p className="text-yellow-500/90  mt-7 font-mono ">
            Uma faísca de inspiração te espera
            <span className="animate-pulse">...</span>
          </p>

          <DailyClickButton
            onDailyClick={handleDailyClick}
            onViewLastMessage={handleViewLastMessage}
          />
        </div>
      ) : (
        // Tela com frases + reflexão
        <div className="flex flex-col justify-center mt-20 items-center min-h-screen">
          <div className="flex-grow h-screen">
            <div className="w-4xl min-2xl:w-5xl max-md:w-sm p-2 text-white pt-8">
              <header className="flex flex-col items-center w-full mb-12">
                {/* Subtítulo discreto acima (opcional, mas dá um charme) */}
                <span className="text-zinc-700 font-black text-[10px] uppercase tracking-[0.5em] mb-2">
                  Sua dose diária
                </span>

                <div className="flex items-center justify-center gap-4 w-full">
                  {/* Linha da esquerda com degradê para sumir suavemente */}
                  <div className="h-[1px] flex-grow max-w-[40px] md:max-w-[80px] bg-gradient-to-r from-transparent to-zinc-800"></div>

                  <h2 className="text-2xl md:text-4xl flex items-center gap-3 text-zinc-500 font-light tracking-[0.2em] uppercase">
                    Inspirações
                    <div className="relative">
                      {/* Glow suave atrás do ícone */}
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse"></div>
                      <Image
                        className="relative z-10 opacity-80"
                        src="/Inspira-icon.png"
                        alt="Foto"
                        height={40}
                        width={40}
                      />
                    </div>
                  </h2>

                  {/* Linha da direita com degradê */}
                  <div className="h-[1px] flex-grow max-w-[40px] md:max-w-[80px] bg-gradient-to-l from-transparent to-zinc-800"></div>
                </div>
              </header>

              <div className="flex flex-col items-start text-2xl min-2xl:text-3xl min-2xl:ml-15 ml-7 gap-2 font-mono max-md:text-lg  mt-2">
                {mensagem?.frases && (
                  <TypingFrases
                    frases={mensagem.frases}
                    onFinished={() => {
                      if (!showReflection) setShowReflection(true);
                    }}
                  />
                )}
              </div>

              {showReflection && (
                <div className="pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {/* Container do Título com as bordinhas laterais */}
                  <div className="flex items-center justify-center gap-4 mt-10 mb-6">
                    {/* Linha da esquerda */}
                    <div className="h-[1px] flex-grow max-w-[50px] bg-zinc-800"></div>

                    <h2 className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] md:text-xs font-black text-center">
                      Um pensamento para refletir
                    </h2>

                    {/* Linha da direita */}
                    <div className="h-[1px] flex-grow max-w-[50px] bg-zinc-800"></div>
                  </div>

                  {/* Container da Reflexão */}
                  <div className="reflexao group rounded-2xl flex items-center justify-center p-4">
                    <div className="text-zinc-400 italic font-medium text-center leading-relaxed text-sm md:text-lg max-w-2xl">
                      {mensagem?.reflexao && (
                        <TypingReflection texto={mensagem.reflexao} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {/* Streak */}
            <div className="mb-6 mt-15 flex flex-col justify-center items-center text-yellow-500">
              <p className="text-lg max-md:text-sm text-zinc-500 text-[15px] uppercase tracking-[0.2em] font-medium mb-1">
                🔥Sequência de Inspirações{" "}
              </p>
              <span className="text-orange-400 font-bold ">
                {streak} {streak === 1 ? "dia" : "dias"}
              </span>{" "}
            </div>
            <CountdownButton />
          </div>

          <div className="h-[20vh]"></div>
        </div>
      )}

      {/* Ícone de música */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 flex items-center cursor-pointer gap-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-2 pr-5 rounded-full hover:border-amber-500/40 transition-all active:scale-95 group shadow-lg opacity-60 hover:opacity-100"
      >
        <div className="p-1 rounded-full text-amber-500">
          {isMuted ? (
            <TbMusicOff size={18} className="text-zinc-500" />
          ) : (
            <IoMusicalNotesOutline size={18} className="animate-pulse" />
          )}
        </div>

        <span className="text-[9px] uppercase tracking-[0.25em] font-black text-zinc-400 group-hover:text-amber-500 transition-colors">
          {isMuted ? "Mudo" : "Som"}
        </span>
      </button>

      {/* Rodapé */}
      <footer className="border-t border-white/[0.05] bg-black/40 backdrop-blur-2xl w-full py-10 px-6 mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Lado Esquerdo: Branding */}
          <div className="text-center md:text-left group cursor-default">
            <div className="flex items-center gap-2 max-md:justify-center mb-2">
              {/* Diminuído de text-base/lg para text-xs/sm */}
              <p className="text-zinc-200 text-xs md:text-sm font-black tracking-[0.2em] uppercase group-hover:text-amber-500 transition-colors duration-500">
                Hoje Inspira
              </p>
              <Image
                src="/Inspira-icon.png"
                alt="Foto"
                height={18}
                width={18}
                className="opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 grayscale group-hover:grayscale-0"
              />
            </div>

            {/* Diminuído para 9px no mobile e 10px no desktop */}
            <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-semibold leading-relaxed">
              Construído do zero por{" "}
              <a
                href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
                target="_blank"
                className="text-zinc-400 hover:text-amber-500 transition-all border-b border-zinc-800 hover:border-amber-500 pb-0.5"
              >
                Ricardo Madureira
              </a>
            </p>
          </div>

          {/* Lado Direito: Links Sociais */}
          {/* Diminuído para 9px no mobile e 10px no desktop */}
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
            <a
              href="mailto:ricardomadureira.dev@gmail.com"
              className="hover:text-zinc-100 transition-all relative group py-1"
            >
              Email
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all group-hover:w-full opacity-70"></span>
            </a>

            <a
              href="https://github.com/RicardoMadureiira"
              target="_blank"
              className="hover:text-zinc-100 transition-all relative group py-1"
            >
              Github
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all group-hover:w-full opacity-70"></span>
            </a>

            <a
              href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
              target="_blank"
              className="hover:text-zinc-100 transition-all relative group py-1"
            >
              LinkedIn
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all group-hover:w-full opacity-70"></span>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
