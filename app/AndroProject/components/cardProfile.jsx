import { useEffect } from 'react';

const { View, Image, Text, StyleSheet } = require('react-native');

export default function CardProfile({ user }) {
  return (
    <View style={styles.card}>
      <View style={styles.profile}>
        <Image source={{ uri: user?.imgUrl }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{user?.name}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>{user?.username}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 5,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 45,
    margin: 12,
    borderWidth: 0.4,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 25,
    height: 30,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#141823',
    marginTop: 20,
    backgroundColor: '#0866ff',
  },
});
