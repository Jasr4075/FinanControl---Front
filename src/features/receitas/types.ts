import { Categoria } from "@/src/types/common";

export interface MovimentacaoReceita {
  id: string;
  tipo: "Receita";
  descricao: string;
  valor: number;
  data: string;
  metodoPagamento: string;
  contas?: { bancoNome: string };
  categoria?: Categoria;
  cartao?: { name: string };
}

export interface CreateReceitaInput {
  userId: string;
  accountId: string;
  categoryId: string;
  description: string;
  quantidade: number;
  data: string;
}
