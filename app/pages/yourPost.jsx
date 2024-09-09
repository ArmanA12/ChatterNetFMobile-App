import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useNavigation } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

export default function YourPost() {
  const [profileData, setProfileData] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const checkToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth');
        const token = tokenData ? JSON.parse(tokenData) : null;
        if (token && token.userOTP) {
          setProfileData(token.userOTP);
          setUserID(token.userOTP._id);
        }
      } catch (error) {
        console.error("Error retrieving token from AsyncStorage", error);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (userID) {
      getUserProfile();
    }
  }, [userID]);

  const getUserProfile = async () => {
    console.log(userID, "userID");
    try {
      const res = await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/getPostsByUser', {
        params: { "userId": userID }
      });
      console.log(res.data, "userAllPOST");
      setUserPosts(res.data); 
      
    } catch (error) {
      console.log("Error while fetching the data", error);
    }
  };

  const handleEditPost = (postId) => {
    console.log("Editing post with ID:", postId);
  };

  const handleDeletePost = async (postId) => {
    const updatedPosts = userPosts.filter(post => post._id !== postId);
    setUserPosts(updatedPosts);
  
    try {
      await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/deleteUserPost', {
        params: { "postId": postId }
      });
      
      console.log(`Post with ID: ${postId} deleted successfully`);
      
    } catch (error) {
      setUserPosts([...updatedPosts, userPosts.find(post => post._id === postId)]);
    }
  };
  
  const renderPostItem = ({ item }) => (

    <View style={styles.postContainer}>

      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditPost(item._id)}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6}}>
          <FontAwesome name="edit" size={18} color="green" />
            <Text style={{color:"green"}}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(item._id)}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6}}>
            <FontAwesome name="trash-o" size={18} color="red" /> 
            <Text style={{color:"red"}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={profileData?.name} pushRoute="(tabs)/profile" />
      <View style={{paddingHorizontal:16, paddingVertical:10}}><Text style={styles.sectionTitle}>All Post {userPosts?.length} </Text></View>
      <ScrollView style={styles.profile}>
        {userPosts.length > 0 ? (
          <FlatList
            data={userPosts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
    paddingTop: 7,
  },
  profile: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  postContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    marginBottom: 15,
    padding: 1,
    shadowColor: '#000',
    
    
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopRightRadius:5,
    borderTopLeftRadius:5,

    marginBottom: 10,
  },
  postContent: {
    flexDirection: 'column',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    paddingHorizontal:6
  },
  postDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    paddingHorizontal:6

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:7,
    paddingVertical:8
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    color:"#4CAF50",
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.5)"
  },
  deleteButton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.6)"

  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  sectionTitle:{
    paddingVertical:10,
    paddingHorizontal:16,
    backgroundColor:"rgba(255,255,255,0.3)",
    width:140,
    textAlign:"center",
    borderRadius:50
  }
});
