import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import api from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../atoms/Card";
import Valor from "../atoms/Valor";
import CustomAlert from "../atoms/Alert"; // ✅ importa o alerta customizado
import { Movimentacao } from "../../types/types";

const INITIAL_COUNT = 5;
const ITEMS_PER_LOAD = 10;

interface MovimentacoesListProps {
  movimentacoes: Movimentacao[];
  scrollEnabled?: boolean;
  onChanged?: () => void;
}

export default function MovimentacoesList({
  movimentacoes,
  scrollEnabled = true,
  onChanged,
}: MovimentacoesListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selected, setSelected] = useState<Movimentacao | null>(null);
  const [editando, setEditando] = useState(false);

  // estado para confirmar exclusão
  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const rota = selected.tipo === "Receita" ? "/receitas/" : "/despesas/";
      await api.delete(rota + selected.id);
      setSelected(null);
      setShowAlert(false);
      onChanged?.();
    } catch (e) {
      let message = "Não foi possível excluir.";
      if (e instanceof Error) message += `\n${e.message}`;
      setShowAlert(false);
      // pode exibir outro CustomAlert de erro se quiser
      console.error(message);
    }
  };

  const handleShowMore = () => setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  const handleHide = () => setVisibleCount(INITIAL_COUNT);

  const hasMoreItems = movimentacoes.length > visibleCount;
  const isExpanded = visibleCount > INITIAL_COUNT;

  return (
    <Card style={{ paddingVertical: 12 }}>
      <Text style={styles.title}>Últimas Movimentações</Text>

      <FlatList
        data={movimentacoes.slice(0, visibleCount)}
        scrollEnabled={scrollEnabled}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => setSelected(item)}
          >
            {/* Ícone circular */}
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor:
                    item.tipo === "Receita" ? "#e6f4ea" : "#fdecea",
                },
              ]}
            >
              <MaterialIcons
                name={
                  item.tipo === "Receita" ? "arrow-downward" : "arrow-upward"
                }
                size={20}
                color={item.tipo === "Receita" ? "#28a745" : "#dc3545"}
              />
            </View>

            {/* Conteúdo da movimentação */}
            <View style={styles.details}>
              <Text style={styles.desc}>{item.descricao}</Text>
              <Text style={styles.meta}>
                {item.categoria ? item.categoria.name : "Sem categoria"}
                {" • "}
                {item.conta ? item.conta.bancoNome : "Sem conta"}
                {" • "}
                {item.metodoPagamento}
              </Text>
              <Text style={styles.date}>
                {new Date(item.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Valor */}
            <View style={styles.valueWrapper}>
              <Valor valor={item.valor} tipo={item.tipo} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botões Ver mais / Ocultar */}
      {hasMoreItems && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={handleShowMore}
        >
          <Text style={styles.showMoreText}>Ver mais ▼</Text>
        </TouchableOpacity>
      )}
      {isExpanded && (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleHide}>
          <Text style={styles.showMoreText}>Ocultar ▲</Text>
        </TouchableOpacity>
      )}

      {/* Modal de detalhes */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selected?.descricao}</Text>
            <Text style={styles.meta}>Tipo: {selected?.tipo}</Text>
            <Text style={styles.meta}>
              Valor: R$ {selected?.valor.toFixed(2)}
            </Text>
            <Text style={styles.meta}>
              Data:{" "}
              {selected?.data
                ? new Date(selected.data).toLocaleDateString("pt-BR")
                : ""}
            </Text>
            <Text style={styles.meta}>Método: {selected?.metodoPagamento}</Text>
            <Text style={styles.meta}>
              Conta: {selected?.conta?.bancoNome ?? "Sem conta"}
            </Text>
            <Text style={styles.meta}>
              Categoria: {selected?.categoria?.name ?? "Sem categoria"}
            </Text>
            {selected?.cartao?.name && (
              <Text style={styles.meta}>Cartão: {selected?.cartao?.name}</Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 18,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#28a745",
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                }}
                onPress={() => setEditando(true)}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Editar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#dc3545",
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8,
                }}
                onPress={() => setShowAlert(true)} // ✅ abre o alerta customizado
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text
                style={{
                  color: "#007AFF",
                  marginTop: 20,
                  textAlign: "center",
                }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Alerta customizado de confirmação */}
      <CustomAlert
        visible={showAlert}
        title="Excluir"
        message={`Deseja realmente excluir esta ${selected?.tipo.toLowerCase()}?`}
        onCancel={() => setShowAlert(false)}
        onConfirm={handleDelete}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  details: { flex: 1 },
  desc: { fontSize: 15, fontWeight: "600", color: "#111" },
  meta: { fontSize: 12, color: "#777", marginTop: 2 },
  date: { fontSize: 11, color: "#aaa", marginTop: 1 },
  valueWrapper: { minWidth: 90, alignItems: "flex-end" },
  showMoreButton: { alignItems: "center", marginTop: 10, paddingVertical: 6 },
  showMoreText: { fontSize: 14, color: "#007AFF", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    elevation: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
});
