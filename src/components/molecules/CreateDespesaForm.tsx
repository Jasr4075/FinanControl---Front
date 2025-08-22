import { useCreateDespesa } from "@/src/hooks/useCreateDespesa";
import api from "@/src/utils/api";
import { getUser } from "@/src/utils/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface Categoria {
  id: string;
  name: string;
}

interface Conta {
  id: string;
  nome: string;
  saldo: number;
  type?: string;
  efetivo?: boolean;
  cartoes?: { id: string; nome: string }[];
}

interface Props {
  contaId?: string;
  cartaoId?: string;
  onClose?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function CreateDespesaForm({
  contaId,
  cartaoId,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const {
    createDespesa,
    loading: loadingHook,
    error,
    success,
  } = useCreateDespesa();

  // Estados
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState<
    "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO"
  >("PIX");
  const [parcelas, setParcelas] = useState("1");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Contas e Cartões ---
  const [contas, setContas] = useState<Conta[]>([]);
  const [contaSelecionada, setContaSelecionada] = useState(contaId || "");
  const [cartaoSelecionado, setCartaoSelecionado] = useState(cartaoId || "");

  // Dropdown Conta
  const [openConta, setOpenConta] = useState(false);
  const [itemsConta, setItemsConta] = useState<
    { label: string; value: string }[]
  >([]);

  // Dropdown Cartão
  const [openCartao, setOpenCartao] = useState(false);
  const [itemsCartao, setItemsCartao] = useState<
    { label: string; value: string }[]
  >([]);

  // Dropdown Categoria
  const [openCategoria, setOpenCategoria] = useState(false);
  const [itemsCategoria, setItemsCategoria] = useState<
    { label: string; value: string }[]
  >([]);

  // Dropdown Método
  const [openMetodo, setOpenMetodo] = useState(false);
  const [itemsMetodo] = useState([
    { label: "PIX", value: "PIX" },
    { label: "Cartão de Crédito", value: "CREDITO" },
    { label: "Cartão de Débito", value: "DEBITO" },
    { label: "Dinheiro", value: "DINHEIRO" },
  ]);
  const contaAtual = contas.find((c) => c.id === contaSelecionada);
  const isEfetivo = contaAtual?.type === "EFETIVO" && contaAtual?.efetivo;

  // Efecto para mostrar mensaje de éxito
  useEffect(() => {
    if (success) {
      Alert.alert("Sucesso!", "Despesa criada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            onClose?.();
          },
        },
      ]);
    }
  }, [success, onClose]);

  // Efecto para mostrar erro
  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error.toString());
    }
  }, [error]);

  useEffect(() => {
    if (isEfetivo) {
      setMetodoPagamento("DINHEIRO");
      setCartaoSelecionado(""); // garante que não vai mandar cartão
    }
  }, [isEfetivo]);

  // Buscar categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        if (res.data.success) {
          setCategorias(res.data.data);
          setItemsCategoria(
            res.data.data.map((c: Categoria) => ({
              label: c.name,
              value: c.id,
            }))
          );
        }
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as categorias");
      }
    }
    fetchCategorias();
  }, []);

  // Buscar contas do usuário
  useEffect(() => {
    async function fetchContas() {
      const user = await getUser();
      if (!user?.id) return;

      try {
        const res = await api.get(`/contas/user/${user.id}`);
        if (res.data.success) {
          const contasData: Conta[] = res.data.data.map((c: any) => ({
            id: c.id,
            nome: `${c.bancoNome} - ${c.conta}`,
            saldo: parseFloat(c.saldo),
            type: c.type,
            efetivo: c.efetivo,
            cartoes: c.cartoes || [],
          }));

          setContas(contasData);
          setItemsConta(
            contasData.map((c) => ({ label: c.nome, value: c.id }))
          );
        }
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as contas");
      }
    }
    fetchContas();
  }, []);

  // Quando muda a conta, carregar os cartões vinculados
  useEffect(() => {
    const conta = contas.find((c) => c.id === contaSelecionada);
    if (conta && conta.cartoes) {
      setItemsCartao(
        conta.cartoes.map((cartao) => ({
          label: cartao.nome,
          value: cartao.id,
        }))
      );
    } else {
      setItemsCartao([]);
      setCartaoSelecionado("");
    }
  }, [contaSelecionada]);

  // Criar despesa
  const handleSubmit = async () => {
    const user = await getUser();
    if (!user?.id) return alert("Usuário não encontrado!");

    if (!categoryId || !descricao || !valor || !contaSelecionada) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    const formattedDate = date.toISOString().split("T")[0];
    const isCredito = metodoPagamento === "CREDITO";
    const numParcelas = isCredito
      ? Math.max(1, Math.min(24, Number(parcelas)))
      : 1;

    const payload = {
      userId: user.id,
      contaId: contaSelecionada,
      cartaoId: cartaoSelecionado || undefined,
      categoryId,
      descricao,
      valor: Number(valor),
      metodoPagamento,
      data: formattedDate,
      ...(isCredito && { parcelado: true, numeroParcelas: numParcelas }),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
        Alert.alert("Sucesso!", "Despesa criada com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              onClose?.();
            },
          },
        ]);
      } else {
        await createDespesa(payload as any);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível criar a despesa. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header com botão de fechar */}
      <View style={styles.header}>
        <Text style={styles.title}>Nova Despesa</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Selecionar Conta */}
        <View
          style={[styles.formGroup, openConta && styles.dropdownOpenContainer]}
        >
          <Text style={styles.label}>Conta *</Text>
          <DropDownPicker
            open={openConta}
            value={contaSelecionada}
            items={itemsConta}
            setOpen={setOpenConta}
            setValue={setContaSelecionada as any}
            setItems={setItemsConta}
            placeholder="Selecione a conta"
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              openConta && { zIndex: 10000 as any },
            ]}
            zIndex={openConta ? 10000 : 3000}
          />
        </View>

        {/* Selecionar Cartão */}
        {!isEfetivo && (

          <View
          style={[styles.formGroup, openCartao && styles.dropdownOpenContainer]}
          >
          <Text style={styles.label}>Cartão</Text>
          <DropDownPicker
            open={openCartao}
            value={cartaoSelecionado}
            items={itemsCartao}
            setOpen={setOpenCartao}
            setValue={setCartaoSelecionado as any}
            setItems={setItemsCartao}
            placeholder="Selecione um cartão (opcional)"
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              openCartao && { zIndex: 9000 as any },
            ]}
            zIndex={openCartao ? 9000 : 2000}
            disabled={itemsCartao.length === 0}
            />
        </View>
          )}

        {/* Categoria */}
        <View
          style={[
            styles.formGroup,
            openCategoria && styles.dropdownOpenContainer,
          ]}
        >
          <Text style={styles.label}>Categoria *</Text>
          <DropDownPicker
            open={openCategoria}
            value={categoryId}
            items={itemsCategoria}
            setOpen={setOpenCategoria}
            setValue={setCategoryId as any}
            setItems={setItemsCategoria}
            placeholder="Selecione uma categoria"
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              openCategoria && { zIndex: 8000 as any },
            ]}
            zIndex={openCategoria ? 8000 : 1000}
          />
        </View>

        {/* Descrição */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Digite a descrição da despesa"
          />
        </View>

        {/* Valor */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor *</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            placeholder="Digite o valor"
          />
        </View>

        {/* Método de Pagamento */}
        {/* Método de Pagamento */}
        {/* Método de Pagamento */}
        {!isEfetivo && (
          <DropDownPicker
            open={openMetodo}
            value={metodoPagamento}
            items={itemsMetodo}
            setOpen={setOpenMetodo}
            setValue={setMetodoPagamento as any}
            onChangeValue={(v) => {
              if (v === "CREDITO") setParcelas("1");
            }}
            placeholder="Selecione o método"
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              openMetodo && { zIndex: 7000 as any },
            ]}
            zIndex={openMetodo ? 7000 : 900}
          />
        )}

        {/* Campo Parcelas - só aparece se for Crédito */}
        {metodoPagamento === "CREDITO" && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Parcelas *</Text>
            <TextInput
              style={styles.input}
              value={parcelas}
              onChangeText={setParcelas}
              keyboardType="numeric"
              placeholder="Número de parcelas"
            />
          </View>
        )}

        {/* Data */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString("pt-BR")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {loading ?? loadingHook ? "Criando..." : "Criar Despesa"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  formGroup: { marginBottom: 20, zIndex: 1 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateText: { fontSize: 16, color: "#333" },
  submitButton: {
    backgroundColor: "#e63946",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown: {
    borderColor: "#ddd",
    borderRadius: 12,
  },
  dropdownContainer: {
    borderColor: "#ddd",
  },
  dropdownOpenContainer: {
    zIndex: 9999,
    elevation: 9999,
  },
  submitButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
