import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: undefined;
  Profile: undefined;
  PlanDetails: { planId: string }; 
  ClaimsDetails: { plan: Plan }; 
  OTP: { email: string }; 
  Login: undefined;
  Signup: undefined;
  Settings: undefined;
  ForgotPassword: undefined;
  Payment: undefined;
};

type Plan = {
  id: string;
  name: string;
  description: string;
};

export type PlanDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlanDetails'>;
export type PlanDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlanDetails'>;

export type ClaimsDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ClaimsDetails'>;
export type ClaimsDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ClaimsDetails'>;

export type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTP'>;
export type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

export type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;
