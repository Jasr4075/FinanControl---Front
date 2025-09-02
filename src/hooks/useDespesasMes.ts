import { useState, useEffect } from "react";
import api from "@/src/utils/api";
import { Alert } from "react-native";

export default function useDespesasMes(userId: string, refreshKey?: unknown) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchDespesas = async () => {
      try {
        if (!userId) return;
        const response = await api.get(`/despesas/total-mes/${userId}`);
        if (response.data.success) {
          setTotal(response.data.total);
        }
      } catch (err) {
        let message = "Não foi possível carregar o total de despesas.";
        if (err instanceof Error) message += `\n${err.message}`;
        Alert.alert("Erro", message);
      }
    };

    fetchDespesas();
  }, [userId, refreshKey]);

  return total;
}
