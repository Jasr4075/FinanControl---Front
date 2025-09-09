import { useState, useEffect } from "react";
import api from "@/src/utils/api";
import { useAlert } from "@/src/context/AlertContext";


export function useDespesasDetalhes(userId: string, refreshKey?: unknown) {
  const [despesas, setDespesas] = useState<{ id: string; descricao: string; valor: number; data: string }[]>([]);
  const alert = useAlert();

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/despesas/mes-atual/${userId}`);
        if (response.data.success) {
          const detalhes = response.data.data.map((d: any) => ({
            id: d.id,
            descricao: d.descricao,
            valor: Number(d.valor),
            data: d.data,
          }));
          setDespesas(detalhes);
        }
      } catch (err) {
        let message = "Não foi possível carregar os detalhes de despesas.";
        if (err instanceof Error) message += `\n${err.message}`;
  alert.showAlert("Erro", message);
      }
    };

    fetchDetalhes();
  }, [userId, refreshKey]);

  return despesas;
}

export function useReceitasDetalhes(userId: string, refreshKey?: unknown) {
  const [receitas, setReceitas] = useState<{
    data: string; id: string; descricao: string; valor: number 
}[]>([]);
  const alert = useAlert();

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/receitas/mes-atual/${userId}`);
        if (response.data.success) {
          const detalhes = response.data.data.map((r: any) => ({
            id: r.id,
            descricao: r.descricao,
            valor: Number(r.quantidade),
            data: r.data,
          }));
          setReceitas(detalhes);
        }
      } catch (err) {
        let message = "Não foi possível carregar os detalhes de receitas.";
        if (err instanceof Error) message += `\n${err.message}`;
  alert.showAlert("Erro", message);
      }
    };

    fetchDetalhes();
  }, [userId, refreshKey]);

  return receitas;
}
