import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardProfile from '../components/cardProfile';
import { gql, useQuery } from '@apollo/client';

const SEARCH_USER_BY_NAME = gql`
  query UserId($name: String) {
    userByName(name: $name) {
      _id
      name
      username
      email
      imgUrl
    }
  }
`;

export default function Search() {
  const [user, setUser] = useState([]);
  const [input, setInput] = useState('');

  const { error, loading, data } = useQuery(SEARCH_USER_BY_NAME, {
    variables: {
      name: input,
    },
  });

  function handleInput(text) {
    setInput(text);
  }

  function handleSearch() {
    if (data) {
      if (data.userByName) {
        setUser([data?.userByName]);
      }
    } else {
      setUser([]);
    }
  }

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <TextInput style={styles.input} placeholder="Search......" onChangeText={(text) => handleInput(text)}></TextInput>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          {/* <Text>Search</Text> */}
          <Ionicons name={'search-sharp'} size={17} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <View>
        {user.length === 0 ? <Text></Text> : <FlatList data={user} renderItem={({ item }) => <CardProfile user={item} />} keyExtractor={(item, index) => index} ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>} />}
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
