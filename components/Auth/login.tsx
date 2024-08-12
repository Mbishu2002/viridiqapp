import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { LoginScreenNavigationProp, ForgotPasswordScreenNavigationProp } from '../../types'; // Import ForgotPasswordScreenNavigationProp
import Logo from '@/assets/images/logo.png';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  const { login } = useAuth();

  const handleLogin = async () => {
    if (email && password) {
      try {
        await login(email, password);
        setSuccessMessage('Login successful');
        setErrorMessage(null); 
        navigation.navigate('Tabs');
      } catch (error) {
        setErrorMessage('Invalid email or password');
        setSuccessMessage(null); 
      }
    } else {
      setErrorMessage('Please enter both email and password');
      setSuccessMessage(null);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => setErrorMessage('Failed to open the link'));
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
      {errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCompleteType="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© Viridiq v1.0</Text>
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
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4caf50',  
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    color: '#4caf50', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',  
    alignItems: 'center',
    marginBottom: 16, 
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default LoginScreen;
