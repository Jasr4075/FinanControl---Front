import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "@/src/components/atoms/Input";
import useAuthUser from "@/src/features/auth/useAuthUser";
import { useRouter } from "expo-router";
import api from "@/src/utils/api";
import { useAlert } from "@/src/context/AlertContext";
import CustomAlert from "@/src/components/atoms/Alert";

export default function ProfileScreen() {
  const { user, logout, reload } = useAuthUser();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const alert = useAlert();

  const [editing, setEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [username, setUsername] = useState(user?.username || "");

  // Easter egg: mini game de memória
  const [avatarClicks, setAvatarClicks] = useState(0);
  const [showMemoryGame, setShowMemoryGame] = useState(false);

  const handleAvatarPress = () => {
    setAvatarClicks((prev) => {
      if (prev + 1 === 2) {
        setShowMemoryGame(true);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleCloseMemoryGame = () => {
    setShowMemoryGame(false);
  };

  // Mini game de memória melhorado
  const MemoryGame = () => {
    const baseCards = ["🍎", "🍌", "🍇", "🍊"];
    const cards = [...baseCards, ...baseCards]; // pares

    const shuffleArray = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

    const [shuffled, setShuffled] = useState<string[]>(shuffleArray(cards));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [tries, setTries] = useState(0);
    const [won, setWon] = useState(false);

    const handleFlip = (idx: number) => {
      if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
      setFlipped([...flipped, idx]);
    };

    React.useEffect(() => {
      if (flipped.length === 2) {
        setTries((t) => t + 1);
        const [i1, i2] = flipped;
        if (shuffled[i1] === shuffled[i2]) {
          setMatched((m) => [...m, i1, i2]);
        }
        setTimeout(() => setFlipped([]), 700);
      }
    }, [flipped]);

    React.useEffect(() => {
      if (matched.length === shuffled.length && shuffled.length > 0) {
        setWon(true);
      }
    }, [matched]);

    const handleRestart = () => {
      setShuffled(shuffleArray(cards));
      setFlipped([]);
      setMatched([]);
      setTries(0);
      setWon(false);
    };

    return (
      <View style={styles.memoryGameOverlay}>
        <View style={styles.memoryGameCard}>
          <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
            Jogo da Memória 🍀
          </Text>

          {/* Grid flexível */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
            {shuffled.map((card, idx) => {
              const isVisible = flipped.includes(idx) || matched.includes(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.memoryCard,
                    matched.includes(idx) && styles.memoryCardMatched,
                  ]}
                  onPress={() => handleFlip(idx)}
                  disabled={isVisible}
                >
                  <Text style={{ fontSize: 32 }}>
                    {isVisible ? card : "❓"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text>Tentativas: {tries}</Text>
          {won && (
            <Text style={{ color: "#007AFF", fontWeight: "700", marginTop: 10 }}>
              🎉 Parabéns! Você venceu em {tries} tentativas!
            </Text>
          )}

          <View style={{ flexDirection: "row", marginTop: 18 }}>
            <TouchableOpacity style={styles.memoryCloseBtn} onPress={handleCloseMemoryGame}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Fechar</Text>
            </TouchableOpacity>

            {won && (
              <TouchableOpacity
                style={[styles.memoryCloseBtn, { marginLeft: 10, backgroundColor: "#4CAF50" }]}
                onPress={handleRestart}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Jogar Novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const handleLogout = () => setShowAlert(true);

  const handleSaveProfile = async () => {
    Keyboard.dismiss();
    if (!user?.id) return alert.showAlert("Erro", "Usuário não encontrado");

    setLoadingSave(true);
    try {
      const payload: any = { nome, email, telefone, username };
      await api.put(`/usuarios/${user.id}`, payload);
      alert.showAlert("Sucesso", "Perfil atualizado");
      try {
        await reload?.();
      } catch {}
    } catch (e) {
      let msg = "Falha ao atualizar perfil.";
      if (e instanceof Error) msg += `\n${e.message}`;
      alert.showAlert("Erro", msg);
    } finally {
      setLoadingSave(false);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setNome(user?.nome || "");
    setEmail(user?.email || "");
    setTelefone(user?.telefone || "");
    setUsername(user?.username || "");
    setEditing(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerCard}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={handleAvatarPress}>
                <Image
                  source={{
                    uri:
                      "https://ui-avatars.com/api/?name=" +
                      (user?.nome || "U") +
                      "&background=007AFF&color=fff",
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editAvatarBtn}
                onPress={() =>
                  alert.showAlert("Info", "Editar avatar não implementado")
                }
              >
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.name}>{user?.nome}</Text>
              <Text style={styles.username}>@{user?.username}</Text>
            </View>
          </View>

          {/* User Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Detalhes do Perfil</Text>
            {!editing ? (
              <>
                <View style={styles.infoRow}>
                  <Feather
                    name="mail"
                    size={20}
                    color="#8e8e93"
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Feather
                    name="phone"
                    size={20}
                    color="#8e8e93"
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>
                      {user?.telefone || "Não informado"}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <Input value={nome} onChangeText={setNome} placeholder="Nome" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <Input
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="Telefone"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <Input
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                  />
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {!editing ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setEditing(true)}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.primaryText}>Editar Perfil</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.flex]}
                  onPress={handleSaveProfile}
                  disabled={loadingSave}
                >
                  {loadingSave ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Feather
                        name="save"
                        size={18}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.primaryText}>Salvar</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ghostButton, styles.flex]}
                  onPress={handleCancel}
                  disabled={loadingSave}
                >
                  <Feather
                    name="x-circle"
                    size={18}
                    color="#444"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.ghostText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather
                name="log-out"
                size={18}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Custom Alert */}
        <CustomAlert
          visible={showAlert}
          title="Sair"
          message="Deseja realmente sair da conta?"
          onCancel={() => setShowAlert(false)}
          onConfirm={() => {
            logout();
            setShowAlert(false);
          }}
        />

        {/* Easter Egg Game */}
        {showMemoryGame && <MemoryGame />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F9" },
  scrollContent: { padding: 20 },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20,
  },
  avatarWrapper: { position: "relative", marginRight: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#E5E5E5",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: "800", color: "#1C1C1E" },
  username: { fontSize: 16, color: "#8E8E93", marginTop: 4 },

  sectionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },

  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoIcon: { marginRight: 15 },
  infoLabel: { fontSize: 14, color: "#8E8E93", fontWeight: "500" },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#1C1C1E", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#E5E5EA", marginVertical: 10 },

  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 5,
  },

  actionSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  buttonRow: { 
    flexDirection: "row", 
    marginBottom: 15,
  },
  flex: { flex: 1 },

  primaryButton: { 
    backgroundColor: "#007AFF", 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  buttonIcon: { marginRight: 6 },

  ghostButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingVertical: 18,
    borderRadius: 14,
    marginLeft: 10,
  },
  ghostText: { color: "#444", fontWeight: "600", fontSize: 16 },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 18,
    borderRadius: 14,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Estilos do mini game
  memoryGameOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  memoryGameCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    minWidth: 280,
  },
  memoryCard: {
    width: 60, height: 60,
    backgroundColor: "#F5F7F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    borderWidth: 2,
    borderColor: "#E5E5EA",
  },
  memoryCardMatched: {
    backgroundColor: "#B2F7B2",
    borderColor: "#4CAF50",
  },
  memoryCloseBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});
