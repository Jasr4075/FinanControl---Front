import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useCreateDespesa } from "../../hooks/useCreateDespesa";
import ActionButton from "../atoms/ActionButton";
import CreateDespesaForm from "../molecules/CreateDespesaForm";
import CreateReceitaForm from "../molecules/CreateReceitaForm";

export default function ActionButtonsRow({ onUpdateData }: { onUpdateData: () => void }) {
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalReceitaVisible, setModalReceitaVisible] = useState(false);
  const { createDespesa, loading } = useCreateDespesa();

  const handleCreateDespesa = async (data: any) => {
    await createDespesa(data);
    setModalDespesaVisible(false);
  };

  // Funções para fechar os modais e atualizar os dados
  const closeReceitaModal = () => {
    setModalReceitaVisible(false);
    onUpdateData(); // Chama a função de atualização
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
        {/* Passando a nova função de fechamento que inclui a atualização */}
        <CreateReceitaForm onClose={closeReceitaModal} />
      </Modal>

      <Modal visible={modalDespesaVisible} animationType="slide">
        {/* Passando a nova função de fechamento que inclui a atualização */}
        <CreateDespesaForm
          onClose={closeDespesaModal}
          onSubmit={handleCreateDespesa as any}
          loading={loading as any}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
});
