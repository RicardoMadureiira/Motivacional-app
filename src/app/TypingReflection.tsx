"use client";
import { useEffect, useState } from "react";

interface TypingReflectionProps {
  texto: string;
  speed?: number;
}

export default function TypingReflection({
  texto,
  speed = 50,
}: TypingReflectionProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [textoAtual, setTextoAtual] = useState("");

  useEffect(() => {
    if (charIndex < texto.length) {
      const timeout = setTimeout(() => {
        setTextoAtual((prev) => prev + texto[charIndex]);
        setCharIndex(charIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, texto, speed]);

  return (
    <p className="text-white italic text-center leading-relaxed">
      <span className="animate-pulse text-orange-100">“</span>
      {textoAtual}
      <span className="animate-pulse text-orange-100">”</span>
    </p>
  );
}
