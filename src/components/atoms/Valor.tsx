import { Text, StyleSheet } from "react-native";

export default function Valor({ valor, tipo }: { valor: number; tipo: "Receita" | "Despesa" }) {
  return (
    <Text style={tipo === "Receita" ? styles.receita : styles.despesa}>
      {tipo === "Receita" ? "+" : "-"} R$ {valor.toFixed(2)}
    </Text>
  );
}

const styles = StyleSheet.create({
  receita: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
  despesa: { fontSize: 16, fontWeight: "bold", color: "#dc3545" },
});
