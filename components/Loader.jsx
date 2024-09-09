import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import React from 'react'

export default function Loader() {
  return (
    <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#ffffff" />
    <Text style={styles.loadingText}>Submiting...</Text>
  </View>

  )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      loadingText: {
        color: '#ffffff',
        marginLeft: 10,
      },
})