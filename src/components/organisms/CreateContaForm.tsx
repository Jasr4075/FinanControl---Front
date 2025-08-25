import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "@/src/utils/api";
import { Conta } from "../../types/types";
import { User } from "lucide-react-native";

interface Props {
  conta?: Conta | null;
  onClose: () => void;
}

const tiposConta = [
  { id: "CORRENTE", name: "Corrente" },
  { id: "POUPANCA", name: "Poupança" },
  { id: "DINHEIRO", name: "Dinheiro" },
];

// Adicione essa lista no topo do arquivo
const bancosPopulares = [
  "Banco do Brasil",
  "Picpay",
  "Caixa Econômica Federal",
  "Mercado Pago",
  "Bradesco",
  "NuBank",
  "Itaú",
  "Santander",
  "Banco Safra",
  "Banco Original",
  "Banrisul",
  "Banco Inter",
  "BTG Pactual",
  "Banco Pan",
  "Banco BMG",
  "Sicoob",
  "Sicredi",
  "Neon",
  "C6 Bank",
  "Next",
  "Banco Votorantim",
  "Banco Modal",
  "Banco Daycoval",
  "Banco Mercantil do Brasil",
  "Banco Modal Mais",
];

export default function CreateContaForm({ onClose }: Props) {
  const [bancoNome, setBancoNome] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [saldo, setSaldo] = useState("");
  const [type, setType] = useState("");
  const bancosFiltrados = useMemo(() => {
    if (!bancoNome) return bancosPopulares;
    return bancosPopulares.filter((banco) =>
      banco.toLowerCase().includes(bancoNome.toLowerCase())
    );
  }, [bancoNome]);

  const handleCreate = async () => {
    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (!user?.id) {
        Alert.alert("Erro", "Usuário não encontrado no localStorage");
        return;
      }

      if (!type) {
        Alert.alert("Erro", "Selecione um tipo de conta válido.");
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Adicionar Conta</Text>

        {/* Banco */}
        <Text style={styles.label}>Banco *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do Banco"
          value={bancoNome}
          onChangeText={setBancoNome}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {bancosFiltrados.map((banco) => (
            <TouchableOpacity
              key={banco}
              style={[
                styles.selectButton,
                bancoNome === banco && styles.selectButtonActive,
              ]}
              onPress={() => setBancoNome(banco)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  bancoNome === banco && styles.selectButtonTextActive,
                ]}
              >
                {banco}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
          placeholder="Saldo Inicial"
          keyboardType="numeric"
          value={saldo}
          onChangeText={setSaldo}
        />

        {/* Tipo de Conta */}
        <Text style={styles.label}>Tipo de Conta *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {tiposConta.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.selectButton,
                type === t.id && styles.selectButtonActive,
              ]}
              onPress={() => setType(t.id)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  type === t.id && styles.selectButtonTextActive,
                ]}
              >
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleCreate}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  selectButtonActive: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: "#6c757d",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
