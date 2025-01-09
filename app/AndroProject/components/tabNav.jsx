import { StatusBar } from 'expo-status-bar';
import Login from '../pages/login';
import Register from '../pages/register';
import Home from '../pages/home';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './header';
import Search from '../pages/search';
import MyProfile from '../pages/myAccount';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigation() {
  return (
    <>
      <Header />
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search-sharp' : 'search-outline';
            } else if (route.name === 'MyProfile') {
              iconName = focused ? 'menu' : 'menu-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={17} color={'#4267B2'} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
        })}
      >
        {/* <Tab.Screen name="Login" component={Login} /> */}
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="MyProfile" component={MyProfile} />
      </Tab.Navigator>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
