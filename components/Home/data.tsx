import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

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
  { id: '1', title: 'Heart Rate', icon: 'heartbeat', connected: false },
  { id: '2', title: 'Blood Pressure', icon: 'tint', connected: false },
  { id: '3', title: 'Cholesterol', icon: 'medkit', connected: false },
  { id: '4', title: 'Steps', icon: 'walking', connected: false },
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

  const handleConnect = (id: string) => {
    setSelectedDataId(id);
    setModalVisible(true);
  };

  const handleDeviceSelection = (device: Device) => {
    console.log(`Selected device: ${device.name}`);
    setModalVisible(false);
  };

  const renderItem = (item: HealthDataType) => {
    const isConnected = item.connected;
    return (
      <View style={styles.carouselItem}>
        <FontAwesome5 name={item.icon} size={64} color={isConnected ? 'green' : 'grey'} />
        <Text style={styles.dataTitle}>{item.title}</Text>
        <TouchableOpacity
          style={[styles.connectButton, { backgroundColor: isConnected ? 'red' : 'green' }]}
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
        width={300} // Adjust the width as needed
        height={200} // Adjust the height as needed
        autoPlay={false} // Set to true if you want the carousel to auto-play
        data={healthDataTypes}
        scrollAnimationDuration={1000} // Adjust scroll animation duration
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.id}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:  '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  connectButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
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
