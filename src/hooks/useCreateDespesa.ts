import { useState } from "react";
import api from "@/src/utils/api";
import { CreateDespesaInput } from "../types/types";

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
