export interface Conta {
    id: string;
    nome: string;
    saldo: number;
    type: string;
    agencia: string;
    conta: string;
    cdiPercent: number;
    efetivo?: boolean;
    cartoes?: { id: string; nome: string }[];
  }
  