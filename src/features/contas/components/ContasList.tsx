import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Modal, StyleSheet, FlatList } from "react-native";
import Card from "../../../components/atoms/Card";
import ContaItem from "./ContaItem";
import { Feather } from "@expo/vector-icons";
import CreateContaForm from "@/src/features/contas/components/CreateContaForm";
import { Conta } from "../types";
import api from "../../../utils/api";
import AddCartaoToContaForm from "./AddCartaoToContaForm";
import CustomAlert from "../../../components/atoms/Alert";

type ContasListProps = {
  contas: Conta[];
  scrollEnabled?: boolean;
  onChanged?: () => void;
};

export default function ContasList({ contas, scrollEnabled = true, onChanged }: ContasListProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [listaContas, setListaContas] = useState<Conta[]>(contas);
  const [showAddCartaoModal, setShowAddCartaoModal] = useState(false);

  // alerts customizados
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  useEffect(() => {
    setListaContas(contas);
  }, [contas]);

  const openDetails = (conta: Conta) => {
    setSelectedConta(conta);
    setShowDetailsModal(true);
  };

  const handleDelete = async () => {
    if (!selectedConta) return;
    try {
      await api.delete(`/contas/${selectedConta.id}`);
      setListaContas(prev => prev.filter(c => c.id !== selectedConta.id));
      setShowDetailsModal(false);
      setSelectedConta(null);
      setShowSuccessAlert(true);
    } catch (e) {
      let message = "Não foi possível excluir a conta.";
      if (e instanceof Error) message += `\n${e.message}`;
      setShowErrorAlert({ visible: true, message });
    }
  };

  const confirmDelete = () => {
    setShowDeleteAlert(true);
  };

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saldos por Conta</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
          <Feather name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de contas */}
      <FlatList
        data={listaContas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDetails(item)}>
            <ContaItem nome={item.nome} saldo={item.saldo} />
          </TouchableOpacity>
        )}
        scrollEnabled={scrollEnabled}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Modal de criação de conta */}
      <Modal visible={showForm} animationType="slide">
        <CreateContaForm onClose={() => setShowForm(false)} onSuccess={() => onChanged?.()} />
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
                  Nome: <Text style={styles.detailValue}>{selectedConta.nome}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Saldo:{" "}
                  <Text style={styles.detailValue}>R$ {selectedConta.saldo.toFixed(2)}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Tipo: <Text style={styles.detailValue}>{selectedConta.type}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Agência: <Text style={styles.detailValue}>{selectedConta.agencia}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Conta: <Text style={styles.detailValue}>{selectedConta.conta}</Text>
                </Text>
                <Text style={styles.detailText}>
                  CDI %: <Text style={styles.detailValue}>{selectedConta.cdiPercent}%</Text>
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setShowAddCartaoModal(true)}
                  >
                    <Feather name="credit-card" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Adicionar Cartão</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                    <Feather name="trash-2" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para adicionar cartão à conta */}
      <Modal visible={showAddCartaoModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedConta && (
              <AddCartaoToContaForm
                contaId={selectedConta.id}
                onSuccess={() => {
                  setShowAddCartaoModal(false);
                  onChanged?.();
                }}
                onClose={() => setShowAddCartaoModal(false)}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ALERTAS */}
      <CustomAlert
        visible={showDeleteAlert}
        title="Confirmar exclusão"
        message={`Excluir a conta "${selectedConta?.nome}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          setShowDeleteAlert(false);
          handleDelete();
        }}
      />

      <CustomAlert
        visible={showSuccessAlert}
        title="Sucesso"
        message="Conta excluída."
        onCancel={() => setShowSuccessAlert(false)}
        onConfirm={() => setShowSuccessAlert(false)}
      />

      <CustomAlert
        visible={showErrorAlert.visible}
        title="Erro"
        message={showErrorAlert.message}
        onCancel={() => setShowErrorAlert({ visible: false, message: "" })}
        onConfirm={() => setShowErrorAlert({ visible: false, message: "" })}
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: "center",
    marginLeft: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
