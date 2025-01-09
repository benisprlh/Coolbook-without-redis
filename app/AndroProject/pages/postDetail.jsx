import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import CommentCard from '../components/comment';
import { gql, useQuery, useMutation } from '@apollo/client';
import { GET_POST } from './home';
import { LoginContext } from '../context/loginContext';

const ADD_COMMENT = gql`
  mutation Mutation($idPost: ID!, $content: String!) {
    commentPost(idPost: $idPost, content: $content) {
      content
      authorId
      createdAt
      updatedAt
    }
  }
`;

const GET_POST_BY_ID = gql`
  query Posts($postByIdId: ID) {
    postById(id: $postByIdId) {
      _id
      content
      tags
      imgUrl
      createdAt
      updatedAt
      commentUsers {
        _id
        username
        name
        imgUrl
      }
      likeUsers {
        _id
        username
        name
        imgUrl
      }
      User {
        _id
        username
        name
        imgUrl
      }
      comments {
        content
        authorId
        createdAt
        updatedAt
      }
    }
  }
`;

export default function PostDetail({ route }) {
  const [isActive, setIsActive] = useState(false);
  const [post, setPost] = useState({});
  const navigation = useNavigation();
  const [input, setInput] = useState({
    idPost: '',
    content: '',
  });
  const { userLogin } = useContext(LoginContext);

  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: {
      postByIdId: route.params.id,
    },
  });

  const { refetch: refetchPosts } = useQuery(GET_POST);

  const [addComment, { loading: loadingComment, error: errorComment, data: dataComment }] = useMutation(ADD_COMMENT);

  useEffect(() => {
    if (data) {
      setPost(data.postById);
    }
  }, [data]);

  function handleLike() {
    setIsActive(!isActive);
  }

  function handleProfileDetail() {
    navigation.navigate('UserDetail');
  }

  if (!post.imgUrl) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  function handleInput(text) {
    setInput({ idPost: route.params.id, content: text });
  }

  async function handleComment() {
    try {
      if (loadingComment) return;
      const response = await addComment({ variables: input });
      setInput({ ...input, content: '' });
      refetch();
      refetchPosts();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginBottom: 50 }}>
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
                <Text style={{ marginLeft: 5 }}> {post.likeUsers.length} Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="chatbubble-outline" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}> Comments</Text>
              </TouchableOpacity>
            </View>
          </View>

          {post.comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} users={post.commentUsers} />
          ))}
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 50, height: 50, backgroundColor: '#fff', borderRadius: 50 }}>
          <TextInput style={{ padding: 15 }} value={input.content} placeholder="Comment here..." onChangeText={(text) => handleInput(text)}></TextInput>
        </View>
        <TouchableOpacity onPress={handleComment}>
          {loadingComment ? <ActivityIndicator style={{ position: 'absolute', right: 15, bottom: 10 }} /> : <Ionicons name="send" size={24} color="black" style={{ position: 'absolute', right: 15, bottom: 10 }} />}
        </TouchableOpacity>
      </View>
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
