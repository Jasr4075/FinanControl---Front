import { useState } from "react";
import api from "@/src/utils/api";
import { CreateDespesaInput } from "../types/types";

interface UseCreateDespesaReturn {
  createDespesa: (input: CreateDespesaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateDespesa(): UseCreateDespesaReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setError(res.data.errors ? JSON.stringify(res.data.errors) : "Erro desconhecido");
      }
    } catch (err) {
      let message = "Erro desconhecido";
      if (err && typeof err === "object" && "message" in err) {
        message = (err as any).message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { createDespesa, loading, error, success };
}
