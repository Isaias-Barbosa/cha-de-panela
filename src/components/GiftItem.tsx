import type { Gift } from "../types";

interface GiftItemProps {
  gift: Gift;
}

export default function GiftItem({ gift }: GiftItemProps) {
  return (
    <div className="relative p-4 bg-white rounded-2xl shadow-md flex flex-col items-center text-center transition">
      {/* Imagem do presente */}
      <img
        src={gift.imagem}
        alt={gift.nome}
        className={`w-48 h-48 object-cover rounded-lg mb-3 transition ${
          gift.comprado ? "opacity-30" : "opacity-100"
        }`}
      />

      {/* Overlay de comprado */}
      {gift.comprado && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-2xl">
          <span className="text-white font-bold text-lg">Comprado ✅</span>
        </div>
      )}

      {/* Nome do presente */}
      <h3
        className={`font-semibold text-lg mb-2 ${
          gift.comprado ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {gift.nome}
      </h3>

      {/* Preferências */}
      {gift.tipo && (
        <p className="text-sm text-gray-500 mb-1">
          Tipo preferido:{" "}
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
          <p className="text-sm text-gray-500 mb-2">Sugestão de lojas</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {gift.links.map((link) => (
                          <a
              key={link.loja}
              href={gift.comprado ? "#" : link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border rounded-lg hover:shadow-lg transition bg-white relative"
            >
              {gift.comprado && (
                <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg"></div>
              )}
              <img
                src={link.logo}
                alt={link.loja}
                className={`w-10 h-10 object-contain ${gift.comprado ? "opacity-50" : ""}`}
              />
            </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
