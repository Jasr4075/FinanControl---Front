import { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import Card from "../atoms/Card";
import ContaItem from "../molecules/ContaItem";
import { Feather } from "@expo/vector-icons";
import CreateContaForm from "../organisms/CreateContaForm";
import { Conta } from "../../types/types";
import api from "../../utils/api";
type ContasListProps = {
  contas: Conta[];
  scrollEnabled?: boolean;
  onChanged?: () => void; // callback para sinalizar criação/alteração
};
export default function ContasList({ contas, scrollEnabled = true, onChanged }: ContasListProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [listaContas, setListaContas] = useState<Conta[]>(contas);

  // Atualiza lista local quando prop muda
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
      Alert.alert('Sucesso', 'Conta excluída.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir a conta.');
    }
  };

  const confirmDelete = () => {
    if (!selectedConta) return;
    Alert.alert(
      'Confirmar exclusão',
      `Excluir a conta "${selectedConta.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleDelete },
      ]
    );
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
        scrollEnabled={scrollEnabled} // padrão true
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Modal de criação de conta */}
      <Modal visible={showForm} animationType="slide">
          <CreateContaForm
            onClose={() => setShowForm(false)}
            onSuccess={() => { onChanged?.(); }}
          />
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

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => alert("Editar conta")}
                  >
                    <Feather name="edit" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={confirmDelete}
                  >
                    <Feather name="trash-2" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});

// (funções de ação estão dentro do componente)
