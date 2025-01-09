import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { gql, useMutation } from '@apollo/client';

const ADD_LIKE = gql`
  mutation Mutation($idPost: ID!) {
    likePost(idPost: $idPost) {
      _id
      likes {
        authorId
        createdAt
        updatedAt
      }
    }
  }
`;

export default function CardPost({ post }) {
  const navigation = useNavigation();

  const [isActive, setIsActive] = useState(false);

  const [addLike, { loading, error, data }] = useMutation(ADD_LIKE);

  async function handleLike() {
    try {
      if (loading) return;
      const response = await addLike({ variables: { idPost: post._id } });
      console.log(response.data);
      if (response.data.likePost.likes.length == 0) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!post) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  function handlePostDetail() {
    navigation.navigate('PostDetail', {
      id: post._id,
    });
  }

  function handleProfileDetail() {
    navigation.navigate('UserDetail');
  }

  return (
    <>
      <TouchableOpacity onPress={handlePostDetail}>
        <View style={styles.card}>
          <TouchableOpacity onPress={handleProfileDetail}>
            <View style={styles.profile}>
              <Image source={{ uri: post.User[0].imgUrl }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{post.User[0].name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>6m</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.content}>{post.content}</Text>
            <Image source={{ uri: post.imgUrl }} style={{ width: '100%', height: 300, alignItems: 'center' }} />
          </View>

          <View style={styles.action}>
            <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name={isActive ? 'like1' : 'like2'} size={24} color="black" />
              <Text style={{ marginLeft: 5 }}> {post.likes.length} Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDetail} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text style={{ marginLeft: 5 }}>{post.comments.length} Comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
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

  content: {
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: 'justify',
    // flex: 2,
  },

  action: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    margin: 5,
    paddingHorizontal: 10,
    padding: 5,
    borderTopWidth: 0.3,
    // backgroundColor: 'blue',
  },
});
