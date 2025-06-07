import { NextResponse } from 'next/server';
import frases from '@/data/frases.json';
import reflexoes from '@/data/reflexoes.json';

export async function GET() {
  const frasesAleatorias = frases.sort(() => 0.5 - Math.random()).slice(0, 3);
  const reflexaoAleatoria = reflexoes[Math.floor(Math.random() * reflexoes.length)];

  return NextResponse.json({
    frases: frasesAleatorias,
    reflexao: reflexaoAleatoria
  });
}
