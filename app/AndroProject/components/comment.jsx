import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function CommentCard({ comment, users }) {
  const [user, setUser] = useState({
    name: '',
  });

  useEffect(() => {
    const findUser = users.find((el) => el._id == comment.authorId);
    setUser(findUser);
  }, []);
  return (
    <View style={styles.commentCard}>
      <TouchableOpacity>
        <View style={styles.profile}>
          <Image source={{ uri: user?.imgUrl }} style={styles.profileImage} />
          <View>
            <Text style={styles.username}>{user?.name}</Text>
            <Text style={styles.timestamp}>6m</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    margin: 10,
    padding: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentContent: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'justify',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
});
