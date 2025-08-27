import { View, StyleSheet } from "react-native";
import ReceitaDespesaCard from "../molecules/ReceitaDespesaCard";

export default function ReceitasDespesasRow({
  receitas,
  despesas,
  faturasBanco,
  receitasMesAnterior = 926475,
  despesasMesAnterior = 143514,
}: {
  receitas: number;
  despesas: number;
  faturasBanco: number;
  receitasMesAnterior?: number;
  despesasMesAnterior?: number;
}) {
  return (
    <View style={styles.row}>
      <ReceitaDespesaCard
        titulo="Receitas"
        valor={receitas}
        cor="green"
        previousMonthValue={receitasMesAnterior}
        detalhes={[
          { id: "1", descricao: "Salário", valor: 5000 },
          { id: "2", descricao: "Freelance", valor: 1200 },
        ]}
      />

      <ReceitaDespesaCard
        titulo="Despesas"
        valor={despesas}
        cor="red"
        previousMonthValue={despesasMesAnterior}
        detalhes={[
          { id: "1", descricao: "Aluguel", valor: 1500 },
          { id: "2", descricao: "Mercado", valor: 800 },
        ]}
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
