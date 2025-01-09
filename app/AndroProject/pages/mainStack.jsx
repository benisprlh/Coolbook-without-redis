import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from '../components/tabNav';
import Login from './login';
import Register from './register';
import PostDetail from './postDetail';
import { StatusBar } from 'react-native';
import UserDetail from './userDetail';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { LoginContext } from '../context/loginContext';
import AddPost from './addPost';

const Stack = createStackNavigator();

export default function MainStack() {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#4267B2" />
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
            <Stack.Screen name="UserDetail" component={UserDetail} />
            <Stack.Screen name="AddPost" component={AddPost} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
