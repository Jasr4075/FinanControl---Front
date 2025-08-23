// src/hooks/useUltimasDespesas.ts
import { useEffect, useState } from "react";
import api from "../utils/api";
import { getUser } from "../utils/auth";

interface Movimentacao {
  id: string;
  tipo: "Receita" | "Despesa";
  descricao: string;
  valor: number;
  data: string;
  metodoPagamento: string;
  conta?: { bancoNome: string };
  categoria?: { name: string };
}

export function useUltimasDespesas() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUltimas() {
      try {
        const user = await getUser();
        if (!user?.id) return;

        const res = await api.get(`/despesas/ultimas/${user.id}`);
        if (res.data.success) {
          const data: Movimentacao[] = res.data.data.map((d: any) => ({
            id: d.id,
            tipo: "Despesa",
            descricao: d.descricao,
            valor: parseFloat(d.valor),
            data: d.data,
            metodoPagamento: d.metodoPagamento,
            conta: d.conta ? { bancoNome: d.conta.bancoNome } : undefined,
            categoria: d.categoria ? { name: d.categoria.name } : undefined,
          }));

          setMovimentacoes(data);
        }
      } catch (e) {
        console.error("Erro ao carregar últimas despesas", e);
      } finally {
        setLoading(false);
      }
    }

    fetchUltimas();
  }, []);

  return { movimentacoes, loading };
}
