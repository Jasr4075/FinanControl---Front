import { useState } from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  Modal,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Card from "../atoms/Card";

type ReceitaDespesaCardProps = {
  titulo: string;
  valor: number;
  cor: "green" | "red" | "blue" | "orange" | "purple";
  previousMonthValue?: number;
  style?: ViewStyle;
  detalhes?: { id: string; descricao: string; valor: number }[];
};

export default function ReceitaDespesaCard({
  titulo,
  valor,
  cor,
  previousMonthValue,
  style,
  detalhes = [],
}: ReceitaDespesaCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const styleMap = {
    green: { bg: "#E8F9F0", text: "#1ABC9C" },
    red: { bg: "#FDEDED", text: "#E74C3C" },
    blue: { bg: "#EDF5FF", text: "#3498DB" },
    orange: { bg: "#FFF4E6", text: "#E67E22" },
    purple: { bg: "#F6EAFE", text: "#9B59B6" },
  };

  const diff =
    previousMonthValue !== undefined ? valor - previousMonthValue : undefined;

  return (
    <>
      <Card
        style={{
          backgroundColor: styleMap[cor].bg,
          borderRadius: 16,
          padding: 18,
          flexGrow: 1,
          minWidth: 160,
          ...(style as ViewStyle), // funde o `style` dentro do objeto
        }}
      >
        <Text style={styles.title}>{titulo}</Text>
        <Text style={[styles.valor, { color: styleMap[cor].text }]}>
          R$ {(valor ?? 0).toFixed(2)}
        </Text>

        {previousMonthValue !== undefined && (
          <Text style={styles.previous}>
            Mês passado: R$ {previousMonthValue.toFixed(2)}{" "}
            {diff !== undefined && (
              <Text style={{ color: diff >= 0 ? "#1ABC9C" : "#E74C3C" }}>
                ({diff >= 0 ? "+" : ""}
                {diff.toFixed(2)})
              </Text>
            )}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.btnDetalhes}
        >
          <Text style={styles.btnDetalhesText}>Ver detalhes</Text>
        </TouchableOpacity>
      </Card>

      {/* Modal com os detalhes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{titulo} - Detalhes</Text>

            {detalhes.length > 0 ? (
              <FlatList
                data={detalhes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.detalheItem}>
                    <Text style={styles.detalheDescricao}>
                      {item.descricao}
                    </Text>
                    <Text style={styles.detalheValor}>
                      R$ {item.valor.toFixed(2)}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.semDetalhes}>Nenhum detalhe disponível</Text>
            )}

            <TouchableOpacity
              style={styles.fecharBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.fecharText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 },
  valor: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  previous: { fontSize: 13, color: "#777" },
  btnDetalhes: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
  btnDetalhesText: { fontSize: 13, fontWeight: "500", color: "#555" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    maxHeight: "75%",
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
  },
  detalheItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  detalheDescricao: { fontSize: 14, color: "#444" },
  detalheValor: { fontSize: 14, fontWeight: "600", color: "#333" },
  semDetalhes: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  fecharBtn: {
    marginTop: 18,
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  fecharText: { color: "white", fontWeight: "600", fontSize: 15 },
});
