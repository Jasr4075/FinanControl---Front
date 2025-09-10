export type ParcelaApi = {
    id: string;
    numeroParcela: number;
    valor: number | string;
    dataVencimento: string;
    paga: boolean;
    dataPagamento: string | null;
    despesa: {
      id: string;
      descricao: string;
      valor: number | string;
      metodoPagamento: string;
      data: string;
    };
  };
  
  export type FaturaDetalhe = {
    fatura: {
      id: string;
      cartaoId: string;
      mes: number;
      ano: number;
      valorTotal: number | string;
      valorPago: number | string;
      paga: boolean;
      parcelas: ParcelaApi[];
    };
    resumo: { restante: number; percentPago: number };
  };
  