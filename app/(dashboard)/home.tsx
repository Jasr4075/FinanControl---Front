import ActionButtonsRow from "@/src/components/organisms/ActionButtonsRow";
import ContasList from "@/src/components/organisms/ContasList";
import MovimentacoesList from "@/src/components/organisms/MovimentacoesList";
import ResumoFinanceiro from "@/src/components/organisms/ResumoFinanceiro";
import { useAuthUser, useDespesasMes, useReceitasMes } from "@/src/hooks";
import api from "@/src/utils/api";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

interface Conta {
  id: string;
  nome: string;
  saldo: number;
}
interface Movimentacao {
  id: string;
  tipo: "Receita" | "Despesa";
  descricao: string;
  valor: number;
  data: string;
}

export default function Home() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthUser();
  const userId = user?.id || "";

  const receitas = useReceitasMes(userId);
  const despesas = useDespesasMes(userId);

  const loadData = async () => {
  try {
    if (!userId) return;

    // Contas
    const contasRes = await api.get(`/contas/user/${userId}`);
    const contasData = contasRes.data.data.map((c: any) => ({
      id: c.id,
      nome: `${c.bancoNome} - ${c.conta}`,
      saldo: parseFloat(c.saldo),
    }));
    setContas(contasData);

    const total = contasData.reduce((acc: number, c: Conta) => acc + c.saldo, 0);
    setSaldoTotal(total);

    // Últimas despesas
    const despesasRes = await api.get(`/despesas/ultimas/${userId}`);
    const despesasData: Movimentacao[] = despesasRes.data.data.map((d: any) => ({
      id: d.id,
      tipo: "Despesa",
      descricao: d.descricao,
      valor: parseFloat(d.valor),
      data: d.createdAt,
    }));

    // Últimas receitas
    const receitasRes = await api.get(`/receitas/ultimas/${userId}`);
    const receitasData: Movimentacao[] = receitasRes.data.data.map((r: any) => ({
      id: r.id,
      tipo: "Receita",
      descricao: r.description,
      valor: parseFloat(r.quantidade),
      data: r.createdAt,
    }));

    // Juntando receitas e despesas e ordenando por data decrescente
    const todasMovimentacoes = [...receitasData, ...despesasData].sort(
  (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
);


    setMovimentacoes(todasMovimentacoes);

  } catch (err) {
    console.log(err);
    Alert.alert("Erro", "Não foi possível carregar os dados.");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};



  useEffect(() => {
    loadData();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#007AFF"
        />
      }
    >
      <View accessibilityRole="header" style={styles.header}>
        <Text style={styles.title}>Resumo Financeiro</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando seus dados...</Text>
        </View>
      ) : (
        <>
          <ResumoFinanceiro saldo={saldoTotal} receitas={receitas} despesas={despesas} />
          <ContasList contas={contas} />
          <ActionButtonsRow />
          <MovimentacoesList movimentacoes={movimentacoes} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f7", 
    padding: 16 
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#1C1C1E",
    textAlign: "center",
    marginTop: 10,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});