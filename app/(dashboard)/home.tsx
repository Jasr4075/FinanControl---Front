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
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Conta, Movimentacao } from "../../src/types/types";

export default function Home() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { user } = useAuthUser();
  const userId = user?.id || "";

  const receitas = useReceitasMes(userId);
  const despesas = useDespesasMes(userId);

  const loadData = async () => {
    try {
      if (!userId) return;

      const contasRes = await api.get(`/contas/user/${userId}`);
      const contasData = contasRes.data.data.map((c: any) => ({
        id: c.id,
        nome: `${c.bancoNome} - ${c.conta}`,
        saldo: parseFloat(c.saldo),
        type: c.type,
        agencia: c.agencia,
        conta: c.conta,
        cdiPercent: c.cdiPercent,
      }));
      setContas(contasData);

      const total = contasData.reduce((acc: number, c: Conta) => acc + c.saldo, 0);
      setSaldoTotal(total);

      const despesasRes = await api.get(`/despesas/ultimas/${userId}`);
      const despesasData: Movimentacao[] = despesasRes.data.data.map((d: any) => ({
        id: d.id,
        tipo: "Despesa",
        descricao: d.descricao,
        valor: parseFloat(d.valor),
        data: d.createdAt,
        metodoPagamento: d.metodoPagamento ?? "Sem método",
        conta: d.conta ? { bancoNome: d.conta.bancoNome } : undefined,
        categoria: d.categoria ? { name: d.categoria.name } : undefined,
        cartao: d.cartao ? { nome: d.cartao.nome } : undefined,
      }));

      const receitasRes = await api.get(`/receitas/ultimas/${userId}`);
      const receitasData: Movimentacao[] = receitasRes.data.data.map((r: any) => ({
        id: r.id,
        tipo: "Receita",
        descricao: r.descricao ?? r.description,
        valor: parseFloat(r.valor ?? r.quantidade),
        data: r.createdAt,
        conta: r.conta ? { bancoNome: r.conta.bancoNome } : undefined,
        categoria: r.categories ? { name: r.categories.name } : undefined,
      }));

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  // Datos para la FlatList
  const sections = [
    { type: 'header', data: ['header'] },
    { type: 'resumo', data: ['resumo'] },
    { type: 'contas', data: ['contas'] },
    { type: 'actions', data: ['actions'] },
    { type: 'movimentacoes', data: ['movimentacoes'] },
  ];

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'header':
        return (
          <View accessibilityRole="header" style={styles.header}>
            <Text
              style={styles.greeting}
              onPress={() => router.push("/(dashboard)/profile")}
            >
              Olá, {user?.nome || "usuário"} 👋
            </Text>
            <Text style={styles.title}>Resumo Financeiro</Text>
          </View>
        );
      case 'resumo':
        return <ResumoFinanceiro saldo={saldoTotal} receitas={receitas} despesas={despesas} />;
      case 'contas':
        return <ContasList contas={contas} scrollEnabled={false} />;
      case 'actions':
        return (
          <View style={{ marginVertical: 20 }}>
            <ActionButtonsRow onUpdateData={loadData} />
          </View>
        );
      case 'movimentacoes':
        return <MovimentacoesList movimentacoes={movimentacoes} scrollEnabled={false} />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={['header', 'resumo', 'contas', 'actions', 'movimentacoes']}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item}-${index}`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#007AFF"
        />
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    paddingBottom: 40, // Espacio adicional al final
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C1C1E",
    textAlign: "center",
    marginTop: 4,
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