import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SettingsNavigationProp } from '../../types'; // Adjust import path as needed

type CustomDrawerProps = {
  isVisible: boolean;
  onClose: () => void;
  navigation: SettingsNavigationProp; // Use the SettingsNavigationProp type here
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isVisible, onClose, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen to the left

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : -300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent={true}
      animationType="none" // Disable default animation
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={styles.drawerContent}>
          <ScrollView>
            {/* List of companies or menu items */}
            {['Company A', 'Company B', 'Company C'].map((name, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerItem}
                onPress={() => console.log(`Selected ${name}`)}
              >
                <Text style={styles.drawerItemText}>{name}</Text>
              </TouchableOpacity>
            ))}

            {/* Other menu items */}
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={24} color="gren" />
              <Text style={styles.drawerItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => console.log('Add new company')}
            >
              <Ionicons name="add-circle" size={24} color="#333" />
              <Text style={styles.drawerItemText}>Add New Company</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 8,
  },
});

export default CustomDrawer;
