// src/components/molecules/ContaEditModal.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";


import { Conta } from "../../types/types";

interface Props {
  conta: Conta | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: (conta: Conta) => void; // função opcional para abrir edição em outro lugar
}

export default function ContaEditModal({ conta, visible, onClose, onEdit }: Props) {
  const [saldo, setSaldo] = useState<number>(conta?.saldo ?? 0);

  useEffect(() => {
    setSaldo(conta?.saldo ?? 0); // atualiza saldo se a conta mudar
  }, [conta]);

  if (!conta) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Detalhes da Conta</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Nome:</Text>
            {" "}{conta.nome}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Saldo:</Text>
            {" "}R$ {saldo.toFixed(2)}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Tipo:</Text>
            {" "}{conta.type}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Agência:</Text>
            {" "}{conta.agencia}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Conta:</Text>
            {" "}{conta.conta}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>CDI %:</Text>
            {" "}{conta.cdiPercent}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Cartões:</Text>
            {" "}{conta.cartoes?.join(", ") ?? ""}
          </Text>

          {onEdit && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEdit(conta)}
            >
              <Feather size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#222" },
  closeButton: { fontSize: 24, color: "#222" },
  detailText: { fontSize: 16, marginBottom: 12, color: "#333" },
  label: { fontWeight: "600", color: "#555" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  editButtonText: { color: "#fff", fontWeight: "700", marginLeft: 10 },
});
