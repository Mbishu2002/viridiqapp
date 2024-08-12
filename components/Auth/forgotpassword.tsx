import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LoginScreenNavigationProp } from '../../types'; // Ensure this is the correct path for your types
import config from '@/config/config';

interface ForgotPasswordScreenProps {
  navigation: LoginScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('#777');

  const handleForgotPassword = async () => {
    console.log(config.BASE_URL)
    if (email) {
      try {
        const response = await fetch(`${config.BASE_URL}/forgot-password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage('Reset link sent to your email!');
          setMessageColor('green');

          setTimeout(() => {
            navigation.navigate('Login');
          }, 2000);
        } else {
          setMessage(result.error || 'Error sending reset link');
          setMessageColor('red');
        }
      } catch (error) {
        setMessage('Error sending reset link');
        setMessageColor('red');
      }
    } else {
      setMessage('Please enter your email address');
      setMessageColor('red');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email address below to reset your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCompleteType="email"
        textContentType="emailAddress"
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      {message ? (
        <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
      ) : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#777',
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
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default ForgotPasswordScreen;
