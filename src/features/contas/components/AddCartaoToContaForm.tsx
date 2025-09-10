import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAlert } from "@/src/context/AlertContext";
import { Feather } from '@expo/vector-icons';
import Input from "@/src/components/atoms/Input";
import api from "@/src/utils/api";

interface AddCartaoToContaFormProps {
  contaId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export default function AddCartaoToContaForm({ contaId, onSuccess, onClose }: AddCartaoToContaFormProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"CREDITO" | "DEBITO" | "MISTO" | "">("");
  const [limite, setLimite] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [cor, setCor] = useState("#007bff");
  const [icone, setIcone] = useState("credit-card");
  const [loading, setLoading] = useState(false);

  const alert = useAlert();

  async function handleSubmit() {
    if (!nome.trim()) {
      alert.showAlert("Atenção", "Preencha o nome do cartão");
      return;
    }
    if (!tipo) {
      alert.showAlert("Atenção", "Selecione o tipo do cartão");
      return;
    }
    if ((tipo === "CREDITO" || tipo === "MISTO")) {
      if (!closingDay || isNaN(Number(closingDay))) {
        alert.showAlert("Atenção", "Informe o dia de fechamento válido (1-28)");
        return;
      }
      if (!dueDay || isNaN(Number(dueDay))) {
        alert.showAlert("Atenção", "Informe o dia de vencimento válido (1-28)");
        return;
      }
    }
    setLoading(true);
    try {
      await api.post("/cartoes", {
        contaId,
        nome: nome.trim(),
        type: tipo,
        creditLimit: limite ? parseFloat(limite) : 0,
        closingDay: (tipo === "CREDITO" || tipo === "MISTO") ? Number(closingDay) : undefined,
        dueDay: (tipo === "CREDITO" || tipo === "MISTO") ? Number(dueDay) : undefined,
        cor,
        icone,
      });
  alert.showAlert("Sucesso", "Cartão vinculado à conta!");
      onSuccess?.();
      onClose();
    } catch (e) {
      let msg = "Não foi possível adicionar o cartão.";
      if (e instanceof Error) msg += `\n${e.message}`;
  alert.showAlert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Cartão à Conta</Text>
      <Input
        placeholder="Nome do Cartão"
        value={nome}
        onChangeText={setNome}
      />

      {/* Tipo do cartão */}
      <Text style={styles.label}>Tipo</Text>
      <View style={styles.inlineRow}>
        <TouchableOpacity
          style={[styles.pill, tipo === "CREDITO" && styles.pillActive]}
          onPress={() => setTipo("CREDITO")}
        >
          <Feather name="credit-card" size={16} color={tipo === "CREDITO" ? "#fff" : "#333"} />
          <Text style={[styles.pillText, tipo === "CREDITO" && styles.pillTextActive]}>Crédito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, tipo === "DEBITO" && styles.pillActive]}
          onPress={() => setTipo("DEBITO")}
        >
          <Feather name="dollar-sign" size={16} color={tipo === "DEBITO" ? "#fff" : "#333"} />
          <Text style={[styles.pillText, tipo === "DEBITO" && styles.pillTextActive]}>Débito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, tipo === "MISTO" && styles.pillActive]}
          onPress={() => setTipo("MISTO")}
        >
          <Feather name="layers" size={16} color={tipo === "MISTO" ? "#fff" : "#333"} />
          <Text style={[styles.pillText, tipo === "MISTO" && styles.pillTextActive]}>Misto</Text>
        </TouchableOpacity>
      </View>

      {/* Limite (opcional) */}
      <Input
        placeholder="Limite (opcional)"
        value={limite}
        onChangeText={setLimite}
        keyboardType="numeric"
      />

      {/* Fechamento e vencimento para crédito/misto */}
      {(tipo === "CREDITO" || tipo === "MISTO") && (
        <View style={styles.inlineRow}>
          <Input
            style={{ flex: 1, marginRight: 6 }}
            placeholder="Fechamento (1-28)"
            keyboardType="numeric"
            value={closingDay}
            onChangeText={setClosingDay}
          />
          <Input
            style={{ flex: 1, marginLeft: 6 }}
            placeholder="Vencimento (1-28)"
            keyboardType="numeric"
            value={dueDay}
            onChangeText={setDueDay}
          />
        </View>
      )}

      {/* Poderia adicionar seleção de cor/ícone aqui */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={loading}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", borderRadius: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 18, textAlign: "center" },
  // input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 16 },
  label: { fontWeight: "bold", marginBottom: 6, marginTop: 8 },
  inlineRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  pill: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8, backgroundColor: "#f5f5f5" },
  pillActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
  pillText: { marginLeft: 6, color: "#333", fontWeight: "bold" },
  pillTextActive: { color: "#fff" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, backgroundColor: "#28a745", padding: 14, borderRadius: 10, alignItems: "center", marginRight: 8 },
  cancelButton: { backgroundColor: "#6c757d", marginRight: 0, marginLeft: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
