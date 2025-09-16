import { Link } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import useRedirectIfAuth from "@/src/features/auth/useRedirectIfAuth";

export default function Index() {
    const { loading: loadingAuth } = useRedirectIfAuth();
    if (loadingAuth) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Verificando sessão...</Text>
        </View>
      );
    }
  return (
    <View style={styles.container}>
      {/* Futuro espaço para logo */}
      <Text style={styles.title}>My Control</Text>
      <Text style={styles.subtitle}>
        Controle suas finanças de forma simples, clara e inteligente
      </Text>

      <View style={styles.buttonsWrapper}>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.buttonPrimary}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.buttonSecondary}>
            <Text style={styles.buttonText}>Criar conta</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.footer}>
        Seu parceiro no controle financeiro diário 🚀
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fdfdfd",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e1e1e",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: "#555",
    textAlign: "center",
    maxWidth: 320,
  },
  buttonsWrapper: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
