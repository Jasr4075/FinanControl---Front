import { useState } from "react";
import api from "@/src/utils/api";

interface CreateDespesaInput {
  userId: string;
  contaId?: string;
  cartaoId?: string;
  categoryId: string;
  descricao: string;
  valor: number;
  metodoPagamento: "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO";
  data: string; // YYYY-MM-DD
  parcelado?: boolean;
  numeroParcelas?: number;
  juros?: number;
  observacoes?: string;
}

export function useCreateDespesa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const createDespesa = async (input: CreateDespesaInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post("/despesas", input);
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.errors || "Erro desconhecido");
      }
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createDespesa, loading, error, success };
}
