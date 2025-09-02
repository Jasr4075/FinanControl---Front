import { useState } from "react";
import api from "@/src/utils/api";
import { CreateReceitaInput } from "../types/types";

interface UseCreateReceitaReturn {
  createReceita: (input: CreateReceitaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateReceita(): UseCreateReceitaReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createReceita = async (input: CreateReceitaInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.post("/receitas", input);
      if (res.data?.success) {
        setSuccess(true);
      } else {
        setError(res.data?.errors ? JSON.stringify(res.data.errors) : "Erro desconhecido");
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

  return { createReceita, loading, error, success };
}
