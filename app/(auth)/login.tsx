import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { saveToken, saveUser } from "@/src/utils/auth";
import api from "@/src/utils/api";
import { Feather } from "@expo/vector-icons";
import useRedirectIfAuth from "@/src/hooks/useRedirectIfAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Novo estado para erro geral de autenticação
  const [error, setError] = useState<{ username?: string; senha?: string; auth?: string }>({});
  const loadingAuth = useRedirectIfAuth();

  async function handleLogin() {
    let newErrors: typeof error = {};
    if (!username.trim()) newErrors.username = "Usuário obrigatório";
    if (!senha.trim()) newErrors.senha = "Senha obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);

      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        senha: senha.trim()
      });
      const data = response.data;

      if (data.token && data.user) {
        await Promise.all([
          saveToken(data.token),
          saveUser(data.user)
        ]);
        router.replace("/(dashboard)/home");
      } else if (data.erro) {
        setError({ senha: data.erro });
      } else {
        setError({ senha: "Resposta inválida do servidor" });
      }
    } catch (err: any) {
      // Se for 401, mostra mensagem amigável
      if (err.response?.status === 401) {
        setError({ auth: "E-mail ou senha incorretos." });
      } else if (err.response?.data?.erro) {
        setError({ senha: err.response.data.erro });
      } else if (err.message === 'Network Error') {
        setError({ senha: "Sem conexão com o servidor" });
      } else {
        setError({ senha: "Erro interno. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My control</Text>

      {/* Campo Usuário */}
      <View style={[styles.inputWrapper, error.username && styles.inputError]}>
        <Feather name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#999"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            // Limpa todos os erros ao digitar
            if (Object.keys(error).length > 0) setError({});
          }}
          autoCapitalize="none"
          returnKeyType="next"
          editable={!loading}
        />
      </View>
      {error.username && <Text style={styles.errorText}>{error.username}</Text>}

      {/* Campo Senha */}
      <View style={[styles.inputWrapper, error.senha && styles.inputError]}>
        <Feather name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            // Limpa todos os erros ao digitar
            if (Object.keys(error).length > 0) setError({});
          }}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {error.senha && <Text style={styles.errorText}>{error.senha}</Text>}
      {/* Mensagem de erro de autenticação (senha/email incorretos) */}
      {error.auth && <Text style={styles.errorText}>{error.auth}</Text>}

      {/* Botão Login */}
      <TouchableOpacity
        style={[
          styles.button,
          (!username || !senha || loading) && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={!username || !senha || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          disabled={loading}
        >
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          disabled={loading}
        >
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          disabled={loading}
        >
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 40,
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
  inputError: {
    borderColor: "red",
    backgroundColor: "#fff5f5",
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
    opacity: 0.7,
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