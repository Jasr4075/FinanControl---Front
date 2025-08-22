import { View, StyleSheet } from "react-native";
import ReceitaDespesaCard from "../molecules/ReceitaDespesaCard";

export default function ReceitasDespesasRow({
  receitas,
  despesas,
}: {
  receitas: number;
  despesas: number;
}) {
  return (
    <View style={styles.row}>
      <ReceitaDespesaCard titulo="Receitas" valor={receitas} tipo="Receita" />
      <ReceitaDespesaCard titulo="Despesas" valor={despesas} tipo="Despesa" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
});
