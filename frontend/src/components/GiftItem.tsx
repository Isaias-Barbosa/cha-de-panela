import { Link } from "react-router-dom";
import type { Gift } from "../types";

interface GiftItemProps {
  gift: Gift;
}

export default function GiftItem({ gift }: GiftItemProps) {

  const isDisabled = gift.comprado;

  
  return (
     <div
      className={`relative p-4 bg-white rounded-2xl shadow-md flex flex-col items-center text-center transition ${
        isDisabled ? "opacity-90" : "hover:shadow-lg"
      }`}
    >

      {/* Conteúdo do card */}
      <div className="flex flex-col items-center flex-1 w-full">

      </div>
       {/* Imagem do presente */}
      <div className="relative">
        <img
          src={gift.imagem}
          alt={gift.nome}
          className={`w-48 h-48 object-cover rounded-lg mb-3 transition ${
            isDisabled ? "blur-sm brightness-90" : ""
          }`}
        />

       {/* Overlay com texto "Presenteado" */}
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            {/* leve camada translúcida */}
            <div className="absolute inset-0 bg-black/45 rounded-lg"></div>
            {/* texto nítido */}
            <span className="relative text-white font-semibold text-lg bg-black/90 px-3 py-1 rounded-lg shadow-lg">
              🎁 Presenteado
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-2">Imagem Ilustrativa</p>
       {/* Nome do presente */}
      <h3 className="font-semibold text-2xl mb-2 text-gray-800">{gift.nome}</h3>

      {/* Preferências */}
      {gift.tipo && (
        <p className="text-sm text-gray-500 mb-1">
          Sugestões:{" "}
          <span className="font-medium text-gray-700">{gift.tipo}</span>
        </p>
      )}

      {gift.corPreferencia && (
        <p className="text-sm text-gray-500 mb-2">
          Preferência de cor:{" "}
          <span
            className="font-medium"
            style={{ color: gift.corPreferencia.toLowerCase() }}
          >
            {gift.corPreferencia}
          </span>
        </p>
      )}

      {/* Sugestão de lojas */}
     {gift.links.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-2">Sugestão de lojas:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {gift.links.map((link) => (
              <a
                key={link.loja}
                href={isDisabled ? undefined : link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 border rounded-lg transition bg-white relative ${
                  isDisabled ? "cursor-not-allowed opacity-60" : "hover:shadow-lg"
                }`}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
              >
                <img
                  src={link.logo}
                  alt={link.loja}
                  className="w-10 h-10 object-contain"
                />
              </a>
            ))}
          </div>
        </>
      )}

      {/* Botão Presentear */}
      <div className="mt-auto w-full px-8 pt-4">
        <Link
          to={isDisabled ? "#" : `/present/${gift.id}`}
          onClick={(e) => {
            if (isDisabled) e.preventDefault();
          }}
          className={`block text-center px-4 py-2 rounded-lg w-full font-medium transition ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-600"
          }`}
          aria-disabled={isDisabled}
        >
          <p className="text-white">Presentear</p>
        </Link>
      </div>
    </div>
  );
}
