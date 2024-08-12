import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/images/logo.png';
import config from '@/config/config';

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [first_name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    setPasswordCriteria({
      length: password.length >= minLength,
      number: hasNumber,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
    });

    return password.length >= minLength && hasNumber && hasUpperCase && hasLowerCase;
  };

  const handleSignup = async () => {
    if (first_name && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!validatePassword(password)) {
        setError('Password does not meet all criteria');
        return;
      }

      setMessage('');
      setError('');

      try {
        const response = await axios.post(`${config.BASE_URL}/register/`, {
          first_name,
          email,
          password
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        navigation.navigate('Login');

        // setMessage('Signup successful! Please check your email for OTP.');
        // navigation.navigate('OTP', { email });
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error || 'An error occurred during signup.');
        } else {
          setError('An unexpected error occurred.');
        }
      }
    } else {
      setError('Please enter all details');
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => setError('Failed to open the link'));
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={first_name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCompleteType="email"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={styles.criteriaContainer}>
        <Text style={[styles.criteriaText, passwordCriteria.length && styles.criteriaMet]}>
          At least 8 characters
        </Text>
        <Text style={[styles.criteriaText, passwordCriteria.number && styles.criteriaMet]}>
          Contains a number
        </Text>
        <Text style={[styles.criteriaText, passwordCriteria.uppercase && styles.criteriaMet]}>
          Contains an uppercase letter
        </Text>
        <Text style={[styles.criteriaText, passwordCriteria.lowercase && styles.criteriaMet]}>
          Contains a lowercase letter
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}
      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing up, you accept our{' '}
          <TouchableOpacity onPress={() => openLink(`${config.BASE_URL}/terms`)}>
            <Text style={styles.footerLink}>Terms & Conditions</Text>
          </TouchableOpacity>{' '}
          and{' '}
          <TouchableOpacity onPress={() => openLink(`${config.BASE_URL}/privacy`)}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>.
        </Text>
      </View>
      <Text style={styles.version}>© Viridiq v1.0</Text>
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
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    padding: 10,
  },
  criteriaContainer: {
    marginBottom: 12,
  },
  criteriaText: {
    fontSize: 12,
    color: 'red',
  },
  criteriaMet: {
    color: 'green',
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
    marginTop: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footerLink: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  version: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default SignupScreen;