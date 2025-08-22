import { StyleSheet, View } from "react-native";
import SaldoTotalCard from "../molecules/SaldoTotalCard";
import ReceitasDespesasRow from "./ReceitasDespesasRow";

export default function ResumoFinanceiro({ saldo, receitas, despesas }: { saldo: number; receitas: number; despesas: number; }) {
  return (
    <View style={styles.container}>
      <SaldoTotalCard saldo={saldo} />
      <ReceitasDespesasRow receitas={receitas} despesas={despesas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
});
