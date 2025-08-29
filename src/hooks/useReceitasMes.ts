import { useState, useEffect } from "react";
import api from "@/src/utils/api";
import { Alert } from "react-native";

export default function useReceitasMes(userId: string, refreshKey?: any) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        if (!userId) return;
        const response = await api.get(`/receitas/total-mes/${userId}`);
        if (response.data.success) {
          setTotal(response.data.total);
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Erro", "Não foi possível carregar o total de receitas.");
      }
    };

    fetchReceitas();
  }, [userId, refreshKey]);

  return total;
}
