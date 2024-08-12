import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SubscriptionManagement() {
  // Add logic to manage subscriptions here

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Subscriptions</Text>
      {/* Display user subscriptions and management options here */}
      <Text style={styles.infoText}>Here you can manage your active subscriptions.</Text>
      <Button title="Add New Subscription" onPress={() => console.log('Add new subscription')} />
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
  infoText: {
    fontSize: 16,
    marginBottom: 16,
  },
});
