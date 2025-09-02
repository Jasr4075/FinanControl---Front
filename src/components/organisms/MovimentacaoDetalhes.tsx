
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Movimentacao } from "../../types/types";

type MovimentacaoDetalhesRoute = {
  params: {
    movimentacao: Movimentacao;
  };
};

interface MovimentacaoDetalhesProps {
  route: RouteProp<MovimentacaoDetalhesRoute, 'params'>;
}

export default function MovimentacaoDetalhes({ route }: MovimentacaoDetalhesProps) {
  const { movimentacao } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movimentacao.descricao}</Text>
      <Text style={styles.meta}>Tipo: {movimentacao.tipo}</Text>
      <Text style={styles.meta}>Valor: R$ {movimentacao.valor}</Text>
      <Text style={styles.meta}>Data: {movimentacao.data ? new Date(movimentacao.data).toLocaleDateString("pt-BR") : ""}</Text>
      <Text style={styles.meta}>Método: {movimentacao.metodoPagamento ?? "-"}</Text>
      <Text style={styles.meta}>Conta: {movimentacao.conta?.bancoNome ?? "Conta"}</Text>
      <Text style={styles.meta}>Categoria: {movimentacao.categoria?.name ?? "Sem categoria"}</Text>
      {movimentacao.cartao?.name && <Text style={styles.meta}>Cartão: {movimentacao.cartao.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  meta: { fontSize: 16, color: "#444", marginBottom: 6 },
});
    