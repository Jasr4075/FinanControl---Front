import { FlatList, Text, View, StyleSheet } from "react-native";
import Card from "../atoms/Card";
import Valor from "../atoms/Valor";

interface Movimentacao {
  id: string;
  tipo: "Receita" | "Despesa";
  descricao: string;
  valor: number;
  data: string;
}

export default function MovimentacoesList({ movimentacoes }: { movimentacoes: Movimentacao[] }) {
  return (
    <Card>
      <Text style={styles.title}>Últimas Movimentações</Text>
      <FlatList
        data={movimentacoes.slice(0, 10)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.desc}>{item.descricao}</Text>
            <Valor valor={item.valor} tipo={item.tipo} />
          </View>
        )}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  desc: { fontSize: 14, color: "#333" },
});
