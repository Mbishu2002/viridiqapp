import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import config from '@/config/config';
import HealthDataCarousel from './data';
import { useAuth } from '../context/AuthContext';

type Request = {
  id: number;
  insurance_company: string; 
  timestamp: string;
  status: string;
};

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();

  // Fetch requests from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/data-requests/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`, // Include the authorization token
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await axios.patch(`${config.BASE_URL}/data-requests/${id}/status/`, { status }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, 
        },
      });
      setRequests(prevRequests =>
        prevRequests.filter(request => request.id !== id)
      );
      console.log(`Updated request with ID: ${id} to status: ${status}`);
    } catch (error) {
      console.error(`Error updating request with ID: ${id}`, error);
    }
  };

  const renderRequestItem = (item: Request) => {
    const formattedTimestamp = new Date(item.timestamp).toLocaleString();
    const dataRequestedMessage = `Data Request from ${item.insurance_company} received on ${formattedTimestamp}.`;

    return (
      <View key={item.id} style={styles.requestCard}>
        <View style={styles.requestDetails}>
          <Text style={styles.dataRequested}>{dataRequestedMessage}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleUpdateStatus(item.id, 'approved')}>
            <MaterialIcons name="check-circle" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleUpdateStatus(item.id, 'rejected')}>
            <MaterialIcons name="cancel" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.healthDataCard}>
        <HealthDataCarousel />
      </View>
      <View style={styles.requestsSection}>
        <Text style={styles.requestsTitle}>Data Access Requests</Text>
        {requests.length === 0 ? (
          <View style={styles.noRequestsContainer}>
            <MaterialIcons name="inbox" size={50} color="grey" style={styles.noRequestsIcon} />
            <Text style={styles.noRequestsText}>No Requests</Text>
          </View>
        ) : (
          <View style={styles.scrollContainer}>
            {requests.map(renderRequestItem)}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    padding: 16,
    backgroundColor: '#fff',
  },
  healthDataCard: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    height: 300, 
    width: '100%', 
  },
  requestsSection: {
    flex: 1,
  },
  requestsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noRequestsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noRequestsIcon: {
    marginBottom: 10,
  },
  noRequestsText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  requestCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestDetails: {
    flex: 1,
  },
  dataRequested: {
    fontSize: 14,
    color: '#333',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
