import { useState, useEffect } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "@/src/utils/api";
import { getUser } from "@/src/utils/auth";
import { Feather } from "@expo/vector-icons";

interface Props {
  onClose?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function CreateDespesaForm({
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [metodoPagamento, setMetodoPagamento] = useState("PIX");
  const [contaSelecionada, setContaSelecionada] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categorias, setCategorias] = useState<{ id: string; name: string }[]>(
    []
  );
  const [contas, setContas] = useState<any[]>([]);
  const [cartoes, setCartoes] = useState<any[]>([]);
  const [searchCategoria, setSearchCategoria] = useState("");
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategoria.toLowerCase())
  );
  const [searchConta, setSearchConta] = useState("");
  const contasFiltradas = contas.filter((c) =>
    `${c.bancoNome} - ${c.conta}`
      .toLowerCase()
      .includes(searchConta.toLowerCase())
  );
  // Carregar categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        if (res.data.success) setCategorias(res.data.data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as categorias");
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
        if (res.data.success) setContas(res.data.data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as contas");
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

  const handleSubmit = async () => {
    const user = await getUser();
    if (!user?.id) return alert("Usuário não encontrado!");
    if (!descricao || !valor || !contaSelecionada || !categoryId)
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");

    const payload = {
      userId: user.id,
      contaId: contaSelecionada,
      cartaoId: cartaoSelecionado || undefined,
      categoryId,
      descricao,
      valor: Number(valor),
      metodoPagamento,
      data: date.toISOString().split("T")[0],
      ...(metodoPagamento === "CREDITO" && {
        parcelado: true,
        numeroParcelas: Number(parcelas),
      }),
    };

    try {
      if (onSubmit) await onSubmit(payload);
      else await api.post("/despesas", payload);
      Alert.alert("Sucesso!", "Despesa criada com sucesso!", [
        { text: "OK", onPress: onClose },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível criar a despesa. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView contentContainerStyle={styles.container}>
    {/* Header fixo no topo */}
    <View style={styles.header}>
      <Text style={styles.title}>Nova Despesa</Text>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
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
        value={searchConta}
        onChangeText={setSearchConta}
      />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
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
            {c.bancoNome} - {c.conta}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

        {/* Cartão */}
        {cartoes.length > 0 && (
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
        <TextInput
          style={styles.input}
          placeholder="Descrição da despesa"
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Valor */}
        <Text style={styles.label}>Valor *</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        {/* Método de Pagamento */}
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
              onPress={() => setMetodoPagamento(metodo)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  metodoPagamento === metodo && styles.selectButtonTextActive,
                ]}
              >
                {metodo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            {loading ? "Criando..." : "Criar Despesa"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1a1a1a",
  },
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
},
closeButton: {
  padding: 8,
},
closeButtonText: {
  fontSize: 22,
  fontWeight: "700",
  color: "#333",
},

});
