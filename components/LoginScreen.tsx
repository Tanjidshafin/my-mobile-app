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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { login } = useUser();
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      setIsLoading(false);
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
    setIsLoading(false);
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
      <ScrollView className="flex-1 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
        <Animated.View
          style={{ opacity, transform: [{ translateY }] }}
          className="flex-1 px-6 py-12">
          {/* Header Section */}
          <View className="mb-8 mt-12 items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <View className="mb-6 rounded-full bg-white/20 p-6">
                <Ionicons name="restaurant" size={48} color="#f97316" />
              </View>
            </TouchableOpacity>

            <Text className="mb-2 text-3xl font-bold text-orange-500">Welcome Back</Text>
            <Text className="text-center text-lg text-orange-500/80">
              Sign in to continue your culinary journey
            </Text>
          </View>

          {/* Login Form */}
          <View className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <Text className="mb-8 text-center text-2xl font-bold text-gray-800">Sign In</Text>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="mb-2 font-semibold text-gray-700">Email Address</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="mail" size={20} color="#9ca3af" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="mb-2 font-semibold text-gray-700">Password</Text>
              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-1">
                <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  className="ml-3 flex-1 text-base text-gray-800"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-6 self-end">
              <Text className="font-semibold text-orange-500">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-2xl border border-orange-500 bg-orange-500 py-4 shadow-lg ${
                isLoading ? 'opacity-70' : ''
              }`}>
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <View className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <Text className="text-lg font-bold text-white">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="my-8 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="mx-4 font-medium text-gray-500">OR</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            {/* Social Login */}
            <View className="space-y-3">
              <TouchableOpacity className="mb-3 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4">
                <Ionicons name="logo-facebook" size={20} color="white" />
                <Text className="ml-3 font-semibold text-white">Continue with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-center rounded-2xl bg-red-500 py-4">
                <Ionicons name="logo-google" size={20} color="white" />
                <Text className="ml-3 font-semibold text-white">Continue with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="font-bold text-orange-500">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Decoration */}
          <View className="mt-8 items-center">
            <Text className="text-sm text-white/60">
              By signing in, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
