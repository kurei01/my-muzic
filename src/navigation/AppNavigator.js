import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react'
import { View } from 'react-native';

const Tab = createBottomTabNavigator()

function NavHeader() {
  return <View tw="p-5 bg-indigo-950"></View>;
}

const AppNavigator = ({}) => {
  return (
  <Tab.Navigator screenOptions={{header: NavHeader}}>
    <Tab.Screen
      name='AudioList'
      component={AudioList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name='headset' size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name='Player'
      component={Player}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name='compact-disc' size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name='PlayList'
      component={PlayList}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name='library-music' size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
  )
}

export default AppNavigator