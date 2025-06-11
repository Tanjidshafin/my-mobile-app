'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { pointsAPI } from '../services/api';
interface PointsHistory {
  _id: string;
  type: 'earned' | 'redeemed';
  points: number;
  reason: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, updateProfile, refreshUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        avatar: user.avatar || '',
      });
    }
    loadPointsHistory();

    // Animate profile load
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [user]);

  const loadPointsHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await pointsAPI.getHistory();
      if (response.history) {
        setPointsHistory(response.history);
      }
    } catch (error) {
      console.error('Error loading points history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const success = await updateProfile({
        name: editForm.name.trim(),
        avatar: editForm.avatar.trim(),
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadPointsHistory()]);
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Ionicons name="person-circle" size={64} color="#d1d5db" />
        <Text className="mt-4 text-lg font-semibold text-gray-500">
          Please login to view profile
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="mt-4 rounded-full bg-orange-500 px-6 py-3">
          <Text className="font-semibold text-white">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 px-4 py-3 pt-12">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full bg-white/20 p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">My Profile</Text>
          <TouchableOpacity onPress={handleLogout} className="rounded-full bg-white/20 p-2">
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <View className="mx-4 mt-6 rounded-3xl bg-white p-6 shadow-lg">
            <View className="items-center">
              {/* Avatar */}
              <View className="relative">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500">
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} className="h-24 w-24 rounded-full" />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
                      }}
                      className="h-24 w-24 rounded-full"
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  className="absolute -bottom-2 -right-2 rounded-full bg-orange-500 p-2 shadow-md">
                  <Ionicons name={isEditing ? 'close' : 'pencil'} size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <View className="mt-4 items-center">
                {isEditing ? (
                  <View className="w-full space-y-4">
                    <View>
                      <Text className="mb-2 font-semibold text-gray-700">Full Name</Text>
                      <TextInput
                        value={editForm.name}
                        onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholder="Enter your name"
                      />
                    </View>
                    <View>
                      <Text className="mb-2 font-semibold text-gray-700">
                        Avatar URL (Optional)
                      </Text>
                      <TextInput
                        value={editForm.avatar}
                        onChangeText={(text) => setEditForm({ ...editForm, avatar: text })}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                        placeholder="Enter avatar URL"
                      />
                    </View>
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={() => setIsEditing(false)}
                        className="flex-1 rounded-xl bg-gray-200 py-3">
                        <Text className="text-center font-semibold text-gray-700">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-orange-500 py-3">
                        <Text className="text-center font-semibold text-white">
                          {isLoading ? 'Saving...' : 'Save'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text className="text-2xl font-bold text-gray-800">{user.name}</Text>
                    <Text className="mt-1 text-gray-600">{user.email}</Text>
                    <View className="mt-3 rounded-full bg-orange-100 px-4 py-2">
                      <Text className="font-semibold text-orange-600">Foodie Member</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          ={/* Quick Stats */}
          <View className="mx-4 mt-6">
            <View className="rounded-3xl bg-white p-6 shadow-lg">
              <Text className="mb-4 text-xl font-bold text-gray-800">Quick Stats</Text>
              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <View className="mb-2 rounded-full bg-blue-100 p-3">
                    <Ionicons name="restaurant" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">0</Text>
                  <Text className="text-sm text-gray-600">Orders</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="mb-2 rounded-full bg-green-100 p-3">
                    <Ionicons name="star" size={24} color="#10b981" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">{user.points || 0}</Text>
                  <Text className="text-sm text-gray-600">Points</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="mb-2 rounded-full bg-purple-100 p-3">
                    <Ionicons name="heart" size={24} color="#8b5cf6" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800">0</Text>
                  <Text className="text-sm text-gray-600">Favorites</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Points History */}
          <View className="mx-4 mt-6">
            <View className="rounded-3xl bg-white p-6 shadow-lg">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-800">Points History</Text>
                <TouchableOpacity onPress={loadPointsHistory}>
                  <Ionicons name="refresh" size={20} color="#f97316" />
                </TouchableOpacity>
              </View>

              {loadingHistory ? (
                <View className="items-center py-8">
                  <View className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  <Text className="mt-2 text-gray-500">Loading history...</Text>
                </View>
              ) : pointsHistory.length > 0 ? (
                <View className="space-y-3">
                  {pointsHistory.slice(0, 5).map((transaction) => (
                    <View
                      key={transaction._id}
                      className="flex-row items-center justify-between border-b border-gray-100 py-3">
                      <View className="flex-1 flex-row items-center">
                        <View
                          className={`mr-3 rounded-full p-2 ${
                            transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          <Ionicons
                            name={transaction.type === 'earned' ? 'add-circle' : 'remove-circle'}
                            size={20}
                            color={transaction.type === 'earned' ? '#10b981' : '#ef4444'}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-800">{transaction.reason}</Text>
                          <Text className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'earned' ? '+' : '-'}
                        {transaction.points}
                      </Text>
                    </View>
                  ))}

                  {pointsHistory.length > 5 && (
                    <TouchableOpacity className="mt-3 rounded-xl bg-gray-100 py-3">
                      <Text className="text-center font-semibold text-gray-600">
                        View All History ({pointsHistory.length} transactions)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="document-text" size={48} color="#d1d5db" />
                  <Text className="mt-2 text-center text-gray-500">No points history yet</Text>
                  <Text className="text-center text-sm text-gray-400">
                    Start ordering to earn points!
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* Menu Options */}
          <View className="mx-4 mb-8 mt-6">
            <View className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <TouchableOpacity className="flex-row items-center border-b border-gray-100 px-6 py-4">
                <View className="mr-4 rounded-full bg-blue-100 p-2">
                  <Ionicons name="list" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Order History</Text>
                  <Text className="text-sm text-gray-500">View your past orders</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center border-b border-gray-100 px-6 py-4">
                <View className="mr-4 rounded-full bg-purple-100 p-2">
                  <Ionicons name="heart" size={20} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Favorites</Text>
                  <Text className="text-sm text-gray-500">Your favorite dishes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center border-b border-gray-100 px-6 py-4">
                <View className="mr-4 rounded-full bg-green-100 p-2">
                  <Ionicons name="location" size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Addresses</Text>
                  <Text className="text-sm text-gray-500">Manage delivery addresses</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center border-b border-gray-100 px-6 py-4">
                <View className="mr-4 rounded-full bg-yellow-100 p-2">
                  <Ionicons name="card" size={20} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Payment Methods</Text>
                  <Text className="text-sm text-gray-500">Manage payment options</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center px-6 py-4">
                <View className="mr-4 rounded-full bg-gray-100 p-2">
                  <Ionicons name="settings" size={20} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Settings</Text>
                  <Text className="text-sm text-gray-500">App preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
