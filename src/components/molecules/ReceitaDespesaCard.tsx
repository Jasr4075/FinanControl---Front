import { Text, StyleSheet, ViewStyle } from "react-native";
import Card from "../atoms/Card";

export default function ReceitaDespesaCard({
  titulo,
  valor,
  tipo,
}: {
  titulo: string;
  valor: number;
  tipo: "Receita" | "Despesa";
}) {
  return (
    <Card style={tipo === "Receita" ? styles.receita : styles.despesa}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={tipo === "Receita" ? styles.valorReceita : styles.valorDespesa}>
        R$ {valor.toFixed(2)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  receita: { backgroundColor: "#e6f7e6" },
  despesa: { backgroundColor: "#fdeaea" },
  valorReceita: { fontSize: 18, fontWeight: "bold", color: "#28a745" },
  valorDespesa: { fontSize: 18, fontWeight: "bold", color: "#dc3545" },
});
