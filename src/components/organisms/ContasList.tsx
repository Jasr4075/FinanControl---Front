import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import Card from "../atoms/Card";
import ContaItem from "../molecules/ContaItem";
import { Plus, Edit } from "lucide-react-native";
import CreateContaForm from "../organisms/CreateContaForm";
import ContaEditModal from "../molecules/ContaEditModal";
import { Conta } from "../../types/types";

export default function ContasList({ contas }: { contas: Conta[] }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const contaCompleta: Conta = {
    ...selectedConta!,
    cartoes: selectedConta?.cartoes || [],
  };

  const openDetails = (conta: Conta) => {
    setSelectedConta(conta);
    setShowDetailsModal(true);
  };

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saldos por Conta</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de contas */}
      <FlatList
        data={contas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDetails(item)}>
            <ContaItem nome={item.nome} saldo={item.saldo} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Modal de criação de conta */}
      <Modal visible={showForm} animationType="slide">
        <CreateContaForm onClose={() => setShowForm(false)} />
      </Modal>

      {/* Modal de detalhes da conta */}
      <Modal visible={showDetailsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Conta</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedConta && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  Nome:{" "}
                  <Text style={styles.detailValue}>{selectedConta.nome}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Saldo:{" "}
                  <Text style={styles.detailValue}>
                    R$ {selectedConta.saldo.toFixed(2)}
                  </Text>
                </Text>
                <Text style={styles.detailText}>
                  Tipo:{" "}
                  <Text style={styles.detailValue}>{selectedConta.type}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Agência:{" "}
                  <Text style={styles.detailValue}>
                    {selectedConta.agencia}
                  </Text>
                </Text>
                <Text style={styles.detailText}>
                  Conta:{" "}
                  <Text style={styles.detailValue}>{selectedConta.conta}</Text>
                </Text>
                <Text style={styles.detailText}>
                  CDI %:{" "}
                  <Text style={styles.detailValue}>
                    {selectedConta.cdiPercent}%
                  </Text>
                </Text>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => alert("Editar conta")}
                >
                  <Edit size={20} color="#fff" />
                  <Text style={styles.editButtonText}>Editar Conta</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <ContaEditModal
  conta={contaCompleta}
  visible={!!selectedConta}
  onClose={() => setSelectedConta(null)}
/>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  addButton: {
    backgroundColor: "#28a745",
    borderRadius: 50,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 8 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalClose: { fontSize: 20, fontWeight: "bold" },

  detailsContainer: { marginTop: 10 },
  detailText: { fontSize: 16, marginBottom: 10 },
  detailValue: { fontWeight: "bold", color: "#007bff" },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: "center",
  },
  editButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
