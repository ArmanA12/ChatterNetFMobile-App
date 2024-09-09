import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: '#800033',
        tabBarStyle: {
          backgroundColor: '#f0f0f5', // Set the background color here
          paddingTop:5,
          paddingBottom:5,
          height:55
        },
      }}
>
      <Tabs.Screen
        name="home"
        options={{
            headerShown:false,
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
            headerShown:false,
          title: 'Post',
          tabBarIcon: ({ color }) => <FontAwesome name="plus-square-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          headerShown:false,
          title: 'Video',
          tabBarIcon: ({ color }) => <FontAwesome name="tv" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown:false,
          title: 'Profile',
          tabBarIcon: ({ color }) =><FontAwesome name="user-o" size={24} color={color} />,
        }}
      />

    </Tabs>
    
  );
}
