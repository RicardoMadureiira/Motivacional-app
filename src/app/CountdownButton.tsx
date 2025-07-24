"use client";
import { useEffect, useState } from "react";
import { FaHourglassHalf } from "react-icons/fa";

interface InspireButtonProps {
  onInspire?: () => void;
}

export default function InspireButton({ onInspire }: InspireButtonProps) {
  const [nextReset, setNextReset] = useState("");
  const [canInspire, setCanInspire] = useState(true);

  useEffect(() => {
    const checkInspirationStatus = () => {
      const lastInspiration = localStorage.getItem("lastInspiration");
      const now = new Date();
      const today = now.toDateString();

      if (lastInspiration === today) {
        setCanInspire(false);
      } else {
        setCanInspire(true);
      }

      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(now.getDate() + 1);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      setNextReset(`${hours}h ${minutes}min`);
    };

    checkInspirationStatus();
    const interval = setInterval(checkInspirationStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!canInspire) return;

    localStorage.setItem("lastInspiration", new Date().toDateString());
    setCanInspire(false);
    onInspire?.();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-xl text-zinc-600 font-light">
        Próxima Inspiração em:
      </span>
      <button
        disabled={!canInspire}
        onClick={handleClick}
        className={`mt-2 px-12 py-4 rounded-xl border border-yellow-600 text-gray-300 text-lg flex flex-col items-center transition-all duration-300 ${
          !canInspire ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        }`}
      >
        <span className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
          <FaHourglassHalf className="animate-pulse" />
          <span className="text-white">{nextReset}</span>
        </span>
      </button>
      <p className="text-sm mt-2 text-zinc-500">Apenas 1 clique por dia!</p>
    </div>
  );
}
