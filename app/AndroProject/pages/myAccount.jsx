import { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../context/loginContext';
import { resetApolloCache } from '../config/apollo';

export default function MyProfile() {
  const navigation = useNavigation();
  const { logoutAction } = useContext(LoginContext);
  const { userLogin, setUserLogin } = useContext(LoginContext);

  async function handleLogout() {
    try {
      setUserLogin(null);
      await resetApolloCache();
      logoutAction('token');
    } catch (error) {
      console.log(error);
    }
  }

  function handleDetailProfile() {
    navigation.navigate('UserDetail', {
      userLogin,
    });
  }
  return (
    <TouchableOpacity onPress={handleDetailProfile}>
      <View style={styles.card}>
        <View style={styles.profile}>
          <Image source={{ uri: userLogin?.imgUrl }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{userLogin?.name}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>{userLogin?.username}</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center', marginHorizontal: 20 }}>
          <TouchableOpacity onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 5,
  },

  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
