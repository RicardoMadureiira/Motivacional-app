"use client";
import { useEffect, useState } from "react";

interface TypingFrasesProps {
  frases: string[];
  speed?: number;
}

export default function TypingFrases({
  frases,
  speed = 50,
}: TypingFrasesProps) {
  const [linhas, setLinhas] = useState<string[]>([]);
  const [linhaAtual, setLinhaAtual] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [textoAtual, setTextoAtual] = useState("");

  useEffect(() => {
    if (linhaAtual >= frases.length) return;

    const frase = frases[linhaAtual];

    if (charIndex < frase.length) {
      const timeout = setTimeout(() => {
        setTextoAtual((prev) => prev + frase[charIndex]);
        setCharIndex(charIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // terminou de digitar a frase
      const timeout = setTimeout(() => {
        setLinhas((prev) => [...prev, frase]);
        setTextoAtual("");
        setLinhaAtual(linhaAtual + 1);
        setCharIndex(0);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, linhaAtual, frases, speed]);

  return (
    <>
      {linhas.map((frase, i) => (
        <p key={i} className="text-gray-200 leading-relaxed">
          <span className="text-yellow-500">{i + 1} </span>- {frase}
        </p>
      ))}
      {linhaAtual < frases.length && (
        <p className="text-gray-200 leading-relaxed">
          <span className="text-yellow-500">{linhaAtual + 1} </span>-{" "}
          {textoAtual}
          <span className="animate-pulse">|</span>
        </p>
      )}
    </>
  );
}
