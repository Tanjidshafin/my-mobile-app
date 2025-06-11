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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from 'context/UserContext';

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
  const navigation = useNavigation();
  const { register } = useUser();
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
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
    outputRange: [50, 0],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView className="flex-1">
        <Animated.View
          style={{ opacity, transform: [{ translateY }] }}
          className="flex-1 px-6 py-8">
          {/* Header Section */}
          <View className="mb-6 mt-8 items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <View className="mb-6 rounded-full bg-white/20 p-6">
                <Ionicons name="restaurant" size={48} color="#f97316" />
              </View>
            </TouchableOpacity>
            <Text className="mb-2 text-4xl font-bold text-orange-500">Join FoodieHub</Text>
            <Text className="text-center text-lg text-orange-500/80">
              Create your account and start exploring amazing dishes
            </Text>
          </View>

          {/* Signup Form */}
          <View className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <Text className="mb-6 text-center text-2xl font-bold text-gray-800">
              Create Account
            </Text>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="mb-2 font-semibold text-gray-700">Full Name</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="person" size={20} color="#9ca3af" />
                <TextInput
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-2 font-semibold text-gray-700">Email Address</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="mail" size={20} color="#9ca3af" />
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="mb-2 font-semibold text-gray-700">Password</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="mb-2 font-semibold text-gray-700">Confirm Password</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
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
              className={`rounded-2xl bg-orange-500 py-4 shadow-lg ${
                isLoading ? 'opacity-70' : ''
              }`}>
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <View className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <Text className="text-lg font-bold text-white">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="mx-4 font-medium text-gray-500">OR</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            {/* Social Signup */}
            <View className="space-y-3">
              <TouchableOpacity className="mb-2 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4">
                <Ionicons name="logo-facebook" size={20} color="white" />
                <Text className="ml-3 font-semibold text-white">Sign up with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-center rounded-2xl bg-red-500 py-4">
                <Ionicons name="logo-google" size={20} color="white" />
                <Text className="ml-3 font-semibold text-white">Sign up with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="font-bold text-purple-500">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Welcome Bonus */}
          <View className="mt-6 flex-row items-center rounded-2xl bg-white/20 p-4">
            <View className="mr-3 rounded-full bg-orange-400 p-2">
              <Ionicons name="gift" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="black text-lg font-bold">Welcome Bonus!</Text>
              <Text className="black/80 text-sm">Get 100 points when you sign up</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
