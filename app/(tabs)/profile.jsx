import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import ProfileImageUpload from '../../userProfile/uploadUserProfile';
import axios from 'axios';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [userID, setUserID] = useState(null);
  const router   = useRouter();

  useEffect(() => {
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
    try {
      const res = await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/auth/userProfile', {
        params: {
          userID: userID
        }
      });
      console.log(res.data, "user profile res");
      setProfileData(res.data.user); 
    } catch (error) {
      console.log("Error while fetching the data", error);
    }
  };

  const handleProfileUpdate = () => {
    getUserProfile();
  };


  const handleImageSelected = (imageUri) => {
    console.log('Selected Image URI:', imageUri);
    setShowImageUpload(false);
  };

  return (
    
    <View style={styles.container}>
      <Header headerTitle="Profile" />

      <View style={styles.profile}>
        {profileData ? (
          <View style={styles.profileContainer}>
            {showImageUpload ? (
              <TouchableOpacity onPress={() => setShowImageUpload(!showImageUpload)}>
                <FontAwesome style={styles.closeIcon} name="close" size={24} color="#8383af" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowImageUpload(!showImageUpload)}>
                <FontAwesome name="camera" size={24} color="#8383af" />
              </TouchableOpacity>
            )}
            <View style={styles.profileimage}>
              <View style={styles.circle}>
                {profileData.profileImageURL ? (
                  <Image 
                    source={{ uri: profileData.profileImageURL }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <FontAwesome name="user-circle-o" size={120} color="#efeff5" />
                )}
              </View>
              
            </View>
           
            <View style={styles.personalEdit}>
              <Text style={{ fontSize: 19 }}>Personal Information</Text>
              <Text style={{ color: "#002b80" }}>
                <FontAwesome name="edit" size={18} color="#002b80" />&nbsp;Edit
              </Text>
            </View>

           <View style={{borderRadius:6, backgroundColor:"rgba(255,255,255,0.2)"}}>
           <Text style={styles.profileText}><FontAwesome name="user-o" size={20} color="#8383af" />&nbsp;&nbsp;{profileData.name}</Text>
            <Text style={styles.profileText}><FontAwesome name="envelope-o" size={20} color="#8383af" />&nbsp;&nbsp;{profileData.email}</Text>
            <Text style={styles.profileText}><FontAwesome name="location-arrow" size={20} color="#8383af" />&nbsp;&nbsp;{profileData.location || 'Not Added?'}</Text>
           
           </View>
           <Text style={{ fontSize: 19, marginTop: 20 }}>Social</Text>

           <View style={styles.personalEdit}>
              <View>
                
                <TouchableOpacity onPress={()=> router.replace('pages/following')}>
                <View style={styles.followCount}>
                <View style={{flexDirection:"row", gap:5, alignItems:"center",justifyContent:"center"}}>
                <Text style={{ textAlign: "center" }}><FontAwesome name="user-plus" size={17} color="#8383af" /></Text>
                <Text style={{ fontSize: 15 }}>Following</Text>
                </View>
                <Text style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}>{profileData.following.length}</Text>
              </View>
                </TouchableOpacity>
              
              </View>
              <TouchableOpacity onPress={()=> router.replace('pages/followers')}>
              <View style={styles.followCount}>
                <View style={{flexDirection:"row", gap:5, alignItems:"center",justifyContent:"center"}}>
                <Text style={{ textAlign: "center" }}><FontAwesome name="user-plus" size={17} color="#8383af" /></Text>
                <Text style={{ fontSize: 15 }}>Follower</Text>
                </View>
                <Text style={{ textAlign: "center", fontSize: 16, marginTop: 5 }}>{profileData.followers.length}</Text>
              </View>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 19, marginTop: 15 }}>Utilities</Text>
            <View style={styles.personalEdit}>
              <TouchableOpacity onPress={()=> router.replace('pages/yourPost')}>
              <View style={styles.postinformation}>
                <Text style={{ textAlign: "center" }}><FontAwesome name="cloud-upload" size={30} color="#8383af" /></Text>
                <Text style={{ fontSize: 15 }}>Your Post</Text>
              </View>
              </TouchableOpacity>
             
              <TouchableOpacity onPress={()=> router.replace('pages/userAllSavedPost')}>
              <View style={styles.postinformation}>
                <Text style={{ textAlign: "center" }}><FontAwesome name="heart" size={30} color="#8383af" /></Text>
                <Text style={{ fontSize: 15 }}>Saved Post</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> router.replace('pages/userAllLikedPost')}>
              <View style={styles.postinformation}>
                <Text style={{ textAlign: "center" }}><FontAwesome name="bookmark" size={30} color="#8383af" /></Text>
                <Text style={{ fontSize: 15 }}>Liked Post</Text>
              </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
      {showImageUpload && (
        <ProfileImageUpload  onProfileUpdate={handleProfileUpdate} />
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
    paddingTop: 7,
  },
  profileContainer: {
    borderRadius: 10,
  },
  profileText: {
    color: '#1f1f2e',
    backgroundColor: 'rgba(255,255,255,0.1)',
    fontSize: 18,
    marginBottom: 3,
    paddingVertical: 16,
    paddingHorizontal: 13,
    
  },
  postinformation: {
    color: '#1f1f2e',
    backgroundColor: 'rgba(255,255,255,0.4)',
    fontSize: 18,
    marginBottom: 2,
    marginTop: 2,
    paddingVertical: 16,
    paddingHorizontal: 13,
    borderRadius: 10,
    shadowColor: "rgba(255,255,255,0.4)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 4,
    elevation: 2,
  },
  followCount:{
    flexDirection: 'row',
    gap:20,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"rgba(255,255,255,0.3)",
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:6
  },
  closeIcon: {
    width: 50,
    textAlign: "center",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  loadingText: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  personalEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 1,
    
  },
  profileimage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 1,
  },
  circle: {
    backgroundColor: "#e0e0eb",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#efeff5",
    shadowColor: "#9393bc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
