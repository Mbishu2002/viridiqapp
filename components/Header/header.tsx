import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawer from './Drawer'; 
import Logo from '@/assets/images/logo.png';

const Header = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation<SettingsNavigationProp>();

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton} onPress={toggleDrawer}>
        <MaterialIcons name="menu" size={28} color="green" />
      </TouchableOpacity>
      
      <Image 
        source={Logo} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.emptySpace} />

      {/* Drawer Component */}
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 150, 
    height: 150, 
  },
  iconButton: {
    padding: 8,
  },
  emptySpace: {
    width: 24,
  },
});

export default Header;
