import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "@/src/utils/api";

interface Props {
  onClose: () => void;
}

export default function CreateContaForm({ onClose }: Props) {
  const [bancoNome, setBancoNome] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [saldo, setSaldo] = useState("");
  const [type, setType] = useState("");

  const handleCreate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // pega userId
      if (!user.id) {
        Alert.alert("Erro", "Usuário não encontrado no localStorage");
        return;
      }

      await api.post("/contas", {
        userId: user.id,
        type,
        bancoNome,
        agencia,
        conta,
        saldo: parseFloat(saldo),
        efetivo: false,
        cdiPercent: 0.0,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível criar a conta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Banco"
        value={bancoNome}
        onChangeText={setBancoNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Agência"
        value={agencia}
        onChangeText={setAgencia}
      />

      <TextInput
        style={styles.input}
        placeholder="Conta"
        value={conta}
        onChangeText={setConta}
      />

      <TextInput
        style={styles.input}
        placeholder="Saldo"
        keyboardType="numeric"
        value={saldo}
        onChangeText={setSaldo}
      />

      <TextInput
        style={styles.input}
        placeholder="Tipo (CORRENTE, POUPANCA, DINHEIRO)"
        value={type}
        onChangeText={setType}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={{ color: "#fff" }}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "gray" }]} onPress={onClose}>
        <Text style={{ color: "#fff" }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
