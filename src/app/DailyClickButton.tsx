"use client";
import { useState, useEffect } from "react";

interface DailyClickButtonProps {
  onDailyClick: () => void;
  onViewLastMessage?: () => void;
  className?: string;
}

const DailyClickButton = ({
  onDailyClick,
  onViewLastMessage,
  className = "",
}: DailyClickButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  // Função para verificar se o botão pode ser clicado
  const canClick = () => {
    const lastClickDate = localStorage.getItem("lastInspireClickDate");
    const today = new Date().toDateString();

    return !lastClickDate || lastClickDate !== today;
  };

  // Verificar status do botão ao carregar o componente
  useEffect(() => {
    const checkButtonStatus = () => {
      if (!canClick()) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    };

    checkButtonStatus();

    // Verificar a cada minuto se o dia mudou
    const interval = setInterval(checkButtonStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!canClick()) return;

    // Marcar como clicado hoje
    localStorage.setItem("lastInspireClickDate", new Date().toDateString());

    // Executar a função passada como prop
    onDailyClick();

    // Atualizar estado
    setIsDisabled(true);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        id="btn-shine"
        className={`mt-6 btn-refletir ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h1
          className={`flex w-[40dvh] items-center justify-center text-xl ${
            isDisabled
              ? "text-gray-600 hover:cursor-not-allowed"
              : "hover:cursor-not-allowed text-gray-400"
          }`}
        >
          {isDisabled ? "Faísca já acesa!" : "Me Inspire"}
        </h1>
      </button>

      {/* Botão para ver última mensagem quando está bloqueado */}
      {isDisabled && onViewLastMessage && (
        <button
          onClick={() => {
            onViewLastMessage();
          }}
          className="z-100 mt-4 px-6 py-2 border border-yellow-600 text-yellow-500 rounded-lg hover:bg-yellow-600 hover:text-black transition-all duration-300 text-sm font-medium cursor-pointer"
        >
          📖 Ver Última Inspiração
        </button>
      )}
    </div>
  );
};

export default DailyClickButton;
