import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import config from '@/config/config';

type RootStackParamList = {
  ClaimDetails: { plan: Plan };
};

type Plan = {
  id: number; // BigAutoField is treated as number in the frontend
  plan_name: string;
  description: string;
};

type ClaimDetailsRouteProp = RouteProp<RootStackParamList, 'ClaimDetails'>;
type ClaimDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ClaimDetails'>;

type ClaimDetailsProps = {
  route: ClaimDetailsRouteProp;
  navigation: ClaimDetailsNavigationProp;
};

export default function ClaimDetails({ route, navigation }: ClaimDetailsProps) {
  const { plan } = route.params; // Extract plan from route params
  const [description, setDescription] = useState('');
  const [amountClaimed, setAmountClaimed] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { token } = useAuth();

  const handleClaim = async () => {
    // Validate that all fields are filled
    if (!description || !amountClaimed) {
      setSubmissionStatus('Please fill in all fields.');
      return;
    }

    // Prepare claim data for submission
    const claimData = {
      plan: plan.id,
      amount_claimed: amountClaimed,
      description, 
    };

    try {
      const response = await axios.post(`${config.BASE_URL}/claims/submit`, claimData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, 
        },
      });
      setSubmissionStatus('Claim submitted successfully.');
      // Optionally navigate to another screen after submission
      // navigation.navigate('SomeOtherScreen');
    } catch (error) {
      console.error('Error submitting claim:', error);
      setSubmissionStatus('Failed to submit claim. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Claim Details for Plan {plan.plan_name}</Text>
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
        value={amountClaimed}
        onChangeText={setAmountClaimed}
        placeholder="Enter amount claimed"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
        <Text style={styles.claimButtonText}>Submit Claim</Text>
      </TouchableOpacity>
      {submissionStatus && (
        <Text style={[styles.statusMessage, { color: submissionStatus.includes('successfully') ? 'lightgreen' : 'red' }]}>
          {submissionStatus}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
