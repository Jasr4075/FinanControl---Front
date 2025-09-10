export interface CreateDespesaInput {
    userId: string;
    contaId?: string;
    cartaoId?: string;
    categoryId: string;
    descricao: string;
    valor: number;
    metodoPagamento: "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO";
    data: string;
    parcelado?: boolean;
    numeroParcelas?: number;
    juros?: number;
    observacoes?: string;
  }
  