"use client";
import { useRef, useState } from "react";
import { useEffect } from "react";
import LandingPage from "./Landingpage";
import TypingFrases from "./TypingFrases";
import TypingReflection from "./TypingReflection";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { TbMusicOff } from "react-icons/tb";
import CountdownButton from "./CountdownButton";

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
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
        audioRef.current.play(); // Força play ao desmutar
      }
    }
  };

  const [mensagem, setMensagem] = useState<{
    frases: string[];
    reflexao: string;
  } | null>(null);

  const gerarMensagem = async () => {
    const res = await fetch("/api/gerar-mensagem");
    const data = await res.json();
    setMensagem(data);
    setClicked(true);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-black min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Música de fundo */}
      <audio ref={audioRef} autoPlay muted loop>
        <source
          src="/Music/relaxing-ambient-music-rain-354479.mp3"
          type="audio/mp3"
        />
      </audio>

      {loggedIn ? (
        !clicked ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-yellow-500 text-xl max-md:text-xl">
              Bem-vindo ao seu momento de inspiração!
            </h1>
            <p className="text-zinc-500 mt-2 text-center max-md:text-sm italic">
              “Em 1 clique, você recebe algo inspirador para refletir no seu
              dia.”
            </p>
            <p className="text-zinc-500 max-md:text-sm italic mt-2">
              “Você só precisa dar um passo hoje.”
            </p>
            <p className="text-yellow-500 mt-8 font-mono ">
              Uma faísca de inspiração te espera...
            </p>
            <button
              id="btn-shine"
              className="mt-6 btn-refletir"
              onClick={() => {
                setClicked(true);
                gerarMensagem();
              }}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <h1 className="hover:cursor-pointer text-gray-400 flex w-[40dvh] items-center justify-center text-xl">
                Me Inspire
              </h1>
            </button>

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
                <IoMusicalNotesOutline className=" animate-pulse" />
              )}
            </button>
          </div>
        ) : (
          // 3 frases motivacionais e 1 reflexão
          <div className="reflexao mt-10 flex-col items-center justify-center gap-3 text-white">
            {/* Ícone de música */}
            <button
              onClick={toggleMute}
              className="fixed top-1 right-2 z-10 text-yellow-500 hover:text-yellow-400 hover:scale-105 hover:cursor-pointer text-3xl"
              title={isMuted ? "Desmutar música" : "Mutar música"}
            >
              {isMuted ? <TbMusicOff /> : <IoMusicalNotesOutline />}
            </button>
            <h2 className="text-2xl text-yellow-600 font-bold text-center">
              Inspirações de hoje 🔥
            </h2>

            <div className="flex flex-col items-start justify-center font-mono p-6 bg-black/50 border-l-4 border-r-4 border-yellow-500 rounded-2xl shadow-md shadow-black w-[560px] max-md:w-[380px] h-5/6 gap-4 mt-2">
              {mensagem?.frases && (
                <TypingFrases
                  frases={mensagem.frases}
                  onFinished={() => setShowReflection(true)}
                />
              )}
            </div>

            {showReflection && (
              <div>
                <h2 className="text-xl text-yellow-600 font-bold mt-6 text-center reflexao">
                  Um pensamento para refletir 💡
                </h2>
                <div className="reflexao group w-[560px] max-md:w-[380px] mt-4 p-6 bg-black/50 border-l-4 border-r-4 border-yellow-500 rounded-2xl shadow-md shadow-black min-h-[14rem] flex items-center justify-center overflow-hidden relative">
                  <p className="text-orange-100 italic font-semibold text-center leading-relaxed">
                    {mensagem?.reflexao && (
                      <TypingReflection texto={mensagem.reflexao} />
                    )}
                  </p>
                </div>
                <p className="text-yellow-400 text-center mt-4 max-md:text-sm">
                  🎯 Desafio de hoje:{" "}
                  <span className="text-white">
                    “ Elogie alguém que você admira. ”
                  </span>
                </p>
                <div className="mt-12">
                  <CountdownButton />
                </div>
              </div>
            )}

            <footer className="fixed h-screen flex items-center justify-center "></footer>
          </div>
        )
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
