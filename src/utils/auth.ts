import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "userToken";
const USER_KEY = "user";

// 🔹 Apenas web precisa dessa limpeza
async function cleanupCorruptedData() {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return
    const looksPlain = raw === '[object Object]' || raw.trim() === ''
    const looksInvalidJSON = !raw.startsWith('{') && !raw.startsWith('[')
    if (looksPlain || looksInvalidJSON) {
      localStorage.removeItem(USER_KEY)
      console.log('[auth] Removido user corrompido (forma inválida)')
      return
    }
    // tenta parsear para confirmar
    try {
      JSON.parse(raw)
    } catch {
      localStorage.removeItem(USER_KEY)
      console.log('[auth] Removido user corrompido (JSON parse falhou)')
    }
  } catch (e) {
    console.error('[auth] Erro ao limpar dados corrompidos:', e)
  }
}

cleanupCorruptedData()

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  return Platform.OS === "web"
    ? localStorage.getItem(TOKEN_KEY)
    : await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveUser(user: object) {
  const json = JSON.stringify(user);
  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, json);
  } else {
    await SecureStore.setItemAsync(USER_KEY, json);
  }
}

export async function getUser(): Promise<any | null> {
  let raw: string | null =
    Platform.OS === "web"
      ? localStorage.getItem(USER_KEY)
      : await SecureStore.getItemAsync(USER_KEY);

  if (!raw) return null;
  // valida forma antes de parsear
  if (raw === '[object Object]' || (!raw.startsWith('{') && !raw.startsWith('['))) {
    await clearAuth();
    return null;
  }
  try { return JSON.parse(raw); }
  catch {
    await clearAuth();
    return null;
  }
}

export async function clearAuth() {
  await deleteToken();
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

export async function validateToken(): Promise<boolean> {
  const token = await getToken();
  return token ? token.length > 10 : false;
}
