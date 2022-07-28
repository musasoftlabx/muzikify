import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useColorScheme} from 'react-native';

import MainStack from './pages/MainStack';
import NowPlaying from './pages/NowPlaying';
import AddToPlaylist from './pages/AddToPlaylist';
import ContextProvider from './contexts';

const Stack = createNativeStackNavigator();

const App = () => {
  const scheme = useColorScheme();

  return (
    <ContextProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="MainStack"
              component={MainStack}
              options={{headerShown: false}}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen
              name="NowPlaying"
              component={NowPlaying}
              options={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'vertical',
              }}
            />
            <Stack.Screen
              name="AddToPlaylist"
              component={AddToPlaylist}
              options={{
                title: 'Add to playlist',
                headerTransparent: true,
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
