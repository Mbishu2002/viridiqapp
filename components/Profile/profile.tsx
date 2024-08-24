import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PROFILE_PICTURE = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function Profile() {
  const { user, setUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [userInfo, setUserInfo] = useState({
    first_name: user?.first_name || '',
    email: user?.email || '',
    profile_image: user?.profile_image || DEFAULT_PROFILE_PICTURE,
  });

  const handleSave = async () => {
    if (!token) {
      setMessage('You must be logged in to save changes.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', userInfo.first_name);
      formData.append('email', userInfo.email);

      // Append profile image if selected
      if (userInfo.profile_image !== DEFAULT_PROFILE_PICTURE) {
        formData.append('profile_image', {
          uri: userInfo.profile_image, 
          type: 'image/jpeg',
          name: 'profile_picture.jpg',
        });
      }

      const response = await axios.put(`${config.BASE_URL}/profile/update/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      setUser(response.data);
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
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
      setImageLoading(true);
      try {
        const formData = new FormData();
        formData.append('profile_image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile_picture.jpg',
        });

        await axios.post(`${config.BASE_URL}/profile/upload-image/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });

        setUserInfo({ ...userInfo, profile_image: result.assets[0].uri });
        setMessage('Profile picture updated successfully.');
      } catch (error) {
        setMessage('Failed to update profile picture.');
      } finally {
        setImageLoading(false);
      }
    } else {
      setMessage('You did not select an image.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Banner Image */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: userInfo.profile_image || DEFAULT_PROFILE_PICTURE }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        {!isEditing && (
          <TouchableOpacity style={styles.changePictureButton} onPress={handleImagePick}>
            {imageLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Details */}
      <View style={styles.profileInfo}>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.input}
              value={userInfo.first_name}
              onChangeText={(text) => setUserInfo({ ...userInfo, first_name: text })}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={userInfo.email}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              placeholder="Email"
              keyboardType="email-address"
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
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
