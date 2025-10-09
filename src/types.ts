export interface Gift {
  id: number;
  nome: string;
  imagem: string;
  linkCompra: string;
  comprado: boolean;
}

export interface GiftLink {
  loja: string;      // Ex: "Amazon"
  url: string;       // link direto para o produto
  logo: string;      // url da logo da loja
}

export interface Gift {
  id: number;
  nome: string;
  imagem: string;
  categoria: string;     // ex: "Cama, Mesa e Banho"
  links: GiftLink[];     // array de lojas
  comprado: boolean;
  tipo?: string;
  corPreferencia?: string;
}
