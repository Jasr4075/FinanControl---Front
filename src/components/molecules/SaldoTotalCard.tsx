import { Text, StyleSheet, View } from "react-native";
import Card from "../atoms/Card";

export default function SaldoTotalCard({ saldo }: { saldo: number }) {
  const positivo = saldo >= 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Saldo Total</Text>
      </View>

      <Text
        style={[
          styles.saldo,
          { color: positivo ? "#1ABC9C" : "#E74C3C" },
        ]}
      >
        R$ {saldo.toFixed(2)}
      </Text>

      <Text style={styles.sub}>
        {positivo ? "Disponível" : "Em déficit"}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#555" },
  saldo: { fontSize: 26, fontWeight: "700", marginBottom: 4 },
  sub: { fontSize: 13, color: "#777" },
});
