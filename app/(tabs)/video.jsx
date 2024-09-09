import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, RefreshControl, Share} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../../components/Header';
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPost from '../../components/ShimmerEffect';
import UploadVideo from '../pages/uoloadVideo';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false); 
  const dummyAvatar = 'https://via.placeholder.com/50';
  const videoRefs = useRef([]);

  const getAllPosts = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('auth');
      const token = tokenData ? JSON.parse(tokenData) : null;
      setUserId(token.userOTP._id);
      const response = await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/getAllVideoPosts', {
        params: {
          'userId': "66d5c7857540b88ed8227024"
        }
      });
      setPosts(response.data.posts);
      console.log(response.data.posts,"post data coming in every refresh")
      setLoading(false);
      setRefreshing(false); // Stop refreshing when data is fetched
    } catch (error) {
      console.error('Error occurred:', error);
      Alert.alert('Error', 'An error occurred while fetching the posts');
      setLoading(false);
      setRefreshing(false); // Stop refreshing on error
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

const refetchAllVideo= ()=>{
  setShowVideoUpload(false)
  getAllPosts();
}


  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentVideoIndex(index);
      videoRefs.current[index]?.playAsync();
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  const handleLike = async (postId, currentStatus) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return { ...post, likedByCurrentUser: !currentStatus, likesCount: currentStatus ? post.likesCount - 1 : post.likesCount + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);

    try {
      if (currentStatus) {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/unlike', { postId, userId });
      } else {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/like', { postId, userId });
      }
    } catch (error) {
      console.error('Error occurred while updating the like status:', error);
      Alert.alert('Error', 'An error occurred while updating the like status');
    }
  };

  const handleSave = async (postId, currentStatus) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return { ...post, savedByCurrentUser: !currentStatus, savedCount: currentStatus ? post.savedCount - 1 : post.savedCount + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);

    try {
      if (currentStatus) {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/unsavedPost', { postId, userId });
      } else {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/savedPost', { postId, userId });
      }
    } catch (error) {
      console.error('Error occurred while updating the save status:', error);
      Alert.alert('Error', 'An error occurred while updating the save status');
    }
  };

  const handleFollow = async (userToFollowId, isFollowing) => {
    const updatedPosts = posts.map(post => {
      if (post.postedBy._id === userToFollowId) {
        return { ...post, isFollowing: !isFollowing };
      }
      return post;
    });
    setPosts(updatedPosts);
  
    try {
      if (isFollowing) {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/followunfollow/unfollowUser', {
          userToFollowId: userToFollowId,
          currentUserId: userId
        });
      } else {
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/followunfollow/followUser', {
          userToFollowId: userToFollowId,
          currentUserId: userId
        });
      }
    } catch (error) {
      console.error('Error occurred while updating the follow status:', error);
      Alert.alert('Error', 'An error occurred while updating the follow status');
  
      const revertedPosts = posts.map(post => {
        if (post.postedBy._id === userToFollowId) {
          return { ...post, isFollowing: isFollowing };
        }
        return post;
      });
      setPosts(revertedPosts);
    }
  };


  const handleShare = async (postId, title, description, imageUrl) => {
    try {
      // Share the post with its image, title, and description
      const result = await Share.share({
        message: `${title}\n\n${description}\n\nImage: ${imageUrl}`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          console.log(postId, "postID from API")
          await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/shareCount', { 
            params:{
              postId:postId
            }
           });          
          const updatedPosts = posts.map(post => {
            if (post._id === postId) {
              return { ...post, shareCount: post.shareCount + 1 };
            }
            return post;
          });
          setPosts(updatedPosts);
  
          Alert.alert('Success', 'Post shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sharing the post');
      console.error('Error during sharing:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getAllPosts();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header headerTitle="Home" />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
          <ShimmerPost key={index} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header headerTitle="Video" />
      <TouchableOpacity style={{ zIndex: 1000 }} onPress={() => setShowVideoUpload(!showVideoUpload)}>
        <View style={styles.createVideoIcon}>
          <FontAwesome name={showVideoUpload ? "close" : "plus"} size={18} color="#000000" />
          <Text style={styles.createVideoPlus}>&nbsp;Upload Video</Text>
        </View>
      </TouchableOpacity>

      {showVideoUpload && <View style={styles.openVideoUploader}><UploadVideo videoUploaded={refetchAllVideo} /></View>}

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View key={item._id} style={styles.postContainer}>
            <View style={styles.postHeaderContainer}>
              <View style={styles.postHeader}>
                <Image source={{ uri: item.postedBy.profileImageURL || dummyAvatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{item.postedBy.name}</Text>
                  <Text style={styles.postDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              {item.postedBy._id !== "66d5c7857540b88ed8227024" ? (
                <TouchableOpacity onPress={() => handleFollow(item.postedBy._id, item.isFollowing)}>
                  <Text style={{ paddingRight: 20, fontWeight: "bold", color: "#50507c" }}>
                    {item.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              style={styles.video}
              source={{ uri: item.videoUrl }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              isLooping
              shouldPlay={currentVideoIndex === index}
            />
            <View style={styles.actionContainer}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => handleLike(item._id, item.likedByCurrentUser)} style={styles.iconContainer}>
                  <View style={styles.likeSave}>
                    <Text>{item.likesCount}&nbsp;</Text>
                    <FontAwesome
                      name={item.likedByCurrentUser ? "thumbs-up" : "thumbs-o-up"}
                      size={20}
                      color={item.likedByCurrentUser ? "#46466d" : "#8383af"}
                    />
                    <Text>&nbsp;Like</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSave(item._id, item.savedByCurrentUser)} style={styles.iconContainer}>
                  <View style={styles.likeSave}>
                    <Text>{item.savedCount}&nbsp;</Text>
                    <FontAwesome
                      name={item.savedByCurrentUser ? "bookmark" : "bookmark-o"}
                      size={20}
                      color={item.savedByCurrentUser ? "#9494b8" : "#8383af"}
                    />
                    <Text>&nbsp;Save</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleShare(item._id, item.title, item.description, item.videoUrl)} style={styles.iconContainer}>
                <FontAwesome name="share" size={20} color="#8383af" />
                <Text>&nbsp;Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};


export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  postContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    padding: 15,
    marginBottom:4
  },
  postHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    
  
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postDate: {
    color: '#666',
    fontSize: 12,
  },
  video: {
    width: '100%',
    height: 260,
    marginTop: 10,
    backgroundColor:"rgba(0,0,0,0.1)"
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    
  },
  leftActions: {
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeSave: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createVideoIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center",
    zIndex: 10,
    position:"absolute",
    bottom:10,
    right:55,
    zIndex:100,
    width:140,
    height:30,
    borderWidth:1,
    borderRadius:50,
    borderColor:"rgba(255,255,255,0.9)",
    backgroundColor:"rgba(255,255,255,0.7)"



  },
  createVideoPlus:{
    borderRadius:100,
    zIndex:100,

  },
  openVideoUploader:{
    position:"absolute",
    top:10,
    zIndex:100,
  }

});
