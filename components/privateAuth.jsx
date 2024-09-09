import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import TabLayout from '../(tabs)/TabLayout'; // Import your TabLayout component

export default function PrivateRoute() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth'); 
        const token = JSON.parse(tokenData)
        console.log(token, "authroute token")
        if (!token.token) {
          // If token does not exist, redirect to login
          router.replace('/login');
        } else {
          // Token exists, continue to the tab layout
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        router.replace('/login');
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // Show a loading indicator while checking the token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <TabLayout />; // Render the TabLayout if the token exists
}
