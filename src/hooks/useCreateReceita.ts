import { useState } from "react";
import api from "@/src/utils/api";
import { CreateReceitaInput } from "../types/types";

export function useCreateReceita() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
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
        setError(res.data?.errors || "Erro desconhecido");
      }
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createReceita, loading, error, success };
} 