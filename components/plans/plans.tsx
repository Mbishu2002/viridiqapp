import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';

type Plan = {
  id: string;
  plan_name: string;
  price: number;
  description: string;
  subscribed?: boolean; 
};

type RootStackParamList = {
  PlanDetails: { plan: Plan };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PlanDetails'>;

export default function Plans() {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useAuth();
  const [plansData, setPlansData] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = useCallback(() => {
    if (token) {
      axios.get(`${config.BASE_URL}/insurance-plans/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(response => {
        setPlansData(response.data);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
      })
      .finally(() => setRefreshing(false));
    }
  }, [token]);

  useEffect(() => {
    fetchPlans(); // Initial fetch
    const intervalId = setInterval(fetchPlans, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchPlans]);

  const handleCardPress = (plan: Plan) => {
    navigation.navigate('PlanDetails', { plan });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilter = (criteria: string | null) => {
    setFilter(criteria);
  };

  const filteredPlans = plansData.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === null || (filter === 'subscribed' && plan.subscribed) || (filter === 'notSubscribed' && !plan.subscribed);
    return matchesSearch && matchesFilter;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlans();
  }, [fetchPlans]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search plans..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'subscribed' && styles.selectedFilter]}
          onPress={() => handleFilter('subscribed')}
        >
          <Text style={styles.filterButtonText}>Subscribed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'notSubscribed' && styles.selectedFilter]}
          onPress={() => handleFilter('notSubscribed')}
        >
          <Text style={styles.filterButtonText}>Not Subscribed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === null && styles.selectedFilter]}
          onPress={() => handleFilter(null)}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {filteredPlans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={styles.card}
            onPress={() => handleCardPress(plan)}
          >
            <Text style={styles.cardTitle}>{plan.plan_name}</Text>
            <Text style={styles.cardPrice}>£{plan.price} / month</Text>
            <Text style={styles.cardDescription}>
              {plan.description.length > 100 ? plan.description.slice(0, 100) + '...' : plan.description}
            </Text>
            {plan.subscribed && (
              <View style={styles.subscribedTag}>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={styles.subscribedText}>Subscribed</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFilter: {
    backgroundColor: '#d0e7ff',
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  coverageDetailsContainer: {
    marginBottom: 16,
  },
  coverageDetailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  coverageDetails: {
    fontSize: 14,
    color: '#666',
  },
  subscribedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  subscribedText: {
    fontSize: 14,
    color: 'green',
    marginLeft: 8,
  },
});
