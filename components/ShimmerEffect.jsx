import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const ShimmerPost = () => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeaderContainer}>
        <View style={styles.postHeader}>
          <ShimmerPlaceHolder style={styles.avatar} />
          <View>
            <ShimmerPlaceHolder style={styles.userNameShimmer} />
            <ShimmerPlaceHolder style={styles.postDateShimmer} />
          </View>
        </View>
        <ShimmerPlaceHolder style={styles.followShimmer} />
      </View>
      <ShimmerPlaceHolder style={styles.postTitleShimmer} />
      <ShimmerPlaceHolder style={styles.postDescriptionShimmer} />
      <ShimmerPlaceHolder style={styles.postImageShimmer} />
      <View style={styles.actionContainer}>
        <ShimmerPlaceHolder style={styles.actionShimmer} />
        <ShimmerPlaceHolder style={styles.actionShimmer} />
        <ShimmerPlaceHolder style={styles.actionShimmer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#d0d0e1',
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
  userNameShimmer: {
    width: 100,
    height: 20,
    borderRadius: 5,


  },
  postDateShimmer: {
    width: 80,
    height: 15,
    borderRadius: 5,
    marginTop: 5,

  },
  followShimmer: {
    width: 60,
    height: 20,
    borderRadius: 5,

  },
  postTitleShimmer: {
    width: '90%',
    height: 20,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 8,


  },
  postDescriptionShimmer: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,


  },
  postImageShimmer: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    backgroundColor: "grey",
    borderRadius: 5,


  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 6,

  },
  actionShimmer: {
    width: 60,
    height: 20,
    borderRadius: 5,


  },
});

export default ShimmerPost;
