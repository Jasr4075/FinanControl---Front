import ActionButtonsRow from "@/src/components/organisms/ActionButtonsRow";
import ContasList from "@/src/components/organisms/ContasList";
import MovimentacoesList from "@/src/components/organisms/MovimentacoesList";
import ResumoFinanceiro from "@/src/components/organisms/ResumoFinanceiro";
import { useAuthUser, useDespesasMes, useReceitasMes } from "@/src/hooks";
import api from "@/src/utils/api";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [totaisRefreshKey, setTotaisRefreshKey] = useState(0); // força recálculo de hooks de totais
  const [refreshing, setRefreshing] = useState(false);
  const [cartoesRefreshKey, setCartoesRefreshKey] = useState(0);

  const router = useRouter();
  const { user } = useAuthUser();
  const userId = user?.id || "";

  const receitas = useReceitasMes(userId, totaisRefreshKey);
  const despesas = useDespesasMes(userId, totaisRefreshKey);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(
    async (opts: { showSpinner?: boolean } = {}) => {
      if (!userId) {
        setLoading(false);
        setRefreshing(false);
        return;
      }
      try {
        if (opts.showSpinner) setLoading(true);
        // Executa as 3 requisições em paralelo
        const [contasRes, despesasRes, receitasRes] = await Promise.all([
          api.get(`/contas/user/${userId}`),
          api.get(`/despesas/ultimas/${userId}`),
          api.get(`/receitas/ultimas/${userId}`),
        ]);

        if (!isMountedRef.current) return; // evita setState após unmount

        const contasData = (contasRes.data?.data || []).map((c: any) => ({
          id: c.id,
          nome: `${c.bancoNome} - ${c.conta}`,
          saldo: Number(c.saldo) || 0,
          type: c.type,
          agencia: c.agencia,
          conta: c.conta,
          cdiPercent: c.cdiPercent,
        }));
        setContas(contasData);
        setSaldoTotal(
          contasData.reduce((acc: number, c: Conta) => acc + c.saldo, 0)
        );

        const despesasData: Movimentacao[] = (despesasRes.data?.data || []).map(
          (d: any) => ({
            id: d.id,
            tipo: "Despesa",
            descricao: d.descricao,
            valor: Number(d.valor) || 0,
            data: d.data,
            metodoPagamento: d.metodoPagamento ?? "Sem método",
            conta: d.conta ? { bancoNome: d.conta.bancoNome } : undefined,
            categoria: d.categoria ? { name: d.categoria.name } : undefined,
            cartao: d.cartao ? { nome: d.cartao.nome } : undefined,
          })
        );

        const receitasData: Movimentacao[] = (receitasRes.data?.data || []).map(
          (r: any) => ({
            id: r.id,
            tipo: "Receita",
            descricao: r.descricao ?? r.description,
            valor: Number(r.valor ?? r.quantidade) || 0,
            data: r.data,
            conta: r.conta ? { bancoNome: r.conta.bancoNome } : undefined,
            categoria: r.categories ? { name: r.categories.name } : undefined,
          })
        );

        const todasMovimentacoes = [...receitasData, ...despesasData].sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        setMovimentacoes(todasMovimentacoes);
      } catch (err) {
        console.log(err);
        if (isMountedRef.current)
          Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [userId]
  );

  useEffect(() => {
    loadData({ showSpinner: true });
  }, [userId, loadData]);

  const onRefresh = useCallback(() => {
    if (loading || refreshing) return; // evita múltiplos refresh simultâneos
    setRefreshing(true);
    loadData();
  }, [loading, refreshing, loadData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  // (Removido array sections não utilizado)

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case "header":
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
      case "resumo":
        return (
          <ResumoFinanceiro
            saldo={saldoTotal}
            receitas={receitas}
            despesas={despesas}
            cartoesRefreshKey={cartoesRefreshKey}
          />
        );
      case "actions":
        return (
          <ActionButtonsRow
            onUpdateData={() => {
              loadData();            // recarrega listas e movimentações
              setTotaisRefreshKey(k => k + 1); // força re-fetch dos totais mês
              setCartoesRefreshKey(k => k + 1); // força refresh dos cartões
            }}
          />
        );
      case "contas":
        return <ContasList 
        contas={contas} 
        scrollEnabled={false}
        onChanged={() => {
          loadData(); 
          setTotaisRefreshKey(k => k + 1);
          setCartoesRefreshKey(k => k + 1); // <-- recarrega CartoesRow automaticamente
        }}
         />;
      case "movimentacoes":
        return (
          <MovimentacoesList
            movimentacoes={movimentacoes}
            scrollEnabled={false}
            onChanged={loadData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={["header", "resumo","actions", "contas", "movimentacoes"]}
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
    paddingBottom: 40,
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
