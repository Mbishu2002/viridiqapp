import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { Accelerometer } from 'expo-sensors';
import axios from 'axios';
import config from '@/config/config';
import { useAuth } from '../context/AuthContext';

interface HealthDataType {
  id: string;
  title: string;
  icon: string;
  connected: boolean;
}

interface Device {
  id: string;
  name: string;
  canTrack: boolean;
}

const healthDataTypes: HealthDataType[] = [
  { id: '1', title: 'Steps', icon: 'walking', connected: false },
];

const devices: Device[] = [
  { id: '1', name: 'Fitbit', canTrack: true },
  { id: '2', name: 'Apple Watch', canTrack: true },
  { id: '3', name: 'Garmin', canTrack: true },
  { id: '4', name: 'Your Phone', canTrack: true },
  { id: '5', name: 'Unknown Device', canTrack: false },
];

const HealthDataCarousel = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDataId, setSelectedDataId] = useState<string>('');
  const [isStepCountingActive, setIsStepCountingActive] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const { token } = useAuth();

  useEffect(() => {
    let subscription: any;
    
    const startStepCounting = async () => {
      Accelerometer.setUpdateInterval(100); // Update every 100ms

      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // Simple step detection threshold
        if (acceleration > 1.2) {
          setStepCount(prevCount => prevCount + 1);
        }
      });

      setIsStepCountingActive(true);
    };

    if (isStepCountingActive) {
      startStepCounting();

      const interval = setInterval(() => {
        sendStepCountToBackend(stepCount);
      }, 5000); // Send step count every 5 seconds

      return () => {
        if (subscription) {
          subscription.remove();
        }
        clearInterval(interval);
      };
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isStepCountingActive, stepCount]);

  const sendStepCountToBackend = async (steps: number) => {
    try {
      await axios.post(`${config.BASE_URL}/health-data/save/`, {
        data: JSON.stringify({ steps }), 
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // Include the authorization token
        },
      });
      console.log('Step count recorded successfully');
    } catch (error) {
      console.error('Error recording step count:', error);
    }
  };

  const handleConnect = (id: string) => {
    if (id === '1' && isStepCountingActive) {
      setIsStepCountingActive(false); // Stop step counting
      setStepCount(0); // Reset step count when disconnecting
    } else {
      setSelectedDataId(id);
      setModalVisible(true);
    }
  };

  const handleDeviceSelection = (device: Device) => {
    console.log(`Selected device: ${device.name}`);
    setModalVisible(false);
    if (device.canTrack) {
      setIsStepCountingActive(true); // Start step counting when a device is selected
    }
  };

  const renderItem = (item: HealthDataType) => {
    const isConnected = item.connected || (item.title === 'Steps' && isStepCountingActive);
    return (
      <View style={styles.carouselItem}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={item.icon} size={64} color={isConnected ? '#4CAF50' : 'grey'} />
        </View>
        <Text style={styles.dataTitle}>{item.title}</Text>
        {item.title === 'Steps' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepCount}>{stepCount}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.connectButton, { backgroundColor: isConnected ? '#f44336' : '#4CAF50' }]}
          onPress={() => handleConnect(item.id)}
        >
          <Text style={styles.connectButtonText}>{isConnected ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={300}
        height={300}
        autoPlay={false}
        data={healthDataTypes}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.id}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Device</Text>
            {devices.map(device => (
              <TouchableOpacity
                key={device.id}
                style={[styles.deviceItem, { backgroundColor: device.canTrack ? 'white' : '#f8d7da' }]}
                onPress={() => handleDeviceSelection(device)}
              >
                <Text style={styles.deviceName}>{device.name}</Text>
                {!device.canTrack && <MaterialIcons name="cancel" size={20} color="red" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
  },
  iconContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 50,
    padding: 15,
  },
  dataTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },
  stepContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  connectButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deviceName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HealthDataCarousel;
