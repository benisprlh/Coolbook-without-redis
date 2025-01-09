import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { gql, useMutation } from '@apollo/client';
import { LoginContext } from '../context/loginContext';

const LOGIN = gql`
  mutation Mutation($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export default function Login({ navigation }) {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const { loginAction } = useContext(LoginContext);
  const [loginUser, { data, loading, error }] = useMutation(LOGIN);

  function handleChange(name, text) {
    setInput({
      ...input,
      [name]: text,
    });
  }

  async function handleLogin() {
    try {
      if (loading) return;
      const response = await loginUser({ variables: { email: input.email, password: input.password } });
      await SecureStore.setItemAsync('token', response.data.login.access_token)
      await loginAction('token', response.data.login.access_token);
    } catch (error) {
      console.log(error);
    }
  }

  function handleToRegister() {
    navigation.navigate('Register');
  }

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        <View style={{ flex: 0.8, justifyContent: 'center', gap: 10, marginTop: '15%' }}>
          <Image
            source={{
              uri: 'https://cdn.gencraft.com/prod/user/75e50ff6-5bbf-48f0-8859-fdf3735468d6/74b952e0-66bc-4856-ae4b-2ce62a33dc94/image/image0_0.jpg?Expires=1701507972&Signature=ABxBMBu5LB~rkf4HQjBbHxk9FcLsUJ3zrUc7yZ~-Zr4PCEqOVtg4gpeNldSdPJmHk~DNl-zu9MWCFc32Ilv1j34MaZIzBFnWy64Dy0u2z7bBvlX9evvzHEcpFlcaoe-NsPs2vo48qob5eULXOpohR94zqW8nrAQB0taAlv2LQQbUbHejTVX~nMdS6-iv0-FdqXqERSioKFQoJ0Ri6boOOHjZA-umON~J2GZ66uTsuACR3F9tceG5KY~I25iuEU9FKXlJXA8CWlGGsPGXPg72IYSXZ3y1fCWRao14dNmwib0nmwkYy4NKmPfTnbvzzSfq9mvpfcdaWffxFAve~WN4mQ__&Key-Pair-Id=K3RDDB1TZ8BHT8',
            }}
            style={{ width: 55, height: 55, alignSelf: 'center', marginBottom: 80, borderRadius: 100 }}
          />
          {/* {error ? <Text style={{ alignSelf: 'center', color: 'red' }}>{error}</Text> : <Text>error</Text>} */}
          <TextInput style={styles.input} onChangeText={(text) => handleChange('email', text)} value={input.email} placeholder="Email" />
          <TextInput style={styles.input} onChangeText={(text) => handleChange('password', text)} value={input.password} placeholder="Password" textContentType="password" />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              {loading ? <ActivityIndicator /> : <Text style={{ color: '#ffff', fontSize: 17 }}>Login</Text>}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity style={styles.buttonRegister} onPress={handleToRegister}>
            <Text style={{ color: '#0866ff', fontSize: 17 }}>Belum punya akun?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 0,
    marginHorizontal: '2%',
    width: '90%',
    // backgroundColor: 'blue',
  },
  button: {
    borderRadius: 25,
    height: 47,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#141823',
    marginTop: 20,
    backgroundColor: '#0866ff',
  },
  buttonRegister: {
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#141823',
    borderWidth: 0.7,
    borderColor: '#0866ff',
    marginTop: 50,
  },
  input: {
    height: 55,
    margin: 12,
    borderWidth: 0.4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f8ff',
  },
});
