import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

// Input reutilizável com placeholder padrão e estilo consistente
export default function Input(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={props.placeholderTextColor || '#888'}
      style={[styles.input, props.style]}
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
