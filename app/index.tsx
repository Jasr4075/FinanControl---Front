import { Link } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao FinanControl</Text>
      <Text style={styles.subtitle}>Gerencie suas finanças de forma simples</Text>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity style={{ ...styles.button, ...styles.secondary }}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: 250, // Use a fixed width for web compatibility
    alignItems: "center",
  },
  secondary: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});