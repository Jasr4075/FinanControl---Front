import { View, StyleSheet } from "react-native";
import ReceitasCard from "../../features/receitas/components/ReceitaCard";
import DespesasCard from "../../features/despesas/components/DespesaCard";
import { useTotaisReceitas, useTotaisDespesas } from "@/src/hooks/useResumoMesAnterior";

type Props = {
  userId?: string;
  receitas?: number; // pode vir já calculado externamente
  despesas?: number;
  faturasBanco: number; // placeholder para futuro cartão/integração
  receitasMesAnterior?: number;
  despesasMesAnterior?: number;
  autoFetch?: boolean; // se true usa hooks para obter valores atual & anterior
};

export default function ReceitasDespesasRow({
  userId,
  receitas,
  despesas,
  faturasBanco,
  receitasMesAnterior,
  despesasMesAnterior,
  autoFetch = false,
}: Props) {
  // Hooks só se autoFetch e userId disponível
  const receitasHook = autoFetch && userId ? useTotaisReceitas(userId) : null;
  const despesasHook = autoFetch && userId ? useTotaisDespesas(userId) : null;

  const receitasAtual = receitasHook ? receitasHook.atual : (receitas ?? 0);
  const receitasAnterior = receitasHook ? receitasHook.anterior : (receitasMesAnterior ?? 0);
  const despesasAtual = despesasHook ? despesasHook.atual : (despesas ?? 0);
  const despesasAnterior = despesasHook ? despesasHook.anterior : (despesasMesAnterior ?? 0);

  return (
    <View style={styles.row}>
      <ReceitasCard
        valor={receitasAtual}
        previousMonthValue={receitasAnterior}
      />

      <DespesasCard
        valor={despesasAtual}
        previousMonthValue={despesasAnterior}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 20,
  },
});
