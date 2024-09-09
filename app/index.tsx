import { Text, View } from "react-native";
import * as React from 'react';
import Login from './login'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Login />
    </View>
  );
}
