import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import OTPInput from './otpinput';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { OTPScreenRouteProp, SignupScreenNavigationProp } from '@/types';
import config from '@/config/config';

const OTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const refs = useRef<TextInput[]>([]);
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const { email } = route.params;

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text !== '' && index < otp.length - 1) {
      refs.current[index + 1].focus();
    }

    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    try {
      const response = await axios.post(`${config.BASE_URL}/verify/`,
        {otpValue },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'OTP Verified' });
        navigation.navigate('Tabs');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid or expired OTP' });
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post(`${config.BASE_URL}/resend-otp/`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      if (response.status === 201) {
        setMessage({ type: 'success', text: 'A new OTP has been sent to your email.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to resend OTP' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.infoText}>An OTP has been sent to your email:</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <OTPInput
            key={index}
            value={value}
            index={index}
            onChangeText={handleChange}
            ref={(ref) => (refs.current[index] = ref!)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                refs.current[index - 1].focus();
              }
            }}
          />
        ))}
      </View>
      {message && (
        <View style={[styles.messageContainer, message.type === 'error' ? styles.error : styles.success]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      )}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  button: {
    marginTop: 20,
    width: '60%',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#333',
  },
  resendButton: {
    marginLeft: 10,
  },
  resendButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTP;
