import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useNavigation } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

export default function SavedPosts() {
  const [profileData, setProfileData] = useState(null);
  const [userID, setUserID] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const fetchUserData = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth');
        const token = tokenData ? JSON.parse(tokenData) : null;
        if (token && token.userOTP) {
          setProfileData(token.userOTP);
          setUserID(token.userOTP._id);
        }
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userID) {
      fetchLikedPosts();
    }
  }, [userID]);

  const fetchLikedPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/getAllUserLkedPost',
        {
          params: { userId: userID },
        }
      );
      console.log(res, "saved post");
      setSavedPosts(res.data);
    } catch (error) {
      console.error('Error while fetching saved posts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnLikedPost = async (postId) => {
    try {
      const res = await axios.post(
        'http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/unlike',
        { postId, userId: userID }
      );
      console.log('Server response:', res.data);
      Alert.alert('Success', 'Post unsaved successfully');
      fetchLikedPosts();
    } catch (error) {
      console.error('Error response from server:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to unsave the post');
    }
  };

  const renderPostItem = ({ item }) => {
    if (!item.post) {
      // Handle cases where the original post has been deleted
      return null;
    }

    return (
      <View style={styles.postContainer}>
        <Image source={{ uri: item.post.imageUrl }} style={styles.postImage} />
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.post.title}</Text>
          <Text style={styles.postDescription}>{item.post.description}</Text>
          <View style={styles.buttonContainer}>
            {console.log(item.post.postedBy, "id post")}
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={() => handleUnLikedPost(item.post._id)} // Pass the saved post ID here
            >
              <FontAwesome name="thumbs-o-down" size={18} color="#9292b9" />
              <Text style={styles.buttonText}>UnLike</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header headerTitle="Liked Posts" pushRoute="(tabs)/profile" />
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <Text style={styles.sectionTitle}>All Liked Posts ({savedPosts.length})</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9292b9" />
        </View>
      ) : (
        <FlatList
          data={savedPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saved posts available.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
  },
  listContent: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 6,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)"
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 15,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.9)"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  unsaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth:1,
    borderColor:"#e0e0eb"
  },
  buttonText: {
    color: '#9292b9',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#8383af',
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingVertical: 10,
    width: 160,
    borderRadius: 50
  }
});
