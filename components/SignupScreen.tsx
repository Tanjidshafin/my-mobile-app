'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from 'context/UserContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
  ProductDetails: { id: string };
};
export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [focusedInput, setFocusedInput] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useUser();

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);
  const handleSignup = async () => {
    setIsLoading(true);
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      setIsLoading(false);
      return;
    }
    const result = await register(name, email, password);
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
    setIsLoading(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-orange-50">
        <View className="rounded-b-[40px] bg-orange-500 px-6 pb-8 pt-12 shadow-lg">
          <View className="mb-6 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="rounded-full bg-white/20 p-4">
              <Ionicons name="restaurant" size={28} color="white" />
            </View>
            <View className="w-12" />
          </View>

          <View className="items-center">
            <Text className="mb-2 text-3xl font-bold text-white">Join FoodieHub</Text>
            <Text className="text-center text-base text-orange-100">
              Start your culinary adventure today
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }, { scale }],
            }}
            className="px-6 py-8">
            {/* Welcome Bonus Card */}
            <View className="mb-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-lg">
              <View className="flex-row items-center">
                <View className="mr-4 rounded-full bg-orange-100 p-3">
                  <Ionicons name="gift" size={28} color="#f97316" />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-lg font-bold text-gray-800">Welcome Bonus!</Text>
                  <Text className="text-gray-600">Get 100 points when you sign up</Text>
                </View>
                <View className="rounded-full bg-orange-500 px-3 py-1">
                  <Text className="text-sm font-bold text-white">+100</Text>
                </View>
              </View>
            </View>

            {/* Main Form Card */}
            <View className="mb-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-xl">
              <View className="mb-8 items-center">
                <View className="mb-4 rounded-full bg-orange-100 p-4">
                  <Ionicons name="person-add" size={32} color="#f97316" />
                </View>
                <Text className="mb-2 text-2xl font-bold text-gray-800">Create Account</Text>
                <Text className="text-center text-gray-500">
                  Fill in your details to get started
                </Text>
              </View>

              {/* Name Input */}
              <View className="mb-5">
                <Text className="mb-3 ml-1 font-semibold text-gray-700">Full Name</Text>
                <View
                  className={`flex-row items-center rounded-2xl border-2 px-4 py-2 ${
                    focusedInput === 'name'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                  <View className="mr-3 rounded-full bg-orange-100 p-2">
                    <Ionicons name="person" size={18} color="#f97316" />
                  </View>
                  <TextInput
                    value={formData.name}
                    onChangeText={(value) => updateFormData('name', value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-base font-medium text-gray-800"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-5">
                <Text className="mb-3 ml-1 font-semibold text-gray-700">Email Address</Text>
                <View
                  className={`flex-row items-center rounded-2xl border-2 px-4 py-2 ${
                    focusedInput === 'email'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                  <View className="mr-3 rounded-full bg-orange-100 p-2">
                    <Ionicons name="mail" size={18} color="#f97316" />
                  </View>
                  <TextInput
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-base font-medium text-gray-800"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-5">
                <Text className="mb-3 ml-1 font-semibold text-gray-700">Password</Text>
                <View
                  className={`flex-row items-center rounded-2xl border-2 px-4 py-2 ${
                    focusedInput === 'password'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                  <View className="mr-3 rounded-full bg-orange-100 p-2">
                    <Ionicons name="lock-closed" size={18} color="#f97316" />
                  </View>
                  <TextInput
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="Create a strong password"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-base font-medium text-gray-800"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2 p-2">
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-8">
                <Text className="mb-3 ml-1 font-semibold text-gray-700">Confirm Password</Text>
                <View
                  className={`flex-row items-center rounded-2xl border-2 px-4 py-2 ${
                    focusedInput === 'confirmPassword'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                  <View className="mr-3 rounded-full bg-orange-100 p-2">
                    <Ionicons name="lock-closed" size={18} color="#f97316" />
                  </View>
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-base font-medium text-gray-800"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 p-2">
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={isLoading}
                className={`mb-6 rounded-2xl py-5 shadow-lg ${isLoading ? 'bg-orange-300' : 'bg-orange-500'}`}>
                <View className="flex-row items-center justify-center">
                  {isLoading && (
                    <View className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <Text className="text-lg font-bold text-white">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                  {!isLoading && (
                    <Ionicons name="arrow-forward" size={20} color="white" className="ml-2" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="mb-6 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />
                <View className="mx-4 rounded-full bg-gray-100 px-4 py-2">
                  <Text className="text-sm font-medium text-gray-500">OR SIGN UP WITH</Text>
                </View>
                <View className="h-px flex-1 bg-gray-300" />
              </View>

              {/* Social Signup */}
              <View className="space-y-4">
                <TouchableOpacity className="mb-3 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4 shadow-md">
                  <View className="mr-3 rounded-full bg-white/20 p-1">
                    <Ionicons name="logo-facebook" size={20} color="white" />
                  </View>
                  <Text className="text-base font-semibold text-white">Sign up with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center justify-center rounded-2xl bg-red-500 py-4 shadow-md">
                  <View className="mr-3 rounded-full bg-white/20 p-1">
                    <Ionicons name="logo-google" size={20} color="white" />
                  </View>
                  <Text className="text-base font-semibold text-white">Sign up with Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Link Card */}
            <View className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg">
              <View className="flex-row items-center justify-center">
                <Text className="mr-2 text-base text-gray-600">Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-base font-bold text-orange-500">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Info */}
            <View className="mt-8 items-center px-4">
              <Text className="text-center text-sm leading-5 text-gray-400">
                By creating an account, you agree to our{' '}
                <Text className="font-medium text-orange-500">Terms of Service</Text> and{' '}
                <Text className="font-medium text-orange-500">Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
