import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useRouter, useNavigation } from 'expo-router';
import axios from 'axios';

export default function Follower() {
  const [profileData, setProfileData] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [userID, setUserID] = useState(null);
  const [followersDetails, setFollowersDetails] = useState([]);
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

  useEffect(() => {
    if (profileData && profileData.followers.length > 0) {
      getFollowersDetails(profileData.followers);
    }
  }, [profileData]);

  const getUserProfile = async () => {
    try {
      const res = await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/userProfile', {
        params: {
          userID: userID
        }
      });
      setProfileData(res.data.user); 
    } catch (error) {
      console.log("Error while fetching the data", error);
    }
  };

  const getFollowersDetails = async (followerIds) => {
    try {
      const followerDetails = await Promise.all(
        followerIds.map(async (followerId) => {
          const res = await axios.get(`http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/userProfile`, {
            params: {
              userID: followerId
            }
          });
          return res.data.user; 
        })
      );
      setFollowersDetails(followerDetails);
    } catch (error) {
      console.log("Error while fetching follower details", error);
    }
  };

  const handleUnfollow = async (followerId) => {
    try {
      await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/followunfollow/unfollowUser', {
        "userToFollowId": userID,
        "currentUserId": followerId
      });
      
      setFollowersDetails(followersDetails.filter(follower => follower._id !== followerId));
    } catch (error) {
      console.log("Error while unfollowing", error);
    }
  };


  return (
    <View style={styles.container}>
      <Header headerTitle={profileData?.name} pushRoute="(tabs)/profile" />
      <View style={styles.profile}>
        {profileData ? (
          <View style={styles.profileContainer}>
            
            <Text style={styles.sectionTitle}>All {followersDetails.length} Followers</Text>
            <ScrollView style={styles.followersContainer}>
              {followersDetails.length > 0 ? (
                followersDetails?.map((follower) => (
                  <View key={follower._id} style={styles.followerItem}>
                    <Image
                      source={{ uri: follower.profileImageURL || 'https://via.placeholder.com/150' }}
                      style={styles.followerImage}
                    />
                    <Text style={styles.followerText}>{follower?.name}</Text>
                    {console.log(follower.name, "follwer name")}
                    <TouchableOpacity
                      style={styles.unfollowButton}
                      onPress={() => handleUnfollow(follower._id)}
                    >
                      <Text style={styles.unfollowButtonText}>Unfollow</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noFollowersText}>No followers yet.</Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
      <View>
  
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
  profile: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  profileContainer: {
    
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#8383af',
    textAlign:"center",
    backgroundColor:"rgba(255,255,255,0.4)",
    paddingVertical:6,
    width:160,
    borderRadius:50
  },
  followersContainer: {
    maxHeight: 1600,
    
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width:330,
    marginBottom: 10,
    backgroundColor:"rgba(255,255,255,0.2)",
    paddingVertical:7,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.3)",
    borderRadius:10

  },
  followerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  followerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  unfollowButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.2)"
  },
  unfollowButtonText: {
    color: '#992600',
    fontSize: 14,
  },
  noFollowersText: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});