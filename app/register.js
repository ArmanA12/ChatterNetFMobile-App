import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import { Link, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Loader from '../components/Loader';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });



  const handleRegister = async () => {
    if (!name || !email || !password) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/register', {
        name: name,
        email: email,
        password: password
      });

      ToastAndroid.show('You have successfully registered 🎉', ToastAndroid.SHORT);
      setTimeout(() => {
        router.replace('/login')
      }, 2000);
    } catch (error) {
      ToastAndroid.show(error.response?.data?.message || "Registration failed", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (

    <LinearGradient  
    colors={['#e1e1ea', '#f2d9f2', '#ebebe0']}
    style={styles.container}
       >

    <View >
      <Text style={styles.title}>
        Create an account <Text style={{ color: "gold", fontSize: 30 }}>*</Text>
      </Text>
      <Text style={styles.subtitle}>
        Welcome! Please enter your details
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

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
          value={password}
          onChangeText={setPassword}
        />

        <LinearGradient
          style={{ borderRadius: 10 }}
          colors={['#800033', '#660066']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <Loader /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.loginText}>
          Already have an account? <Link style={{ color: "black" }} href="/login">Login</Link>
        </Text>
      </View>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
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
    color: 'black',
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
  
});
