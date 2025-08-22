import { Text, StyleSheet } from "react-native";

export default function ContaItem({ nome, saldo }: { nome: string; saldo: number }) {
  return (
    <Text style={styles.item}>
      {nome}: <Text style={styles.valor}>R$ {saldo.toFixed(2)}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  item: { fontSize: 14, color: "#555", marginBottom: 3 },
  valor: { fontWeight: "bold", color: "#007bff" },
});
