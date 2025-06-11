'use client';

import { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from 'context/UserContext';
import { useNavigation } from '@react-navigation/native';

interface NavbarProps {
  onMenuPress?: () => void;
}

export default function EnhancedNavbar({ onMenuPress }: NavbarProps) {
  const [animatedValue] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { user, logout } = useUser();
  const handleLogoPress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    //Home Route
  };

  const logoScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 pt-12 shadow-lg">
      <View className="flex-row items-center justify-between">
        {/* Logo Section */}
        <TouchableOpacity onPress={handleLogoPress} className="flex-row items-center">
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <View className="mr-3 rounded-full bg-white p-2 shadow-md">
              <Ionicons name="restaurant" size={24} color="#f97316" />
            </View>
          </Animated.View>
          <View>
            <Text className="text-xl font-bold text-orange-700">FoodieHub</Text>
            <Text className="text-xs text-orange-500">Delicious Moments</Text>
          </View>
        </TouchableOpacity>

        {/* Right Section */}
        <View className="flex-row items-center space-x-3">
          {user ? (
            <View className="flex-row items-center space-x-3">
              {/* Points Display */}
              <View className="flex-row items-center rounded-full bg-white/20 px-3 py-1">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="ml-1 font-semibold text-orange-500">{user?.points || 0}</Text>
              </View>

              {/* Profile */}
              <TouchableOpacity className="rounded-full bg-white/20 p-2">
                <Ionicons name="person" size={20} color="#fbbf24" />
              </TouchableOpacity>
              {/* Logout */}
              <TouchableOpacity onPress={() => logout()} className="rounded-full bg-white/20 p-1">
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="rounded-full bg-gray-100 px-4 py-2 shadow-md">
              <Text className="font-semibold text-orange-500">Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View className="mt-4 flex-row items-center rounded-full bg-white px-4 py-1 shadow-lg">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          className="ml-3 flex-1 font-medium text-gray-700"
          placeholder="Search for delicious food..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity className="ml-2 rounded-full bg-orange-500 p-2 shadow-md active:opacity-80">
          <Ionicons name="options" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
