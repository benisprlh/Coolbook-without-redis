import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { GET_POST } from './home';

const ADD_POST = gql`
  mutation Mutation($post: post) {
    addPost(post: $post) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      comments {
        content
        authorId
        createdAt
        updatedAt
      }
      likes {
        authorId
        createdAt
        updatedAt
      }
      User {
        _id
        username
        name
        imgUrl
      }
    }
  }
`;

export default function AddPost({ navigation }) {
  const [input, setInput] = useState({
    content: '',
    imgUrl: '',
    tags: '',
  });

  const { refetch: refetchPosts } = useQuery(GET_POST);

  function handleChange(name, text) {
    setInput({ ...input, [name]: text });
  }

  const [addPost, { loading, error, data }] = useMutation(ADD_POST);

  async function handlePost() {
    try {
      if (loading) return;
      await addPost({ variables: { post: input } });
      await refetchPosts();
      navigation.navigate('TabNavigation');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} multiline numberOfLines={4} value={input.content} onChangeText={(text) => handleChange('content', text)} placeholder="Caption"></TextInput>
      <TextInput style={styles.input} value={input.imgUrl} onChangeText={(text) => handleChange('imgUrl', text)} placeholder="Image Url"></TextInput>
      <Button title="Add Post" onPress={handlePost}>
        Add your post
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});
