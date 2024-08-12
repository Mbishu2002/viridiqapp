import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import TabLayout from '@/components/navigation/bottom';
import Profile from '@/components/Profile/profile';
import PlanDetails from '@/components/plans/plandetails';
import ClaimsDetails from '@/components/Claims/claimsdetails';
import SettingsPage from '@/components/Settings/settings';
import OTP from '@/components/Auth/otp';
import LoginScreen from '@/components/Auth/login';
import SignupScreen from '@/components/Auth/signup';
import ForgotPasswordScreen from '@/components/Auth/forgotpassword';
import PaymentSettingsScreen from '@/components/Settings/payments';
import { AuthProvider } from '@/components/context/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

const Index = () => {
    SplashScreen.preventAutoHideAsync();

    const colorScheme = 'light';  
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <AuthProvider >
            <NavigationContainer
                theme={DefaultTheme}  
                independent={true}
            >
                <Stack.Navigator
                    initialRouteName="Login" 
                    screenOptions={{
                        headerBackImage: () => (
                            <Ionicons name="chevron-back" size={24} color="grey" />
                        ),
                        headerBackTitleVisible: false,
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
                    <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
                    <Stack.Screen name="Tabs" component={TabLayout} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="PlanDetails" component={PlanDetails} options={{ title: 'Plan Details' }} />
                    <Stack.Screen name="ClaimDetails" component={ClaimsDetails} options={{ title: 'Claims Details' }} />
                    <Stack.Screen name="Settings" component={SettingsPage} options={{ title: 'Settings' }} />
                    <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} options={{ title: 'Payment Settings' }} />
                </Stack.Navigator>
            </NavigationContainer>
            </AuthProvider>
        </>
    );
};

export default Index;
