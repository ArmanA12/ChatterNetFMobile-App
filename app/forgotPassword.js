import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import { Link, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

export default function forgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added confirm password state
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth'); 
        console.log(tokenData, "tokendata");
        const token = tokenData ? JSON.parse(tokenData) : null;
        console.log(token, "authroute token");

        if (token?.token) {
          router.replace('(tabs)/home');
       }
      } catch (error) {
        console.error('Error fetching the token:', error);
        router.replace('/login');
      }
    };

    checkToken();
  }, [router]);

  const handleRegister = async () => {
    console.log(email, newPassword, confirmPassword);

    if (!email || !newPassword || !confirmPassword) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    if (newPassword !== confirmPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/forgotPassword', {
        email: email,
        newPassword: newPassword,
        confirmPassword:confirmPassword
      });

      ToastAndroid.show('You have successfully logged in 🎉', ToastAndroid.SHORT);
      setTimeout(() => {
        router.replace('/login');
      }, 1000);
    } catch (error) {
      ToastAndroid.show(error.response?.data?.message || "Login failed", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient  
      colors={['#e1e1ea', '#f2d9f2', '#ebebe0']}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Forgot your account Password <Text style={{ color: "gold", fontSize: 30 }}>*</Text>
        </Text>
        <Text style={styles.subtitle}>
          Welcome! Please enter your details
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setPassword}
          />

          {/* Added Confirm Password field */}
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#888"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* <View style={styles.forgotPassword}>
            <Link href="/forgotPassword" style={{ fontWeight: 600, color: "#7575a3" }}>Forgot Password?</Link>
          </View> */}
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={['#800033', '#660066']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? <Loader /> : <Text style={styles.buttonText}>Forgot Password</Text>}
            </TouchableOpacity>
          </LinearGradient>

          <Text style={styles.loginText}>
            Don't have an account? <Link style={{ color: "black" }} href="/register">Create</Link>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#5c5c8a',
    fontSize: 26,
    paddingLeft: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: "grey",
    fontSize: 16,
    paddingLeft: 20,
    marginBottom: 20,
  },
  form: {
    padding: 20,
    borderRadius: 8,
  },
  label: {
    color: '#5c5c8a',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: "grey",
    fontSize: 16,
    paddingLeft: 20,
    marginTop: 20,
  },
  forgotPassword: {
    position: "relative",
    right: -200,
    marginBottom: 15,
  }
});
