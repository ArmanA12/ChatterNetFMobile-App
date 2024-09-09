import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Header({ headerTitle, pushRoute }) {
  const router = useRouter();

  const handleBack = () => {
    if (pushRoute) {
      console.log(pushRoute, "push route")
      router.replace(pushRoute);
    } else {
      try {
        console.log("back called")
        // router.back();
        router.replace(pushRoute);

      } catch (error) {
        console.warn("GO_BACK not handled, navigating to default screen.");
        router.push('(tabs)/home'); // Fallback route
      }
    }
  };


  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}><FontAwesome name="arrow-left" size={15} color="black" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}><FontAwesome name="sign-out" size={24} color="black" /></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:34,
    paddingBottom:8,
    paddingHorizontal:13,
    backgroundColor: '#e0e0eb',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {

    marginRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
