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
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "@/src/utils/api";
import { Conta } from "../../types/types";

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
  const [criarCartao, setCriarCartao] = useState(false);
  const [cartaoNome, setCartaoNome] = useState("");
  const [cartaoTipo, setCartaoTipo] = useState<"CREDITO" | "DEBITO" | "MISTO">(
    "CREDITO"
  );
  const [creditLimit, setCreditLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [cashbackPercent, setCashbackPercent] = useState("");
  const [hasCashback, setHasCashback] = useState(false);

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

      const contaResp = await api.post("/contas", {
        userId: user.id,
        type,
        bancoNome,
        agencia,
        conta,
        saldo: parseFloat(saldo),
        efetivo: false,
        cdiPercent: 0.0,
      });

      let cartaoCriadoId: string | null = null;
      if (criarCartao) {
        try {
          const contaId = contaResp.data?.data?.id;
          if (!contaId) throw new Error("Conta não retornou ID");
          if (!cartaoNome) throw new Error("Nome do cartão é obrigatório");
          if (!closingDay || !dueDay)
            throw new Error("Dias de fechamento e vencimento obrigatórios");
          await api.post("/cartoes", {
            userId: user.id,
            contaId,
            nome: cartaoNome,
            type: cartaoTipo,
            creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
            hasCashback,
            cashbackPercent:
              hasCashback && cashbackPercent ? parseFloat(cashbackPercent) : 0,
            closingDay: parseInt(closingDay, 10),
            dueDay: parseInt(dueDay, 10),
          });
          cartaoCriadoId = "ok";
        } catch (e: any) {
          console.error("Erro ao criar cartão vinculado", e);
          Alert.alert(
            "Aviso",
            "Conta criada, mas falhou ao criar cartão: " + (e?.message || "")
          );
        }
      }

      Alert.alert(
        "Sucesso",
        `Conta criada${
          criarCartao ? (cartaoCriadoId ? " + cartão" : " (cartão falhou)") : ""
        }!`
      );
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

        {/* Opção criar cartão */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.label}>Criar cartão agora?</Text>
          <Switch value={criarCartao} onValueChange={setCriarCartao} />
        </View>

        {criarCartao && (
          <View style={styles.cardContainer}>
            <Text style={styles.subSectionTitle}>Dados do Cartão</Text>

            {/* Nome do cartão */}
            <TextInput
              style={styles.input}
              placeholder="Nome do Cartão (ex: Visa Gold)"
              value={cartaoNome}
              onChangeText={setCartaoNome}
            />

            {/* Tipo de cartão */}
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.inlineRow}>
              <TouchableOpacity
                style={[
                  styles.pill,
                  cartaoTipo === "CREDITO" && styles.pillActive,
                ]}
                onPress={() => setCartaoTipo("CREDITO")}
              >
                <Feather
                  name="credit-card"
                  size={16}
                  color={cartaoTipo === "CREDITO" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.pillText,
                    cartaoTipo === "CREDITO" && styles.pillTextActive,
                  ]}
                >
                  Crédito
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pill,
                  cartaoTipo === "DEBITO" && styles.pillActive,
                ]}
                onPress={() => setCartaoTipo("DEBITO")}
              >
                <Feather
                  name="dollar-sign"
                  size={16}
                  color={cartaoTipo === "DEBITO" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.pillText,
                    cartaoTipo === "DEBITO" && styles.pillTextActive,
                  ]}
                >
                  Débito
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pill,
                  cartaoTipo === "MISTO" && styles.pillActive,
                ]}
                onPress={() => setCartaoTipo("MISTO")}
              >
                <Feather
                  name="layers"
                  size={16}
                  color={cartaoTipo === "MISTO" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.pillText,
                    cartaoTipo === "MISTO" && styles.pillTextActive,
                  ]}
                >
                  Misto
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campos específicos para crédito/misto */}
            {(cartaoTipo === "CREDITO" || cartaoTipo === "MISTO") && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Limite de Crédito"
                  keyboardType="numeric"
                  value={creditLimit}
                  onChangeText={setCreditLimit}
                />

                <View style={styles.inlineRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 6 }]}
                    placeholder="Fechamento (1-28)"
                    keyboardType="numeric"
                    value={closingDay}
                    onChangeText={setClosingDay}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 6 }]}
                    placeholder="Vencimento (1-28)"
                    keyboardType="numeric"
                    value={dueDay}
                    onChangeText={setDueDay}
                  />
                </View>

                {/* Cashback */}
                <View style={styles.cashbackRow}>
                  <View>
                    <Text style={styles.label}>Cashback</Text>
                    <Text style={styles.hint}>
                      Ative se este cartão oferecer cashback
                    </Text>
                  </View>
                  <Switch value={hasCashback} onValueChange={setHasCashback} />
                </View>

                {hasCashback && (
                  <TextInput
                    style={styles.input}
                    placeholder="% Cashback (0-100)"
                    keyboardType="numeric"
                    value={cashbackPercent}
                    onChangeText={setCashbackPercent}
                  />
                )}
              </>
            )}
          </View>
        )}

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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  inlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#28a745",
  },
  pillText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  cashbackRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  hint: {
    fontSize: 12,
    color: "#777",
  },
});
