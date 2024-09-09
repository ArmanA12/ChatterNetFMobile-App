import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { useRouter, Link, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Loader from '../components/Loader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); 
  const router = useRouter();
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });


  // Handle OTP change
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      refArray[index + 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join(''); 

    if (otpCode.length !== 6) {
      ToastAndroid.show("Please enter a 6-digit OTP", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/verifyOTP', {
        otp: otpCode,
      });

      ToastAndroid.show('OTP Verified Successfully 🎉', ToastAndroid.SHORT);
      await AsyncStorage.setItem('auth',JSON.stringify(response.data));
      const jsonValue = await AsyncStorage.getItem('auth');
      console.log(jsonValue,"vlue stoted")
        
  
      setTimeout(() => {
        router.replace('(tabs)/home');
      }, 1000);
    } catch (error) {
      ToastAndroid.show(error.response?.data?.message || "OTP Verification Failed", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const response = await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/resendOTP'); // Resend OTP API

      ToastAndroid.show('OTP Resent Successfully 🎉', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.response?.data?.message || "Failed to resend OTP", ToastAndroid.SHORT);
    } finally {
      setResendLoading(false);
    }
  };

  // Ref array to handle focus
  const refArray = [];

  return (

    <LinearGradient  
    colors={['#e1e1ea', '#f2d9f2', '#ebebe0']}
    style={styles.container}
       >

    <View style={styles.container}>
      <Text style={styles.title}>
        Check Your Email <Text style={{ color: "gold", fontSize: 30 }}>*</Text>
      </Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit verification code to your email ID
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            ref={(input) => refArray[index] = input} 
          />
        ))}
      </View>

      <View style={{paddingHorizontal:20}}>
        <LinearGradient
          style={{ borderRadius: 10 }}
          colors={['#800033', '#660066']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
            {loading ? <Loader /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={resendLoading}>
          {resendLoading ? <Loader /> : <Text style={styles.resendButtonText}><Text style={styles.loginText}>Didn't receive the email?</Text> Click to Resend </Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.loginText}>
        <Link style={{ color: "black" }} href="/login"><FontAwesome name="arrow-left" size={14} color="black" />&nbsp; Back to Login Page? </Link>
      </Text>

    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 1,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'black',
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  button: {
    width: 300,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -15,
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'black',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loginText: {
    color: "grey",
    textAlign: "center",
    fontSize: 16,
    paddingLeft: 20,
    marginTop: 20,
  },
});
