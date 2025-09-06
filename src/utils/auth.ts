import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "userToken";
const REFRESH_TOKEN_KEY = "refreshToken";
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
  // Removido log de produção
      return
    }
    // tenta parsear para confirmar
    try {
      JSON.parse(raw)
    } catch {
      localStorage.removeItem(USER_KEY)
  // Removido log de produção
    }
  } catch (e) {
  // Removido log de produção
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

export async function saveRefreshToken(refreshToken: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }
}


export async function getToken(): Promise<string | null> {
  return Platform.OS === "web"
    ? localStorage.getItem(TOKEN_KEY)
    : await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return Platform.OS === "web"
    ? localStorage.getItem(REFRESH_TOKEN_KEY)
    : await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}


export async function deleteToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function deleteRefreshToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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

export async function getUser<T = any>(): Promise<T | null> {
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
  try { return JSON.parse(raw) as T; }
  catch {
    await clearAuth();
    return null;
  }
}


export async function clearAuth() {
  await deleteToken();
  await deleteRefreshToken();
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  // Consider authenticated only when token exists and appears valid
  return validateToken();
}

function base64UrlDecode(input: string): string | null {
  try {
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    switch (str.length % 4) {
      case 0:
        break;
      case 2:
        str += '==';
        break;
      case 3:
        str += '=';
        break;
      default:
        return null;
    }
    if (typeof atob === 'function') {
      return atob(str);
    }
    // Node/other envs
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('binary');
    }
    return null;
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const binary = base64UrlDecode(payload);
    if (!binary) return null;
    const json = decodeURIComponent(
      binary.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function validateToken(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (payload && typeof payload.exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    // consider a small leeway of 5 seconds
    return payload.exp > now + 5;
  }
  // fallback for non-JWT tokens
  return token.length > 10;
}

// Centralized logout helper that clears auth storage and optionally redirects to login
export async function forceLogout(redirect = true) {
  await clearAuth();
  try {
    if (redirect) {
      const { router } = await import('expo-router');
      router.replace('/login');
    }
  } catch {
    // ignore navigation failures
  }
}
