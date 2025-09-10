import { StyleSheet, View } from "react-native";
import SaldoTotalCard from "../molecules/SaldoTotalCard";
import ReceitasDespesasRow from "./ReceitasDespesasRow";
import CartoesRow from "../../features/cartoes/components/CartoesRow";

export default function ResumoFinanceiro({
  saldo,
  receitas,
  despesas,
  cartoesRefreshKey,
}: {
  saldo: number;
  receitas: number;
  despesas: number;
  cartoesRefreshKey?: any;
}) {
  return (
    <View style={styles.container}>
      <SaldoTotalCard saldo={saldo} />
      <ReceitasDespesasRow
        receitas={receitas}
        despesas={despesas}
        faturasBanco={0}
        autoFetch={true}
      />
      <CartoesRow refreshKey={cartoesRefreshKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
});
