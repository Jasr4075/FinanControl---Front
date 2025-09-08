import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import ActionButton from "../atoms/ActionButton";
import CreateDespesaForm from "../molecules/CreateDespesaForm";
import CreateReceitaForm from "../molecules/CreateReceitaForm";

export default function ActionButtonsRow({ onUpdateData }: { onUpdateData: () => void }) {
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalReceitaVisible, setModalReceitaVisible] = useState(false);
  
  const handleReceitaSuccess = () => {
    setModalReceitaVisible(false);
    onUpdateData();
  };

  const handleDespesaSuccess = () => {
    setModalDespesaVisible(false);
    onUpdateData();
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
        <CreateDespesaForm onClose={() => setModalDespesaVisible(false)} onSuccess={handleDespesaSuccess} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
});
