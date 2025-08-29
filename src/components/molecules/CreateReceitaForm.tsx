import { Feather } from "@expo/vector-icons"; // ícone de lupa
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUser } from "@/src/utils/auth";
import api from "@/src/utils/api";
import { useCreateReceita } from "@/src/hooks/useCreateReceita";
import { Conta, Categoria } from "../../types/types";
import Input from "../atoms/Input";

export default function CreateReceitaForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const { createReceita, loading, error, success } = useCreateReceita();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [contas, setContas] = useState<Conta[]>([]);
  const [accountId, setAccountId] = useState("");

  const [searchCategoria, setSearchCategoria] = useState("");
  const [searchConta, setSearchConta] = useState("");

  const [description, setDescription] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (success) {
      onSuccess?.();
    }
  }, [success, onSuccess]);
  useEffect(() => {
    if (error) Alert.alert("Erro", error.toString());
  }, [error]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        const receitas = res.data.data.filter(
          (cat: any) => cat.type?.toUpperCase() === "RECEITA"
        );
        setCategorias(receitas);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar as categorias");
      }
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    async function fetchContas() {
      const user = await getUser();
      if (!user?.id) return;
      const { data } = await api.get(`/contas/user/${user.id}`);
      if (data?.success) {
        const contasData: Conta[] = data.data.map((c: any) => ({
          id: c.id,
          nome: `${c.bancoNome} - ${c.conta}`,
        }));
        setContas(contasData);
      }
    }
    fetchContas();
  }, []);

  const handleSubmit = async () => {
    const user = await getUser();
    if (!user?.id) return Alert.alert("Erro", "Usuário não encontrado");
    if (!accountId || !categoryId || !description || !quantidade) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    await createReceita({
      userId: user.id,
      accountId,
      categoryId,
      description,
      quantidade: Number(quantidade),
      data: date.toISOString().split("T")[0],
    } as any);
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategoria.toLowerCase())
  );
  const contasFiltradas = contas.filter((c) =>
    c.nome.toLowerCase().includes(searchConta.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Nova Receita</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                accountId === c.id && styles.selectButtonActive,
              ]}
              onPress={() => setAccountId(c.id)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  accountId === c.id && styles.selectButtonTextActive,
                ]}
              >
                {c.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <Input
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição"
          />
        </View>

        {/* Quantidade */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantidade *</Text>
          <Input
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="Valor"
          />
        </View>

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
            {loading ? "Criando..." : "Criar Receita"}
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
  title: { fontSize: 24, fontWeight: "700", color: "#1a1a1a" },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: { fontSize: 18, color: "#666", fontWeight: "600" },
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
    backgroundColor: "#28a745",
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
  horizontalScroll: { marginBottom: 16 },
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
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  selectButtonActive: { backgroundColor: "#28a745", borderColor: "#28a745" },
  selectButtonText: { color: "#333", fontWeight: "600" },
  selectButtonTextActive: { color: "#fff" },
});
