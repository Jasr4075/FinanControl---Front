// src/types.ts
export interface Conta {
  id: string;
  nome: string;
  saldo: number;
  type: string;
  agencia: string;
  conta: string;
  cdiPercent: number;
  cartoes: string[];
}

export interface Movimentacao {
  id: string;
  tipo: "Receita" | "Despesa";
  descricao: string;
  valor: number;
  data: string;
  metodoPagamento: string;
  conta?: { bancoNome: string };
  categoria?: { name: string };
  cartao?: { name: string };
}
