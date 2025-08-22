import { Text, StyleSheet } from "react-native";
import Card from "../atoms/Card";

export default function SaldoTotalCard({ saldo }: { saldo: number }) {
  return (
    <Card>
      <Text style={styles.title}>Saldo Total</Text>
      <Text style={styles.saldo}>R$ {saldo.toFixed(2)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  saldo: { fontSize: 20, fontWeight: "bold", color: "#333" },
});
