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
  
  export interface Categoria {
    id: string;
    name: string;
    tipo: "RECEITA" | "DESPESA";
  }
  