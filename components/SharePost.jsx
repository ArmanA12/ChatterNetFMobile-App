import Share from 'react-native-share';
import { View, Text, TouchableOpacity } from 'react-native';

const PostComponent = ({ post }) => {
  const handleFacebookShare = async () => {
    const shareOptions = {
      title: 'Share via',
      message: `Check out this post: ${post.content}`,
      url: post.url,
      social: Share.Social.FACEBOOK,
    };

    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error sharing on Facebook:', error);
    }
  };

  const handleWhatsAppShare = async () => {
    const shareOptions = {
      title: 'Share via',
      message: `Check out this post: ${post.content}`,
      url: post.url,
      social: Share.Social.WHATSAPP, 
    };

    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
    }
  };


  return (
    <View>
      <Text>{post.title}</Text>
      <Text>{post.content}</Text>
      <TouchableOpacity onPress={handleFacebookShare}>
        <Text>Share on Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleWhatsAppShare}>
        <Text>Share on WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};
