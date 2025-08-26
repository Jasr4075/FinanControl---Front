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
  detalhes?: { id: string; descricao: string; valor: number }[]; // 👈 lista detalhada
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
    green: { backgroundColor: "#e6f7e6", textColor: "#28a745" },
    red: { backgroundColor: "#fdeaea", textColor: "#dc3545" },
    blue: { backgroundColor: "#e6f0fa", textColor: "#007bff" },
    orange: { backgroundColor: "#fff4e6", textColor: "#fd7e14" },
    purple: { backgroundColor: "#f4e6ff", textColor: "#6f42c1" },
  };

  const diff =
    previousMonthValue !== undefined ? valor - previousMonthValue : undefined;

  return (
    <>
      <Card
        style={{
          backgroundColor: styleMap[cor].backgroundColor,
          flexBasis: "48%",
          margin: "1%",
          minWidth: 150,
          flexGrow: 1,
          ...(style || {}),
        }}
      >
        <Text style={styles.title}>{titulo}</Text>
        <Text style={[styles.valor, { color: styleMap[cor].textColor }]}>
          R$ {(valor ?? 0).toFixed(2)}
        </Text>
        {previousMonthValue !== undefined && (
          <Text style={styles.previous}>
            Mês passado: R$ {previousMonthValue.toFixed(2)}
            {diff !== undefined && (
              <Text style={{ color: diff >= 0 ? "#28a745" : "#dc3545" }}>
                {" "}
                ({diff >= 0 ? "+" : ""}
                {diff.toFixed(2)})
              </Text>
            )}
          </Text>
        )}

        {/* Botão transparente */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.detalhesBtn}>Ver detalhes</Text>
        </TouchableOpacity>
      </Card>

      {/* Modal com os detalhes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes de {titulo}</Text>

            {detalhes.length > 0 ? (
              <FlatList
                data={detalhes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.detalheItem}>
                    <Text style={styles.detalheDescricao}>{item.descricao}</Text>
                    <Text style={styles.detalheValor}>
                      R$ {item.valor.toFixed(2)}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={{ color: "#555", marginTop: 10 }}>
                Nenhum detalhe disponível
              </Text>
            )}

            <TouchableOpacity
              style={styles.fecharBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 0 },
  valor: { fontSize: 18, fontWeight: "bold" },
  previous: { fontSize: 14, color: "#888", marginTop: 4 },
  detalhesBtn: {
    marginTop: 6,
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
    alignSelf: "flex-start",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  detalheItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  detalheDescricao: { fontSize: 14, color: "#333" },
  detalheValor: { fontSize: 14, fontWeight: "bold", color: "#444" },
  fecharBtn: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
