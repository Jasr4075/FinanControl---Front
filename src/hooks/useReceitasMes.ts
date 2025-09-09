import { useState, useEffect } from "react";
import api from "@/src/utils/api";
import { useAlert } from "@/src/context/AlertContext";

export default function useReceitasMes(userId: string, refreshKey?: unknown) {
  const [total, setTotal] = useState(0);
  const alert = useAlert();

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        if (!userId) return;
        const response = await api.get(`/receitas/total-mes/${userId}`);
        if (response.data.success) {
          setTotal(response.data.total);
        }
      } catch (err) {
        let message = "Não foi possível carregar o total de receitas.";
        if (err instanceof Error) message += `\n${err.message}`;
  alert.showAlert("Erro", message);
      }
    };

    fetchReceitas();
  }, [userId, refreshKey]);

  return total;
}
