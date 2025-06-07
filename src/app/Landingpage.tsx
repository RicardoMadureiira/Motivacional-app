import { FaLock } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4">
      {/* Título */}
      <h1 className="text-4xl sm:text-5xl font-semibold mb-6 text-center text-orange-400">
        Hoje Inspira
      </h1>

      {/* Preview de frase */}
      <p className="mb-4 italic text-sm text-orange-200 text-center">
        “Você só precisa dar um passo hoje.”
      </p>

      {/* Botão bloqueado */}
      <button
        id="btn-shine"
        className="border border-orange-400 text-gray-400 rounded-full px-20 py-3 text-lg flex items-center gap-2 cursor-not-allowed hover:brightness-110 transition-all duration-300"
        disabled
      >
        <FaLock className="text-orange-400" />
        Me Inspire
      </button>

      <p className="mt-4 italic text-sm text-gray-500 text-center">
        “Em 1 clique, você recebe algo inspirador para refletir no seu dia.”
      </p>

      {/* Explicação */}
      <p className="mt-6 max-w-md text-center text-sm text-gray-400">
        Por apenas <span className="text-white font-semibold">R$ 4,00</span>{" "}
        você recebe diariamente
        <br />
        <span className="text-orange-300">
          3 frases motivacionais e 1 reflexão para sua vida.
        </span>
      </p>

      {/* Chamada para ação */}
      <button className="mt-8 bg-orange-500 hover:bg-yellow-600 cursor-pointer transition-all text-white rounded-full px-6 py-2 text-sm">
        Quero desbloquear
      </button>

      {/* Frase de reforço */}
      <p className="mt-4 text-xs text-white">
        Menos que um café, mais que um impulso diário.
      </p>
    </div>
  );
}
