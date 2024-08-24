import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import config from '@/config/config'; 
import { useAuth } from '../context/AuthContext'; 
import Message from './Message'; 

type Plan = {
  id: string;
  plan_name: string;
  price: number;
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

const PlanDetails: React.FC<Props> = ({ route }) => {
  const { plan } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);

  const showMessage = (text: string) => {
    setMessage(text);
    setMessageVisible(true);
  };

  const handleSubscribe = async () => {
    if (!token) {
      showMessage('You must be logged in to subscribe.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.BASE_URL}/subscribe/`, { "plan_id": plan.id }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      showMessage(`Subscribed to ${plan.plan_name}`);
      // Update local state or refetch data as needed
    } catch (error) {
      showMessage('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!token) {
      showMessage('You must be logged in to unsubscribe.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.BASE_URL}/unsubscribe/`, { "plan_id": plan.id }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      showMessage(`Unsubscribed from ${plan.plan_name}`);
      // Update local state or refetch data as needed
    } catch (error) {
      showMessage('Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plan.plan_name}</Text>
      <Text style={styles.price}>£{plan.price} / month</Text>
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
      <Message message={message} visible={messageVisible} onHide={() => setMessageVisible(false)} />
    </View>
  );
};

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

export default PlanDetails;
