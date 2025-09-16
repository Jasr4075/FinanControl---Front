import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";

interface ActionButtonProps {
  href?: Parameters<typeof Link>[0]["href"];
  label: string;
  color: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ActionButton({ href, label, color, onPress, loading = false, disabled = false }: ActionButtonProps) {
  const isDisabled = disabled || loading;
  if (href) {
    return (
      <TouchableOpacity style={[styles.button, { backgroundColor: color }]} disabled={isDisabled}> 
        <Link href={href} style={styles.text}>
          {loading ? <ActivityIndicator color="#fff" /> : label}
        </Link>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={isDisabled ? undefined : onPress} disabled={isDisabled}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  text: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});
