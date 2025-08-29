import api from "@/src/utils/api";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import useRedirectIfAuth from "@/src/hooks/useRedirectIfAuth";
import Input from "../../src/components/atoms/Input";


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const loadingAuth = useRedirectIfAuth();
  

  const handleReset = async () => {
    if (!email) return Alert.alert("Erro", "Digite seu email");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/forgot-password", { email });
      if (!data) throw new Error("Falha ao enviar email");
      Alert.alert(
        "Sucesso",
        "Enviamos um link de recuperação para o seu email!"
      );
      router.push("/(auth)/login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Digite seu email cadastrado e enviaremos um link para redefinir sua
        senha.
      </Text>

      <Input
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={handleReset}
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    maxWidth: 350,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    maxWidth: 350,
    height: 48,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#2e78b7", marginTop: 20, textAlign: "center" },
});
