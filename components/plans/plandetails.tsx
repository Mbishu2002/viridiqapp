import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import config from '@/config/config'; 
import { useAuth } from '../context/AuthContext'; 

type Plan = {
  id: string;
  name: string;
  pricePerMonth: number;
  subscribed: boolean;
  description: string;
};

type RootStackParamList = {
  PlanDetails: { plan: Plan };
};

type PlanDetailsRouteProp = RouteProp<RootStackParamList, 'PlanDetails'>;
type PlanDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'PlanDetails'>;

type Props = {
  route: PlanDetailsRouteProp;
  navigation: PlanDetailsNavigationProp;
};

export default function PlanDetails({ route }: Props) {
  const { plan } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to subscribe.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.BASE_URL}/subscribe/`, {"plan_id" : plan.id}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      Alert.alert('Success', `Subscribed to ${plan.name}`);
      // Update local state or refetch data as needed
    } catch (error) {
      Alert.alert('Error', 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to unsubscribe.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.BASE_URL}/unsubscribe/`, {"plan_id": plan.id}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      Alert.alert('Success', `Unsubscribed from ${plan.name}`);
      // Update local state or refetch data as needed
    } catch (error) {
      Alert.alert('Error', 'Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plan.name}</Text>
      <Text style={styles.price}>${plan.pricePerMonth} / month</Text>
      <Text style={styles.description}>
        {plan.description}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : plan.subscribed ? (
        <TouchableOpacity style={styles.unsubscribeButton} onPress={handleUnsubscribe}>
          <Text style={styles.buttonText}>Unsubscribe</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.buttonText}>Subscribe Now</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  subscribeButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  unsubscribeButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
