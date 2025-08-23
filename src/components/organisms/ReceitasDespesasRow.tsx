// ReceitasDespesasRow.tsx
import { View, StyleSheet } from "react-native";
import ReceitaDespesaCard from "../molecules/ReceitaDespesaCard";

export default function ReceitasDespesasRow({
  receitas,
  despesas,
  faturasBanco,
}: {
  receitas: number;
  despesas: number;
  faturasBanco: number;
}) {
  return (
    <View style={styles.row}>
      <ReceitaDespesaCard titulo="Receitas" valor={receitas} cor="green" />
      <ReceitaDespesaCard titulo="Fatura Cartão (Banco X)" valor={faturasBanco} cor="blue" />
      <ReceitaDespesaCard titulo="Despesas" valor={despesas} cor="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    flexWrap: "wrap", // permite quebrar linha se tiver muitos cards
    gap: 10,
  },
});
