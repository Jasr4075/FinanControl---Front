import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

// Input reutilizável com placeholder padrão e estilo consistente
export default function Input(props: TextInputProps) {
  const { style, placeholderTextColor, ...rest } = props;
  return (
    <TextInput
      {...rest}
      placeholderTextColor={placeholderTextColor || '#888'}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});
