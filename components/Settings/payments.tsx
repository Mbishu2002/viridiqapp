import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { PaymentScreenNavigationProp } from '../../types';
import Visa from '@/assets/images/logos--visa.png';
import Mastercard from '@/assets/images/logos--mastercard.png';
import Amex from '@/assets/images/logos--amex.png';
import Discover from '@/assets/images/logos--discover.png';
import config from '@/config/config';

interface PaymentSettingsScreenProps {
  navigation: PaymentScreenNavigationProp;
}

interface Card {
  id: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  provider: string;
  isPrimary: boolean;
}

const cardProviders = {
  visa: Visa,
  mastercard: Mastercard,
  amex: Amex,
  discover: Discover,
};

const detectCardProvider = (last4: string): string => {
  // Note: Actual provider detection might require more information.
  return ''; // Implement based on your detection logic.
};

const PaymentSettingsScreen: React.FC<PaymentSettingsScreenProps> = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const { token } = useAuth(); // Get the token from context

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/credit-card/`, {
          headers: {
            Authorization: `Token ${token}`, // Add token to headers
          },
        });
        setCards(response.data);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
        setError('Failed to load cards');
      }
    };

    fetchCards();
  }, [token]);

  const handleSave = async () => {
    if (cardNumber && cardHolderName && expiryDate && cvv) {
      try {
        const [exp_month, exp_year] = expiryDate.split('/').map(Number);
        const newCard = {
          token: cardNumber,
          last4: cardNumber.slice(-4),
          exp_month,
          exp_year,
        };
        const response = await axios.post(`${config.BASE_URL}/credit-card/add/`, newCard, {
          headers: {
            Authorization: `Token ${token}`, // Add token to headers
          },
        });
        setCards([...cards, response.data]);
        setCardNumber('');
        setCardHolderName('');
        setExpiryDate('');
        setCvv('');
        setProvider('');
        setError('');
        setSuccess('Credit card added successfully');
        setTimeout(() => navigation.goBack(), 1500);
      } catch (error) {
        console.error('Failed to add card:', error);
        setSuccess('');
        setError('Failed to add credit card');
      }
    } else {
      setSuccess('');
      setError('Please fill in all fields');
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const updatedCards = cards.map(card => ({
        ...card,
        isPrimary: card.id === id,
      }));
      setCards(updatedCards);
      await axios.patch(`${config.BASE_URL}/credit-card/update/${id}/`, { isPrimary: true }, {
        headers: {
          Authorization: `Token ${token}`, // Add token to headers
        },
      });
    } catch (error) {
      console.error('Failed to update card:', error);
      setError('Failed to update card');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${config.BASE_URL}/credit-card/delete/${id}/`, {
        headers: {
          Authorization: `Token ${token}`, // Add token to headers
        },
      });
      setCards(cards.filter(card => card.id !== id));
      setSuccess('Credit card deleted successfully');
    } catch (error) {
      console.error('Failed to delete card:', error);
      setError('Failed to delete card');
    }
  };

  const renderCardItem = ({ item }: { item: Card }) => (
    <View style={styles.cardItem}>
      <Image source={cardProviders[item.provider]} style={styles.cardLogo} />
      <Text style={styles.cardText}>**** **** **** {item.last4}</Text>
      <Text style={styles.cardText}>Expires: {item.exp_month}/{item.exp_year}</Text>
      <Text style={styles.PrimaryText}>{item.isPrimary ? 'Primary' : 'Secondary'}</Text>
      <TouchableOpacity onPress={() => handleSetPrimary(item.id)} style={styles.button}>
        <Text style={styles.buttonText}>Set as {item.isPrimary ? 'Secondary' : 'Primary'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.button}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={(text) => {
              setCardNumber(text);
              setProvider(detectCardProvider(text));
            }}
            keyboardType="numeric"
            maxLength={19}
          />
          <Image source={cardProviders[provider]} style={styles.cardLogo} />
          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}
          <TouchableOpacity onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Add Card</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCardItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <View style={styles.providerList}>
        {Object.entries(cardProviders).map(([key, logo]) => (
          <Image key={key} source={logo} style={styles.providerLogo} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    marginRight: 10,
  },
  PrimaryText: {
    fontSize: 14,
    marginBottom: 4,
    color: 'green',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardLogo: {
    width: 20,
    height: 20,
    alignSelf: 'left',
    marginVertical: 8,
  },
  providerList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  providerLogo: {
    width: 20,
    height: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PaymentSettingsScreen;
