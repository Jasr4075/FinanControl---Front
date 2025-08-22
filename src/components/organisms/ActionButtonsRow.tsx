import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useCreateDespesa } from "../../hooks/useCreateDespesa";
import ActionButton from "../atoms/ActionButton";
import CreateDespesaForm from "../molecules/CreateDespesaForm";
import CreateReceitaForm from "../molecules/CreateReceitaForm";

export default function ActionButtonsRow() {
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalReceitaVisible, setModalReceitaVisible] = useState(false);
  const { createDespesa, loading } = useCreateDespesa();

  const handleCreateDespesa = async (data: any) => {
    await createDespesa(data);
    setModalDespesaVisible(false);
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
        <CreateReceitaForm onClose={() => setModalReceitaVisible(false)} />
      </Modal>

      <Modal visible={modalDespesaVisible} animationType="slide">
        <CreateDespesaForm
          onClose={() => setModalDespesaVisible(false)}
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
