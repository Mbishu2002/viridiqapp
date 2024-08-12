import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HealthDataCarousel from './data';

type Request = {
  id: string;
  company: string;
  requestDate: string;
  dataRequested: string;
};

const initialRequestsData: Request[] = [
  { id: '1', company: 'AXA', requestDate: '2024-08-01', dataRequested: 'Heart Data' },
  { id: '2', company: 'Allianz', requestDate: '2024-08-02', dataRequested: 'Blood Pressure' },
  { id: '3', company: 'State Farm', requestDate: '2024-08-03', dataRequested: 'Cholesterol Levels' },
];

export default function Home() {
  const [requests, setRequests] = useState<Request[]>(initialRequestsData);

  const handleAccept = (id: string) => {
    // Handle accepting the request
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    console.log(`Accepted request with ID: ${id}`);
  };

  const handleReject = (id: string) => {
    // Handle rejecting the request
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    console.log(`Rejected request with ID: ${id}`);
  };

  const renderRequestItem = (item: Request) => {
    const dataRequestedMessage = `${item.company} requested your ${item.dataRequested}.`;

    return (
      <View key={item.id} style={styles.requestCard}>
        <View style={styles.requestDetails}>
          <Text style={styles.requestCompany}>{item.company}</Text>
          <Text style={styles.requestDate}>{item.requestDate}</Text>
          <Text style={styles.dataRequested}>{dataRequestedMessage}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleAccept(item.id)}>
            <MaterialIcons name="check-circle" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleReject(item.id)}>
            <MaterialIcons name="cancel" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.healthDataCard}>
        <HealthDataCarousel />
      </View>
      <View style={styles.requestsSection}>
        <Text style={styles.requestsTitle}>Data Access Requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.noRequests}>No Requests</Text>
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
    flexGrow: 1, // Allows content to expand
    padding: 16,
    backgroundColor: '#fff',
  },
  healthDataCard: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    height: 250, // Set height for the carousel
    width: '100%', // Ensure full width
  },
  requestsSection: {
    flex: 1,
  },
  requestsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noRequests: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollContainer: {
    paddingBottom: 16, // Add padding if needed
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
  requestCompany: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 4,
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
});
