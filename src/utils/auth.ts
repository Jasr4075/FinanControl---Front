// // src/utils/auth.ts
// import * as SecureStore from 'expo-secure-store';

// const TOKEN_KEY = 'userToken';
// const USER_KEY = 'userData';

// export async function saveToken(token: string) {
//   await SecureStore.setItemAsync(TOKEN_KEY, token);
// }

// export async function getToken() {
//   return await SecureStore.getItemAsync(TOKEN_KEY);
// }

// export async function deleteToken() {
//   await SecureStore.deleteItemAsync(TOKEN_KEY);
// }

// export async function saveUser(user: object) {
//   await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
// }

// export async function getUser() {
//   const data = await SecureStore.getItemAsync(USER_KEY);
//   return data ? JSON.parse(data) : null;
// }

// export async function clearAuth() {
//   await deleteToken();
//   await SecureStore.deleteItemAsync(USER_KEY);
// }
// export async function isAuthenticated() {
//   const token = await getToken();
//   return !!token;
// }

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem('userToken', token);
  } else {
    await SecureStore.setItemAsync('userToken', token);
  }
}

export async function getToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem('userToken');
  } else {
    return await SecureStore.getItemAsync('userToken');
  }
}

export async function deleteToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('userToken');
  } else {
    await SecureStore.deleteItemAsync('userToken');
  }
}

export async function saveUser(user: any) {
  if (Platform.OS === 'web') {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  }
}

export async function getUser() {
  if (Platform.OS === 'web') {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } else {
    const raw = await SecureStore.getItemAsync('user');
    return raw ? JSON.parse(raw) : null;
  }
}

export async function clearAuth() {
  await deleteToken();
  if (Platform.OS === 'web') {
    localStorage.removeItem('user');
  } else {
    await SecureStore.deleteItemAsync('user');
  }
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}