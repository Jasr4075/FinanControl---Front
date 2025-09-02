import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useCreateDespesa } from "../../hooks/useCreateDespesa";
import { CreateDespesaInput } from "../../types/types";
import ActionButton from "../atoms/ActionButton";
import CreateDespesaForm from "../molecules/CreateDespesaForm";
import CreateReceitaForm from "../molecules/CreateReceitaForm";

export default function ActionButtonsRow({ onUpdateData }: { onUpdateData: () => void }) {
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalReceitaVisible, setModalReceitaVisible] = useState(false);
  const { createDespesa, loading } = useCreateDespesa();

  const handleCreateDespesa = async (data: CreateDespesaInput) => {
    await createDespesa(data);
    setModalDespesaVisible(false);
  };


  // Só chama onUpdateData após sucesso real
  const handleReceitaSuccess = () => {
    setModalReceitaVisible(false);
    onUpdateData();
  };

  const closeDespesaModal = () => {
    setModalDespesaVisible(false);
    onUpdateData(); // Chama a função de atualização
  };

  return (
    <View style={styles.row}>
      <ActionButton
        label="+ Receita"
        color="#28a745"
        onPress={() => setModalReceitaVisible(true)}
      />
      <ActionButton
        label="+ Despesa"
        color="#dc3545"
        onPress={() => setModalDespesaVisible(true)}
      />

      <Modal visible={modalReceitaVisible} animationType="slide">
        <CreateReceitaForm onClose={() => setModalReceitaVisible(false)} onSuccess={handleReceitaSuccess} />
      </Modal>

      <Modal visible={modalDespesaVisible} animationType="slide">
        {/* Passando a nova função de fechamento que inclui a atualização */}
        <CreateDespesaForm
          onClose={closeDespesaModal}
          onSubmit={handleCreateDespesa}
          loading={loading}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
});
