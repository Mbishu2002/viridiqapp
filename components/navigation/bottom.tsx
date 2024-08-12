import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import Home from '@/components/Home/home';
import Claims from '@/components/Claims/claims';
import Plans from '@/components/plans/plans';
import Profile from '@/components/Profile/profile';
import Header from '@/components/Header/header'; 

const Tab = createBottomTabNavigator();

export default function TabLayout({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'grey',
        header: () => (
          <Header />
        ),
        tabBarStyle: {
          backgroundColor: 'white',
          height: 70,
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} /> // Increased icon size
          ),
        }}
      />
      <Tab.Screen
        name="Claims"
        component={Claims}
        options={{
          title: 'Claims',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name={focused ? 'file-alt' : 'file-alt'} size={28} color={color} /> // Increased icon size
          ),
        }}
      />
      <Tab.Screen
        name="Plans"
        component={Plans}
        options={{
          title: 'Plans',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'list' : 'list'} size={28} color={color} /> // Increased icon size
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={color} /> // Increased icon size
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
