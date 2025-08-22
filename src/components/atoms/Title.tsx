import { StyleSheet, Text, TextProps } from "react-native";

export default function Title({ children, style, ...props }: TextProps) {
  return (
    <Text {...props} style={[styles.title, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "800", color: "#1C1C1E" },
});
