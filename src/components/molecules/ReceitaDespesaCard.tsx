// ReceitaDespesaCard.tsx
import { Text, StyleSheet, ViewStyle } from "react-native";
import Card from "../atoms/Card";

export default function ReceitaDespesaCard({
  titulo,
  valor,
  cor,
}: {
  titulo: string;
  valor: number;
  cor: "green" | "red" | "blue" | "orange"; // paleta pré-definida
}) {
  const styleMap = {
    green: { backgroundColor: "#e6f7e6", textColor: "#28a745" },
    red: { backgroundColor: "#fdeaea", textColor: "#dc3545" },
    blue: { backgroundColor: "#e6f0fa", textColor: "#007bff" },
    orange: { backgroundColor: "#fff4e6", textColor: "#fd7e14" },
  };

  return (
    <Card style={{ backgroundColor: styleMap[cor].backgroundColor }}>
      <Text style={styles.title}>{titulo}</Text>
<Text style={[styles.valor, { color: styleMap[cor].textColor }]}>
  R$ {(valor ?? 0).toFixed(2)}
</Text>

    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  valor: { fontSize: 18, fontWeight: "bold" },
});
