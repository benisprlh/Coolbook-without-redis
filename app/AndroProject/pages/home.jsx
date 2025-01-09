import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CardPost from '../components/cardPost';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../context/loginContext';
import { useNavigation } from '@react-navigation/native';
// import Login from './login';
// import Register from './register';

// const Tab = createMaterialTopTabNavigator();

const GET_USER_LOGIN = gql`
  query Query {
    userId {
      _id
      name
      username
      email
      imgUrl
      userFollowers {
        _id
        followerId
        followingId
        createdAt
        updatedAt
      }
      userFollowersDetail {
        _id
        name
        username
      }
      userFollowing {
        _id
        followerId
        followingId
        createdAt
        updatedAt
      }
      userFollowingsDetail {
        _id
        name
        username
      }
    }
  }
`;

export const GET_POST = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
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
      createdAt
      updatedAt
      User {
        _id
        username
        name
        imgUrl
      }
    }
  }
`;

export default function Home({ navigation }) {
  const [post, setPost] = useState([]);
  const { userLogin, setUserLogin } = useContext(LoginContext);
  // const navigation = useNavigation();

  const { loading, error, data, refetch } = useQuery(GET_POST);
  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(GET_USER_LOGIN, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    console.log(dataUser);
    if (data) {
      setPost(data.posts);
    }
    if (dataUser) {
      setUserLogin(dataUser.userId);
    }
  }, [data, dataUser]);

  function handleAddPost() {
    navigation.navigate('AddPost');
  }

  return (
    <>
      <View style={{ padding: 10, flexDirection: 'row', backgroundColor: 'white' }}>
        <Image source={{ uri: userLogin?.imgUrl }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
        <TouchableOpacity onPress={handleAddPost} style={{ flex: 1 }}>
          <Text style={{ flex: 1, borderWidth: 0.4, borderRadius: 50, paddingTop: 10 }}> Add New Post....</Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator /> : <FlatList data={post} renderItem={({ item }) => <CardPost post={item} />} keyExtractor={(item, index) => index} ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>} />}
    </>
  );
}
