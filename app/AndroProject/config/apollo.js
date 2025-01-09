import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import { setContext } from '@apollo/client/link/context';
import { Platform } from 'react-native';

const httpLink = createHttpLink({ uri: 'http://10.11.88.131:3000' });

const authLink = setContext(async (_, { headers }) => {
  let token;
  if (Platform.OS !== 'web') {
    // Hanya jalankan expo-secure-store di perangkat mobile
     token = await SecureStore.getItemAsync('token');
  }
   token = localStorage.getItem('token')

  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const resetApolloCache = async () => {
  await client.clearStore();
  await client.resetStore();
};

export default client;
