import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PROFILE_PICTURE = 'https://example.com/default-profile-picture.png'; 

export default function Profile() {
  const { user, setUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || DEFAULT_PROFILE_PICTURE,
  });

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to save changes.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${config.BASE_URL}/profile/update/`, {
        name: userInfo.name,
        email: userInfo.email,
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      setUser(response.data.user); 
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, profilePicture: result.uri });
      // Optionally, you could upload the image to your server here
    } else {
      Alert.alert('Image Selection', 'You did not select an image.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Banner Image */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: userInfo.profilePicture || DEFAULT_PROFILE_PICTURE }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        {!isEditing && (
          <TouchableOpacity style={styles.changePictureButton} onPress={handleImagePick}>
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Details */}
      <View style={styles.profileInfo}>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.input}
              value={userInfo.name}
              onChangeText={(text) => setUserInfo({ ...userInfo, first_name: text })}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={userInfo.email}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              placeholder="Email"
            />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={[styles.actionIcon, styles.saveIcon]} onPress={handleSave}>
                {loading ? <ActivityIndicator color="#4caf50" /> : <MaterialIcons name="check" size={24} color="#4caf50" />}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIcon, styles.cancelIcon]} onPress={() => setIsEditing(false)}>
                <MaterialIcons name="cancel" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="person" size={20} color="#fff" />
              </View>
              <Text style={styles.infoText}>{userInfo.first_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="email" size={20} color="#fff" />
              </View>
              <Text style={styles.infoText}>{userInfo.email}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: 8,
  },
  changePictureButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: 8,
  },
  profileInfo: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveIcon: {
    backgroundColor: '#e8f5e9',
  },
  cancelIcon: {
    backgroundColor: '#ffebee',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
