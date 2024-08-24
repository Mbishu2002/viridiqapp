import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../../types'; // Adjust import path as needed

// Define the route and navigation prop types
type ClaimDetailsRouteProp = RouteProp<RootStackParamList, 'ClaimDetails'>;
type ClaimDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ClaimDetails'>;

// Define the props for ClaimDetails component
type ClaimDetailsProps = {
  route: ClaimDetailsRouteProp;
  navigation: ClaimDetailsNavigationProp;
};

export default function ClaimDetails({ route, navigation }: ClaimDetailsProps) {
  const { plan } = route.params; // Extract plan from route params
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(''); // Add state for amount claimed
  const [files, setFiles] = useState<any[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { token } = useAuth();

  // Use effect to fetch claim details based on plan if needed
  useEffect(() => {
    // Mock fetching plan details; replace with actual fetching logic if required
    console.log('Fetched plan details:', plan);
  }, [plan]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setFiles(prevFiles => [...prevFiles, result]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleClaim = async () => {
    if (!description || !amount) {
      setSubmissionStatus('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('amount_claimed', amount);
    formData.append('plan', plan.id);
    files.forEach(file => {
      formData.append('documents', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    try {
      const response = await axios.post(`${config.BASE_URL}/claims/submit/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      // Clear form data after successful submission
      setDescription('');
      setAmount('');
      setFiles([]);
      setSubmissionStatus('Claim submitted successfully.');

      // Optionally, navigate to another screen or clear the page
      // navigation.navigate('SomeOtherScreen'); // Uncomment if needed

    } catch (error) {
      console.error('Error submitting claim:', error);
      setSubmissionStatus('Error submitting claim.');
    }
  };

  const renderFileItem = ({ item }: { item: any }) => {
    const fileType = item.name.split('.').pop();
    let iconName = 'document-text-outline';

    switch (fileType) {
      case 'pdf':
        iconName = 'file-pdf';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        iconName = 'image';
        break;
      case 'doc':
      case 'docx':
        iconName = 'file-word';
        break;
      default:
        iconName = 'document-text-outline';
        break;
    }

    return (
      <View style={styles.fileItem}>
        <Ionicons name={iconName} size={20} color="black" />
        <Text style={styles.fileName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Claim Details for Plan {plan.name}</Text>
      <Text style={styles.label}>Plan Description:</Text>
      <Text style={styles.description}>{plan.description}</Text>
      <Text style={styles.label}>Describe your claim:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter details about your claim..."
      />
      <Text style={styles.label}>Amount Claimed:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount claimed..."
      />
      <View style={styles.uploadContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
          <Ionicons name="cloud-upload-outline" size={16} color="black" />
          <Text style={styles.uploadButtonText}>Upload Supporting documents</Text>
        </TouchableOpacity>
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.uri}
          style={styles.fileList}
        />
      </View>
      <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
        <Text style={styles.claimButtonText}>Submit Claim</Text>
      </TouchableOpacity>
      {submissionStatus && (
        <Text style={[styles.statusMessage, { color: submissionStatus === 'Claim submitted successfully.' ? 'lightgreen' : 'red' }]}>
          {submissionStatus}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  uploadContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'black',
    fontSize: 12,
    marginLeft: 4,
  },
  fileList: {
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  claimButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    width: '80%',
    paddingHorizontal: 12,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  statusMessage: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
