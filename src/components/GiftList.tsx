import type { Gift } from "../types";
import GiftItem from "./GiftItem";

interface GiftListProps {
  gifts: Gift[];
}

export default function GiftList({ gifts }: GiftListProps) {
  // Pega categorias únicas
  const categorias = Array.from(new Set(gifts.map((g) => g.categoria)));

  return (
    <div className="w-7xl px-12 text-center">
      {categorias.map((cat) => (
        <div key={cat} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts
              .filter((g) => g.categoria === cat)
              .map((gift) => (
                <GiftItem key={gift.id} gift={gift} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
