import { useState, useEffect } from "react";
import api from "@/src/utils/api";
import { useAlert } from "@/src/context/AlertContext";

export default function useReceitasDetalhes(userId: string, refreshKey?: unknown) {
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
