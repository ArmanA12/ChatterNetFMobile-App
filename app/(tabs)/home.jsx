import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../../components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPost from '../../components/ShimmerEffect'

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setuserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const dummyAvatar = 'https://via.placeholder.com/50'; 

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('auth');
        const token = tokenData ? JSON.parse(tokenData) : null;
        setuserId(token.userOTP._id);
        if(userId){
          const response = await axios.get('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/post/getAllPosts', {
            params: {
              'userId': userId
            }
          });
          
          setPosts(response.data.posts);
          setLoading(false); // Set loading to false after data is fetched
  
        }
      } catch (error) {
        console.error('Error occurred:', error);
        Alert.alert('Error', 'An error occurred while fetching the posts');
      }
    };
    getAllPosts();
  }, [userId]);

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
        console.log("like mathod called")
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
        return { ...post,  savedByCurrentUser: !currentStatus,
          savedCount: currentStatus ? post.savedCount - 1 : post.savedCount + 1
   };
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
        // Unfollow the user
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/followunfollow/unfollowUser', {
          userToFollowId: userToFollowId,
          currentUserId: userId
        });
      } else {
        // Follow the user
        await axios.post('http://chatternet-env.eba-3pqbyabw.ap-south-1.elasticbeanstalk.com/api/v1/followunfollow/followUser', {
          userToFollowId: userToFollowId,
          currentUserId: userId
        });
      }
    } catch (error) {
      console.error('Error occurred while updating the follow status:', error);
      Alert.alert('Error', 'An error occurred while updating the follow status');
  
      // Revert the optimistic update in case of error
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
  

  if (loading) {
    return (
      <View style={styles.container}>
        <Header headerTitle="Home" />
        <ScrollView>
          {[1, 2, 3, 4,5,6,7,8,9,10].map((_, index) => (
            <ShimmerPost key={index} />
          ))}
        </ScrollView>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Header headerTitle="Home" />
      <ScrollView>
        {posts.map((post) => (
          <View key={post._id} style={styles.postContainer}>
            <View style={styles.postHeaderContainer}>
              <View style={styles.postHeader}>
              <Image 
               source={{ uri: post.postedBy.profileImageURL || dummyAvatar }} 
               style={styles.avatar} 
               />
                <View>
                  <Text style={styles.userName}>{post.postedBy.name}</Text>
                  <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              {
  post.postedBy._id !== userId ? (
    <TouchableOpacity onPress={() => handleFollow(post.postedBy._id, post.isFollowing)}>
      <Text style={{ paddingRight: 20, fontWeight: "bold", color: "#50507c" }}>
        {post.isFollowing ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  ) : null
}

            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postDescription}>{post.description}</Text>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <View style={styles.actionContainer}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => handleLike(post._id, post.likedByCurrentUser)} style={styles.iconContainer}>
                  <View style={styles.likeSave}>
                    <Text>{post.likesCount}</Text>
                    <FontAwesome
                      name={post.likedByCurrentUser ? "thumbs-up" : "thumbs-o-up"}
                      size={20}
                      color={post.likedByCurrentUser ? "#46466d" : "#8383af"}
                    />
                    <Text>Like</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSave(post._id, post.savedByCurrentUser)} style={styles.iconContainer}>
                  <View style={styles.likeSave}>
                  <Text>{post.savedCount}</Text>
                    <FontAwesome
                      name={post.savedByCurrentUser ? "bookmark" : "bookmark-o"}
                      size={20}
                      color={post.savedByCurrentUser ? "#9494b8" : "#8383af"}
                    />
                    <Text>Save</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleShare(post._id, post.title, post.description, post.imageUrl)} style={styles.iconContainer}>
                <View style={styles.likeSave}>
                {post.shareCount > 0 ? <Text>{post.shareCount}</Text> : ""}
                  <FontAwesome name="share" size={20} color="#8383af" />
                  <Text> Share</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
  },
  postContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    margin: 3,
    padding: 1,
  },
  postHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f1f2e',
  },
  postDate: {
    fontSize: 14,
    color: '#8383af',
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 5,
    paddingHorizontal: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#1f1f2e',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    backgroundColor:"grey"
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  leftActions: {
    flexDirection: 'row',
  },
  iconContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  likeSave: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 4,
  },
});

export default Home;
