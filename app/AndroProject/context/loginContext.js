import { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const LoginContext = createContext();

async function getValueFor(key) {
  let result;
  if (Platform.OS !== 'web') {
    // Hanya jalankan expo-secure-store di perangkat mobile
     result = await SecureStore.getItemAsync(key);
  }
  result = await localStorage.getItem(key)
  return result;
}

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogin, setUserLogin] = useState(null); // Store user data (e.g., token)

  async function loginAction(key, value) {
    try {
      if (Platform.OS !== 'web') {
        // Hanya jalankan expo-secure-store di perangkat mobile
        await SecureStore. setItemAsync(key, value); // Save token in secure storage
      }
      localStorage.setItem(key, value);
      setIsLoggedIn(true);
      setUserLogin(value); // Store token in the userLogin state
    } catch (error) {
      console.log(error);
    }
  }

  async function logoutAction(key) {
    try {
      if (Platform.OS !== 'web') {
        // Hanya jalankan expo-secure-store di perangkat mobile
        await SecureStore.deleteItemAsync(key); // Remove token from secure storage
      }
      localStorage.clear(key);
      setIsLoggedIn(false);
      setUserLogin(null); // Clear userLogin state on logout
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // On initial load, check if the token is stored
    getValueFor('token').then((data) => {
      if (data) {
        setIsLoggedIn(true);
        setUserLogin(data); // Set token (or user info) when app reloads
      }
    });
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loginAction,
        logoutAction,
        userLogin, // Return user data/token
        setUserLogin
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
