// components/Message.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface MessageProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

const Message: React.FC<MessageProps> = ({ message, visible, onHide }) => {
  const [show, setShow] = React.useState(visible);
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShow(false));
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Message;
