import api from '@/src/utils/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    if (!nome || !email || !telefone || !username || !senha)
      return Alert.alert('Erro', 'Preencha todos os campos');

    try {
      const { data } = await api.post('/auth/register', { nome, email, telefone, username, senha });
      if (!data) throw new Error('Registro falhou');
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.push('/(auth)/login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Usuário" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Registrar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  link: { color: '#2e78b7', marginTop: 10, textAlign: 'center' },
});
