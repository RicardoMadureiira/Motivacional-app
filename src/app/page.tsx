"use client";
import { useRef, useState, useEffect } from "react";
import TypingFrases from "./TypingFrases";
import TypingReflection from "./TypingReflection";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { TbMusicOff } from "react-icons/tb";
import { FcIdea } from "react-icons/fc";
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
          <h1 className="text-yellow-500 text-xl flex items-center justify-center max-md:text-xl">
            Bem-vindo ao Hoje Inspira{" "}
            <span>
              <Image
                className="animate-pulse"
                src="/Inspira-icon.png"
                alt="Foto"
                height={50}
                width={50}
              />
            </span>
          </h1>
          <p className="text-zinc-500 mt-2 text-center max-md:text-sm italic">
            “Em 1 clique, você recebe algo inspirador para refletir no seu dia.”
          </p>

          <p className="text-yellow-500 mt-8 font-mono ">
            Uma faísca de inspiração te espera...
          </p>

          <DailyClickButton
            onDailyClick={handleDailyClick}
            onViewLastMessage={handleViewLastMessage}
          />

          {/* Ícone de música */}
          <button
            onClick={toggleMute}
            className="mt-5 z-50 flex gap-1 items-center text-yellow-500 hover:text-yellow-600 hover:cursor-pointer transition-colors text-2xl"
            title={isMuted ? "Desmutar música" : "Mutar música"}
          >
            <span className="text-gray-500 text-sm italic hover:text-yellow-600">
              Clique aqui para ouvir uma trilha sonora relaxante
            </span>
            {isMuted ? (
              <TbMusicOff />
            ) : (
              <IoMusicalNotesOutline className="animate-pulse" />
            )}
          </button>
        </div>
      ) : (
        // Tela com frases + reflexão
        <div className="flex flex-col justify-center mt-20 items-center min-h-screen">
          <div className="flex-grow h-screen">
            <div className="reflexao w-4xl min-2xl:w-5xl max-md:w-sm p-2 text-white pt-8">
              <h2 className="text-4xl max-md:text-2xl flex items-center justify-center text-yellow-600 font-bold mb-8">
                Inspirações de hoje{" "}
                <span>
                  <Image
                    className="animate-pulse"
                    src="/Inspira-icon.png"
                    alt="Foto"
                    height={50}
                    width={50}
                  />
                </span>
              </h2>

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
                <div className="pb-12">
                  <h2 className="text-3xl flex justify-center max-md:text-xl text-yellow-600 font-bold mt-10 text-center reflexao">
                    Um pensamento para refletir{" "}
                    <span className="animate-pulse ml-2">
                      <FcIdea />
                    </span>
                  </h2>
                  <div className="reflexao mt-5 group border-yellow-500 rounded-2xl flex items-center justify-center ">
                    <div className="text-orange-100 italic font-semibold text-center leading-relaxed">
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
            <div className="mb-6 text-yellow-500">
              <p className="text-lg max-md:text-sm">
                🔥 Faíscas seguidas:{" "}
                <span className="text-orange-400 font-bold">{streak}</span>{" "}
                {streak === 1 ? "dia" : "dias"} mantendo sua inspiração acesa.
              </p>
              <p className="text-sm text-zinc-400 italic text-center">
                Mantenha a sequência viva!
              </p>
            </div>
            <CountdownButton />
          </div>

          <div className="h-[20vh]"></div>

          {/* Rodapé */}
          <footer className="bg-black border-t-2 border-yellow-800 w-full p-10 mt-auto z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-yellow-500 text-lg font-semibold mb-1 flex items-center max-md:justify-center">
                  Hoje Inspira{" "}
                  <span>
                    <Image
                      src="/Inspira-icon.png"
                      alt="Foto"
                      height={30}
                      width={30}
                    />
                  </span>
                </p>
                <p>
                  Um espaço digital criado para acender pequenas faíscas no seu
                  dia.
                </p>
                <p className="mt-1">
                  Construído do zero por{" "}
                  <a
                    href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
                    target="_blank"
                    className="text-red-500 font-medium hover:text-red-400 transition"
                  >
                    Ricardo Madureira
                  </a>
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href="mailto:ricardomadureira.dev@gmail.com"
                  className="hover:text-white"
                >
                  Email
                </a>
                <a
                  href="https://my-portfolio-sooty-two-74.vercel.app/"
                  target="_blank"
                  className="hover:text-white"
                >
                  Portfolio
                </a>
                <a
                  href="https://github.com/RicardoMadureiira"
                  target="_blank"
                  className="hover:text-white"
                >
                  Github
                </a>
                <a
                  href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
                  target="_blank"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
