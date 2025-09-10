import api from "@/src/utils/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useRedirectIfAuth from "@/src/features/auth/useRedirectIfAuth";

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [username, setUsername] = useState(""); // será auto gerado
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const loadingAuth = useRedirectIfAuth();

  // 🔹 Atualiza email e gera username automático
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const beforeAt = value.split("@")[0];
    setUsername(beforeAt || "");
  };

  const handleRegister = async () => {
    let newErrors: Record<string, string> = {};
    if (!nome) newErrors.nome = "Nome obrigatório";
    if (!email) newErrors.email = "Email obrigatório";
    if (!telefone) newErrors.telefone = "Telefone obrigatório";
    if (!username) newErrors.username = "Usuário obrigatório";
    if (!senha) newErrors.senha = "Senha obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        nome,
        email,
        telefone,
        username,
        senha,
      });
      if (!data) throw new Error("Registro falhou");

      router.push("/(auth)/login");
    } catch (error) {
      setError({ geral: "Falha ao registrar usuário" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      {/* Nome */}
      <View style={styles.inputWrapper}>
        <Feather name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />
      </View>
      {error.nome && <Text style={styles.errorText}>{error.nome}</Text>}

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Feather name="mail" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {error.email && <Text style={styles.errorText}>{error.email}</Text>}

      {/* Telefone */}
      <View style={styles.inputWrapper}>
        <Feather name="phone" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
      </View>
      {error.telefone && <Text style={styles.errorText}>{error.telefone}</Text>}

      {/* Usuário (auto gerado do email, só leitura) */}
      <View style={[styles.inputWrapper, { backgroundColor: "#f0f0f0" }]}>
        <Feather name="user-check" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={[styles.input, { color: "#555" }]}
          placeholder="Usuário"
          value={username}
          editable={false} // 🔒 usuário não pode alterar manualmente
        />
      </View>
      {error.username && <Text style={styles.errorText}>{error.username}</Text>}

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {error.senha && <Text style={styles.errorText}>{error.senha}</Text>}

      {/* Erro geral */}
      {error.geral && <Text style={styles.errorText}>{error.geral}</Text>}

      {/* Botão Registrar */}
      <TouchableOpacity
        style={[
          styles.button,
          (!nome || !email || !telefone || !senha || loading) &&
            styles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={!nome || !email || !telefone || !senha || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrar</Text>
        )}
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#1a1a1a",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  errorText: {
    fontSize: 13,
    color: "red",
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "600",
  },
  linksContainer: {
    marginTop: 24,
    alignItems: "center",
    gap: 12,
  },
  link: {
    fontSize: 15,
    color: "#2563eb",
    fontWeight: "500",
  },
});
