import React from 'react';
import {Button, View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Library from './Library';

const Stack = createNativeStackNavigator();

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Library">
      <Stack.Screen
        name="Library"
        component={Library}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
