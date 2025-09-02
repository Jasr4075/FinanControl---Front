import { Text, StyleSheet } from "react-native";

interface ValorProps {
  valor: number;
  tipo: "Receita" | "Despesa";
}

export default function Valor({ valor, tipo }: ValorProps) {
  const safeValor = isNaN(valor) ? 0 : valor;
  return (
    <Text style={tipo === "Receita" ? styles.receita : styles.despesa}>
      {tipo === "Receita" ? "+" : "-"} R$ {safeValor.toFixed(2)}
    </Text>
  );
}

const styles = StyleSheet.create({
  receita: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
  despesa: { fontSize: 16, fontWeight: "bold", color: "#dc3545" },
});
