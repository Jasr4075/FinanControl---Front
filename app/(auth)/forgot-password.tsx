import api from '@/src/utils/api';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) return Alert.alert("Erro", "Digite seu email");

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (!data) throw new Error('Falha ao enviar email');
      Alert.alert("Sucesso", "Email de recuperação enviado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar email");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TouchableOpacity onPress={handleReset} style={styles.button}>
        <Text style={styles.buttonText}>Enviar email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  input: { width: "100%", maxWidth: 350, height: 48, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginTop: 16, paddingHorizontal: 12 },
  button: { width: "100%", maxWidth: 350, height: 48, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
