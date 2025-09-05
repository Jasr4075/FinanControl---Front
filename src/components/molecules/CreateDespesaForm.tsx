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
import { Feather } from "@expo/vector-icons";
import { Conta, Categoria, CreateDespesaInput } from "../../types/types";
import Input from "../atoms/Input";
import CustomAlert from "../atoms/Alert";

interface Props {
  contaId?: string;
  cartaoId?: string;
  onClose?: () => void;
  onSubmit?: (data: CreateDespesaInput) => Promise<void>;
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

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [metodoPagamento, setMetodoPagamento] = useState("PIX");
  const [contaSelecionada, setContaSelecionada] = useState(contaId || "");
  const [cartaoSelecionado, setCartaoSelecionado] = useState(cartaoId || "");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [cartoes, setCartoes] = useState<{ id: string; nome: string }[]>([]);
  const [searchCategoria, setSearchCategoria] = useState("");
  const [searchConta, setSearchConta] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //Mostrar alerta: 
  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // filtra só pelo search, já que categorias já é só DESPESA
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategoria.toLowerCase())
  );

  const contasFiltradas = contas.filter((c) =>
    c.nome.toLowerCase().includes(searchConta.toLowerCase())
  );

  const contaSelecionadaObj = contas.find((c) => c.id === contaSelecionada);
  const isEfetivo =
    contaSelecionadaObj?.type === "EFETIVO" && contaSelecionadaObj?.efetivo;

  // Hooks de efeito
  useEffect(() => {
    if (success) {
      showAlert("Sucesso!", "Despesa criada com sucesso!");
    }
  });

  useEffect(() => {
    if (error) showAlert("Erro", error.toString());
  }, [error]);

  useEffect(() => {
    if (isEfetivo) {
      setMetodoPagamento("DINHEIRO");
      setCartaoSelecionado("");
    }
  }, [isEfetivo]);

  // Carregar categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        // filtra apenas DESPESA
        const despesas = res.data.data.filter(
          (cat: any) => cat.type === "DESPESA"
        );
        setCategorias(despesas); // já seta direto
      } catch (err) {
        console.error(err);
        showAlert("Erro", "Não foi possível carregar as categorias");
      }
    }
    fetchCategorias();
  }, []);

  // Carregar contas do usuário
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
        }
      } catch {
        showAlert("Erro", "Não foi possível carregar as contas");
      }
    }
    fetchContas();
  }, []);

  // Atualizar cartões quando a conta muda
  useEffect(() => {
    const conta = contas.find((c) => c.id === contaSelecionada);
    if (conta?.cartoes) setCartoes(conta.cartoes);
    else setCartoes([]);
    setCartaoSelecionado("");
  }, [contaSelecionada]);

  // Submit
  const handleSubmit = async () => {
    const user = await getUser();
    if (!user?.id) return alert("Usuário não encontrado!");
    if (!descricao || !valor || !contaSelecionada || !categoryId)
      showAlert("Atenção", "Preencha todos os campos obrigatórios!");

    const isCredito = metodoPagamento === "CREDITO";
    const payload: CreateDespesaInput = {
      userId: user.id,
      contaId: contaSelecionada,
      cartaoId: cartaoSelecionado || undefined,
      categoryId,
      descricao,
      valor: Number(valor),
      metodoPagamento: metodoPagamento as "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO",
      data: date.toISOString().split("T")[0],
      ...(isCredito && { parcelado: true, numeroParcelas: Number(parcelas) }),
    };

    try {
      if (onSubmit) await onSubmit(payload);
      else await createDespesa(payload);
      showAlert("Sucesso!", "Despesa criada com sucesso!");

    } catch (e) {
      let message = "Não foi possível criar a despesa. Tente novamente.";
      if (e instanceof Error) message += `\n${e.message}`;
      showAlert("Erro", message);
    }
  };

  // UI
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#1a1a1a" }}>
            Nova Despesa
          </Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Conta */}
        <Text style={styles.label}>Conta *</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conta"
            placeholderTextColor="#999"
            value={searchConta}
            onChangeText={setSearchConta}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {contasFiltradas.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.selectButton,
                contaSelecionada === c.id && styles.selectButtonActive,
              ]}
              onPress={() => setContaSelecionada(c.id)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  contaSelecionada === c.id && styles.selectButtonTextActive,
                ]}
              >
                {c.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cartão */}
        {cartoes.length > 0 && !isEfetivo && (
          <>
            <Text style={styles.label}>Cartão (opcional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {cartoes.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.selectButton,
                    cartaoSelecionado === card.id && styles.selectButtonActive,
                  ]}
                  onPress={() => setCartaoSelecionado(card.id)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      cartaoSelecionado === card.id &&
                      styles.selectButtonTextActive,
                    ]}
                  >
                    {card.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Categoria */}
        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar categoria"
            placeholderTextColor="#999"
            value={searchCategoria}
            onChangeText={setSearchCategoria}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {categoriasFiltradas.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.selectButton,
                categoryId === cat.id && styles.selectButtonActive,
              ]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  categoryId === cat.id && styles.selectButtonTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Descrição */}
        <Text style={styles.label}>Descrição *</Text>
        <Input
          style={styles.input}
          placeholder="Descrição da despesa"
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Valor */}
        <Text style={styles.label}>Valor *</Text>
        <Input
          style={styles.input}
          placeholder="Valor"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        {/* Método de Pagamento */}
        {!isEfetivo && (
          <>
            <Text style={styles.label}>Método de Pagamento *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {["PIX", "DEBITO", "CREDITO", "DINHEIRO"].map((metodo) => (
                <TouchableOpacity
                  key={metodo}
                  style={[
                    styles.selectButton,
                    metodoPagamento === metodo && styles.selectButtonActive,
                  ]}
                  onPress={() => {
                    setMetodoPagamento(metodo);
                    if (metodo !== "CREDITO") setParcelas("1");
                  }}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      metodoPagamento === metodo &&
                      styles.selectButtonTextActive,
                    ]}
                  >
                    {metodo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Parcelas */}
        {metodoPagamento === "CREDITO" && (
          <>
            <Text style={styles.label}>Parcelas *</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de parcelas"
              keyboardType="numeric"
              value={parcelas}
              onChangeText={setParcelas}
            />
          </>
        )}

        {/* Data */}
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

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {loading ?? loadingHook ? "Criando..." : "Criar Despesa"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)} // opcional
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginVertical: 10, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  horizontalScroll: { marginBottom: 10 },
  selectButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  selectButtonActive: { backgroundColor: "#1a73e8", borderColor: "#1a73e8" },
  selectButtonText: { color: "#333", fontWeight: "500" },
  selectButtonTextActive: { color: "#fff" },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fafafa",
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
  submitButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
});
