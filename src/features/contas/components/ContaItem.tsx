import { View, Text, StyleSheet } from "react-native";

export default function ContaItem({ nome, saldo }: { nome: string; saldo: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.saldo}>R$ {saldo.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  nome: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1, // evita overflow si el nombre es muy largo
  },
  saldo: {
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "right",
    minWidth: 80, // para alinear todos los saldos
  },
});
