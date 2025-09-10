import { useState } from "react";
import { Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import Card from "../../../components/atoms/Card";
import DetalhesModal from "../../../components/molecules/ReceitaDespesaDetalhesModal";
import useAuthUser from "../../auth/useAuthUser";
import useReceitasDetalhes from "@/src/features/receitas/hooks/useReceitasDetalhes";

type ReceitasCardProps = {
  valor: number;
  cor?: "green" | "red" | "blue" | "orange" | "purple";
  previousMonthValue?: number;
  style?: ViewStyle;
};

export default function ReceitasCard({
  valor,
  cor = "green",
  previousMonthValue,
  style,
}: ReceitasCardProps) {
  const { user } = useAuthUser();
  const [modalVisible, setModalVisible] = useState(false);

  const receitas = useReceitasDetalhes(user?.id ?? "");

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
          ...(style as ViewStyle),
        }}
      >
        <Text style={styles.title}>Receitas</Text>
        <Text style={[styles.valor, { color: styleMap[cor].text }]}>
          R$ {valor.toFixed(2)}
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

      <DetalhesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        titulo="Receitas"
        detalhes={receitas.map((r) => ({ ...r, data: r.data ?? "" }))}
      />
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
});
