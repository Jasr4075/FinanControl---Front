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

export interface MovimentacaoReceita {
  id: string;
  tipo: "Receita" | "Despesa";
  descricao: string;
  valor: number;
  data: string;
  metodoPagamento: string;
  contas?: { bancoNome: string };
  categoria?: { name: string };
  cartao?: { name: string };
}

export interface Categoria {
  id: string;
  name: string;
  tipo: "RECEITA" | "DESPESA";
}

export interface CreateReceitaInput {
  userId: string;
  accountId: string;
  categoryId: string;
  description: string;
  quantidade: number;
  data: string;
}

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

export interface UseAuthUserReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
  isValid: boolean;
}

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

export type ValidRedirectPaths =
  | "/(dashboard)/home"
  | "/login"
  | "/(auth)/forgot-password";

export interface UseRedirectIfAuthOptions {
  redirectPath?: ValidRedirectPaths;
  onRedirect?: () => void;
  onStay?: () => void;
}