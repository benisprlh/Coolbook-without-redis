import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native';
import CardProfile from '../components/cardProfile';

export default function UserDetail({ route }) {
  const [followersIsActive, setFollowersIsActive] = useState(true);
  const [user, setUser] = useState(route.params.userLogin);

  function handleFollowers() {
    setFollowersIsActive(true);
  }

  function handleFollowing() {
    setFollowersIsActive(false);
  }
  return (
    <View style={styles.card}>
      <View style={styles.profile}>
        <Image source={{ uri: user.imgUrl }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{user.name}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>{user.username}</Text>
        </View>
      </View>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleFollowers}>
              <Text style={{ textAlign: 'center', fontWeight: followersIsActive ? 'bold' : 'normal' }}>Followers</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleFollowing}>
              <Text style={{ textAlign: 'center', fontWeight: !followersIsActive ? 'bold' : 'normal' }}>Followers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <FlatList data={followersIsActive ? user.followers : user.following} renderItem={({ item }) => <CardProfile user={item} />} keyExtractor={(item, index) => index} ItemSeparatorComponent={() => <View style={{ height: 5 }}></View>} />
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
});
