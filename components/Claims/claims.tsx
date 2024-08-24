import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';

type Plan = {
  id: string;
  name: string;
  description: string;
  subscribed: boolean;
};

type RootStackParamList = {
  TabLayout: undefined;
  ClaimDetails: { plan: Plan };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ClaimDetails'>;

export default function Claims() {
  const [search, setSearch] = useState('');
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { token } = useAuth();

  const fetchClaims = useCallback(() => {
    if (token) {
      axios.get(`${config.BASE_URL}/insurance-plans/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(response => {
        const subscribedPlans = response.data.filter((plan: Plan) => plan.subscribed);
        setFilteredPlans(subscribedPlans);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
      })
      .finally(() => setRefreshing(false));
    }
  }, [token]);

  useEffect(() => {
    fetchClaims(); // Initial fetch
    const intervalId = setInterval(fetchClaims, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchClaims]);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = filteredPlans.filter(plan =>
      plan.plan_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  const handleClaimPress = (plan: Plan) => {
    navigation.navigate('ClaimDetails', { plan });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClaims();
  }, [fetchClaims]);

  const renderItem = ({ item }: { item: Plan }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleClaimPress(item)}>
      <View style={styles.cardContent}>
        <View style={styles.claimIcon}>
          <Ionicons name="shield-checkmark-outline" size={50} color="green" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.plan_name}</Text>
          <Text style={styles.cardDescription}>
            {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="grey" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plans..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {filteredPlans.length === 0 ? (
        <View style={styles.noPlansContainer}>
          <MaterialCommunityIcons name="emoticon-sad" size={50} color="grey" />
          <Text style={styles.noPlansText}>No subscribed plans available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: 'grey',
    marginTop: 8,
  },
  claimIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlansContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlansText: {
    fontSize: 16,
    color: 'grey',
    marginTop: 16,
  },
});
