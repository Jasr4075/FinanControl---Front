import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function ActionButton({
  href,
  label,
  color,
  onPress,
}: {
  href?: string;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  if (href) {
    return (
      <TouchableOpacity style={[styles.button, { backgroundColor: color }]}>
        <Link href={href as any} style={styles.text}>
          {label}
        </Link>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
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
