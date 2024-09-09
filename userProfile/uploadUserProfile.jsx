import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileImageUpload({ onProfileUpdate }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth');
        const token = tokenData ? JSON.parse(tokenData) : null;
        if (token && token.userOTP && token.userOTP._id) {
          setUserID(token.userOTP._id);
        } else {
          console.log('Token data or userID is missing');
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera and gallery permissions to make this work!');
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('No image selected', 'Please select an image to upload');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('image', {
      uri: image,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile image uploaded successfully');
        setImage(response.data.imageUrl);
        onProfileUpdate();
      } else {
        Alert.alert('Upload Failed', 'Failed to upload profile image: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      Alert.alert('Error', 'An error occurred while uploading the profile image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#d1d1e0', '#f0c2e0']} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.iconContainer}>
              <FontAwesome name="user-circle" size={64} color="#ccc" />
              <Text style={styles.placeholderText}>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpload} style={styles.uploadButton} disabled={loading}>
          {loading ? <Loader /> : (
            <>
              <FontAwesome name="cloud-upload" size={25} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#800033',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    top: 50,
    position: "absolute",
    color: '#8383af',
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 19,
  },
});
