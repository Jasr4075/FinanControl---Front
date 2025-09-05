import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuthUser } from "@/src/hooks";
import { useRouter } from "expo-router";
import CustomAlert from "../../src/components/atoms/Alert"; // ajusta o caminho se precisar

export default function ProfileScreen() {
  const { user, logout } = useAuthUser();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    setShowAlert(true);
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://ui-avatars.com/api/?name=" + user?.nome }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.nome}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>

      {/* Dados */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{user?.telefone || "Não informado"}</Text>
      </View>

      {/* Botões */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={showAlert}
        title="Sair"
        message="Deseja realmente sair?"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          logout();
          setShowAlert(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  avatarContainer: { alignItems: "center", marginVertical: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "700", color: "#1C1C1E" },
  username: { fontSize: 16, color: "#666", marginTop: 4 },
  infoCard: {
    backgroundColor: "#F7F7F7",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  label: { fontSize: 14, color: "#888", marginTop: 8 },
  value: { fontSize: 16, fontWeight: "500", color: "#333" },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  editText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
