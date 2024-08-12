import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PaymentSettingsScreenNavigationProp } from '../../types'; 
import { useAuth } from '../context/AuthContext'; 

const SettingsPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation<PaymentSettingsScreenNavigationProp>(); // Use navigation hook
  const { logout } = useAuth(); // Get the logout function from context

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            // Navigate to login screen or handle post-logout logic here
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language */}
      <TouchableOpacity style={styles.item} onPress={() => console.log('Language')}>
        <View style={styles.iconContainer}>
          <Ionicons name="language-outline" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Language</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
      </TouchableOpacity>

      {/* Payment Settings */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PaymentSettings')}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="payment" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Payment Settings</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity style={styles.item} onPress={() => console.log('Notifications')}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="notifications-none" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Notifications</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
      </TouchableOpacity>

      {/* Help */}
      <TouchableOpacity style={styles.item} onPress={() => console.log('Help')}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="help-outline" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Help</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
      </TouchableOpacity>

      {/* Give Feedback */}
      <TouchableOpacity style={styles.item} onPress={() => console.log('Give Feedback')}>
        <View style={styles.iconContainer}>
          <Ionicons name="chatbox-outline" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Give Feedback</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
      </TouchableOpacity>

      {/* Dark Mode */}
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <Ionicons name="moon-outline" size={24} color="gray" />
        </View>
        <Text style={styles.itemText}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="logout" size={24} color="red" />
        </View>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 10,
    flex: 1,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 32,
  },
  logoutText: {
    fontSize: 18,
    color: 'red',
    marginLeft: 8,
  },
});

export default SettingsPage;
