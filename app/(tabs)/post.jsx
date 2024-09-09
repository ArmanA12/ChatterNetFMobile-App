import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Post() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState(null);

  const router = useRouter();

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

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth');
        const token = tokenData ? JSON.parse(tokenData) : null;

        if (token && token.userOTP && token.userOTP._id) {
          setUserID(token.userOTP._id);
        } else {
          console.log("Token data or userID is missing");
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !image) {
      Alert.alert('Missing Fields', 'Please fill all fields and select an image');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userID', userID);
    formData.append('image', {
      uri: image,
      name: 'upload.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Post uploaded successfully');
        setTitle(''); // Clear title
        setDescription(''); // Clear description
        setImage(null); // Clear image
        router.replace('/(tabs)/home');
      } else {
        console.error('Error response:', data);
        Alert.alert('Upload Failed', 'Failed to upload post: ' + data.message);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      Alert.alert('Error', 'An error occurred while uploading the post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header headerTitle="Post" />
      <View style={styles.inputContainer}>
        <Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 12, fontWeight: "bold", marginTop: 30 }}>Create New Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.inputsecond}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View>
              <Text style={{ textAlign: "center" }}><FontAwesome name="cloud-upload" size={74} color="#8383af" /></Text>
              <Text>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <LinearGradient
          style={{ borderRadius: 10 }}
          colors={['#800033', '#660066']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <Loader /> : <Text style={styles.buttonText}> <FontAwesome name="plus" size={18} color="white" />&nbsp; Create Post</Text>}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
    paddingTop: 7,
  },
  inputContainer: {
    margin: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  inputsecond: {
    height: 100,
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  imagePicker: {
    height: 200,
    backgroundColor: '#efeff5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f4f4f4"
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
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
});
