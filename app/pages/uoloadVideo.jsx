import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UploadVideo({videoUploaded}) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState(null);

  const router = useRouter();

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera and gallery permissions to make this work!');
      return;
    }

    Alert.alert(
      'Select Video',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              setVideo(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              setVideo(result.assets[0].uri);
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
    if (!video) {
      Alert.alert('Missing Video', 'Please select a video');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', "videoTitile");
    formData.append('description', "videoDescription");
    formData.append('userID', userID);
    formData.append('video', {
      uri: video,
      name: 'upload.mp4',
      type: 'video/mp4',
    });

    try {
      const response = await fetch('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/uploadVideoPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Video uploaded successfully');
        setVideo(null); // Clear video
        videoUploaded();
      } else {
        console.error('Error response:', data);
        Alert.alert('Upload Failed', 'Failed to upload video: ' + data.message);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      Alert.alert('Error', 'An error occurred while uploading the video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload New Video</Text>
        <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
          {video ? (
            <Image source={{ uri: video }} style={styles.videoPreview} />
          ) : (
            <View style={styles.placeholder}>
              <FontAwesome name="cloud-upload" size={74} color="#8383af" />
              <Text style={styles.placeholderText}>Select Video</Text>
            </View>
          )}
        </TouchableOpacity>

        <LinearGradient
          style={styles.gradientButton}
          colors={['#800033', '#660066']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <Loader /> : <Text style={styles.buttonText}><FontAwesome name="plus" size={18} color="white" /> Upload Video</Text>}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e0e0eb',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 1,
    marginTop:180,
    backgroundColor:"transparent"
  },
  container: {
    width: width * 0.9,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#f3f4f4',
  },
  videoPicker: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.5)"
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    color: '#8383af',
    fontSize: 16,
  },
  gradientButton: {
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
