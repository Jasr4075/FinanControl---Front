export type CartaoResumo = {
    id: string;
    nome: string;
    type: string;
    creditLimit: number;
    creditUsed: number;
    available: number;
    percentUsed: number;
    conta?: { conta: string; bancoNome: string; agencia: string, saldo?: number; };
  };
  