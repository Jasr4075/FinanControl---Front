import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { saveToken, saveUser } from "@/src/utils/auth";
import api from "@/src/utils/api";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!username || !senha) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    try {
      const response = await api.post("/auth/login", {
        username,
        senha,
      });

      const data = response.data;

      if (data.token) {
        await saveToken(data.token);
        await saveUser(data.user);

        router.replace("/(dashboard)/home");
      } else {
        Alert.alert("Erro", "Usuário ou senha incorretos");
      }
    } catch (error) {
      console.log("error:", error);
      Alert.alert("Erro", "Falha na conexão com o servidor");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinanControl</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* Botão de Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Links secundários */}
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  link: { color: "#2e78b7", marginTop: 10, textAlign: "center" },
});
