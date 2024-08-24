import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, TouchableWithoutFeedback, TextInput, Animated } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SettingsNavigationProp } from '../../types'; // Adjust import path as needed

type CustomDrawerProps = {
  isVisible: boolean;
  onClose: () => void;
  navigation: SettingsNavigationProp; // Use the SettingsNavigationProp type here
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isVisible, onClose, navigation }) => {
  const [companyModalVisible, setCompanyModalVisible] = useState(false); // For showing/hiding company selection modal
  const [searchQuery, setSearchQuery] = useState(''); // To handle search input
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen to the left

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : -300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const companies = ['Company A', 'Company B', 'Company C', 'Company D'];

  const filteredCompanies = companies.filter(company => 
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setCompanyModalVisible(false); // Close the modal after selection
    console.log(`Selected company: ${company}`);
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent={true}
      animationType="none" // Disable default animation
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={styles.drawerContent}>
          <ScrollView>
            {/* {['Company A', 'Company B', 'Company C'].map((name, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerItem}
                onPress={() => console.log(`Selected ${name}`)}
              >
                <Text style={styles.drawerItemText}>{name}</Text>
              </TouchableOpacity>
            ))} */}

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={24} color="green" />
              <Text style={styles.drawerItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => setCompanyModalVisible(true)} 
            >
              <Ionicons name="add-circle" size={24} color="#333" />
              <Text style={styles.drawerItemText}>Add New Company</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Company selection modal */}
      <Modal
        visible={companyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCompanyModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCompanyModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a Company</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search for a company..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView style={styles.companyList}>
            {filteredCompanies.map((company, index) => (
              <TouchableOpacity
                key={index}
                style={styles.companyItem}
                onPress={() => handleCompanySelect(company)}
              >
                <Text style={styles.companyName}>{company}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCompanyModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 8,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  companyList: {
    maxHeight: 200,
  },
  companyItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  companyName: {
    fontSize: 18,
    color: '#333',
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

export default CustomDrawer;
