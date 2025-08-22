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
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUser } from "@/src/utils/auth";
import api from "@/src/utils/api";
import { useCreateReceita } from "@/src/hooks/useCreateReceita";

interface Categoria {
  id: string;
  name: string;
}

interface Conta {
  id: string;
  nome: string;
}

export default function CreateReceitaForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const { createReceita, loading, error, success } = useCreateReceita();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [contas, setContas] = useState<Conta[]>([]);
  const [accountId, setAccountId] = useState("");

  const [description, setDescription] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openConta, setOpenConta] = useState(false);
  const [itemsConta, setItemsConta] = useState<
    { label: string; value: string }[]
  >([]);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [itemsCategoria, setItemsCategoria] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (success) {
      Alert.alert("Sucesso!", "Receita criada com sucesso!", [
        {
          text: "OK",
          onPress: () => onClose?.(),
        },
      ]);
    }
  }, [success, onClose]);

  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error?.toString?.() || "Falha ao criar receita");
    }
  }, [error]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const { data } = await api.get("/categorias");
        if (data?.success) {
          setCategorias(data.data);
          setItemsCategoria(
            data.data.map((c: Categoria) => ({ label: c.name, value: c.id }))
          );
        }
      } catch {}
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
        setItemsConta(contasData.map((c) => ({ label: c.nome, value: c.id })));
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

    const payload = {
      userId: user.id,
      accountId,
      categoryId,
      description,
      quantidade: Number(quantidade),
      data: date.toISOString().split("T")[0],
    };

    await createReceita(payload as any);
  };

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
        <View
          style={[styles.formGroup, openConta && styles.dropdownOpenContainer]}
        >
          <Text style={styles.label}>Conta *</Text>
          <DropDownPicker
            open={openConta}
            value={accountId}
            items={itemsConta}
            setOpen={setOpenConta}
            setValue={setAccountId as any}
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
              openCategoria && { zIndex: 9000 as any },
            ]}
            zIndex={openCategoria ? 9000 : 2000}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantidade *</Text>
          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="Valor"
          />
        </View>

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
  dropdown: { borderColor: "#ddd", borderRadius: 12 },
  dropdownContainer: { borderColor: "#ddd" },
  dropdownOpenContainer: { zIndex: 9999, elevation: 9999 },
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
});

