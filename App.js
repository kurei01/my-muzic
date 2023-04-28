import React from 'react';
import { withExpoSnack } from 'nativewind';
import 'react-native-gesture-handler';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AudioProvider from './src/context/AudioProvider';
import color from './src/misc/color';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

const App = () => {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigator/>
      </NavigationContainer>
    </AudioProvider>
  );
}

// This demo is using a external compiler that will only work in Expo Snacks.
// You may see flashes of unstyled content, this will not occur under normal use!
// Please see the documentation to setup your application
export default withExpoSnack(App);