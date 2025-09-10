import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import CustomAlert from "../atoms/Alert";
import api from "../../utils/api";
import { Movimentacao } from "../../types/common";

interface MovimentacaoModalProps {
  movimentacao: Movimentacao | null;
  onClose: () => void;
  onChanged?: () => void; // para atualizar a lista após editar/deletar
}

export default function MovimentacaoModal({
  movimentacao,
  onClose,
  onChanged,
}: MovimentacaoModalProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [editando, setEditando] = useState(false);

  if (!movimentacao) return null;

  const handleDelete = async () => {
    try {
      const rota = movimentacao.tipo === "Receita" ? "/receitas/" : "/despesas/";
      await api.delete(rota + movimentacao.id);
      setShowAlert(false);
      onClose();
      onChanged?.();
    } catch (e) {
      console.error("Erro ao excluir movimentação:", e);
      setShowAlert(false);
    }
  };

  return (
    <Modal
      visible={!!movimentacao}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{movimentacao.descricao}</Text>
          <Text style={styles.meta}>Tipo: {movimentacao.tipo}</Text>
          <Text style={styles.meta}>Valor: R$ {movimentacao.valor.toFixed(2)}</Text>
          <Text style={styles.meta}>
            Data: {movimentacao.data ? new Date(movimentacao.data).toLocaleDateString("pt-BR") : ""}
          </Text>
          <Text style={styles.meta}>Método: {movimentacao.metodoPagamento}</Text>
          <Text style={styles.meta}>
            Conta: {movimentacao.conta?.bancoNome ?? "Sem conta"}
          </Text>
          <Text style={styles.meta}>
            Categoria: {movimentacao.categoria?.name ?? "Sem categoria"}
          </Text>
          {movimentacao.cartao?.name && <Text style={styles.meta}>Cartão: {movimentacao.cartao.name}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#28a745", marginRight: 8 }]}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#dc3545", marginLeft: 8 }]}
              onPress={() => setShowAlert(true)}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Alerta de confirmação */}
        <CustomAlert
          visible={showAlert}
          title="Excluir"
          message={`Deseja realmente excluir esta ${movimentacao.tipo.toLowerCase()}?`}
          onCancel={() => setShowAlert(false)}
          onConfirm={handleDelete}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeText: {
    color: "#007AFF",
    marginTop: 20,
    textAlign: "center",
  },
});
