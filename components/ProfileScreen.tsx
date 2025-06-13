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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface PointsHistory {
  _id: string;
  type: 'earned' | 'redeemed';
  points: number;
  reason: string;
  createdAt: string;
}
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
  ProductDetails: { id: string };
};
export default function EnhancedProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
        onPress: () => {
          logout();
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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <View className="mx-4 items-center space-y-6 rounded-3xl bg-white p-8 shadow-xl">
          <View className="rounded-full bg-gray-100 p-6">
            <Ionicons name="person-circle" size={64} color="#d1d5db" />
          </View>
          <View className="items-center space-y-2">
            <Text className="text-xl font-bold text-gray-800">Welcome to FoodieHub</Text>
            <Text className="text-center text-gray-500">Please login to view your profile</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="rounded-2xl bg-orange-500 px-8 py-4 shadow-lg">
            <Text className="text-lg font-bold text-white">Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="relative overflow-hidden bg-orange-500 px-4 py-3 pt-12">
        <View className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-orange-400/20" />
        <View className="relative z-10 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-2xl border border-orange-400/30 bg-orange-600/50 p-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">My Profile</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-2xl border border-orange-400/30 bg-orange-600/50 p-3">
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <View className="mx-4 mt-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
            <View className="relative items-center">
              <View className="relative">
                <View className="h-28 w-28 items-center justify-center rounded-3xl border-4 border-orange-300 bg-orange-500 shadow-xl">
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} className="h-28 w-28 rounded-3xl" />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
                      }}
                      className="h-28 w-28 rounded-3xl"
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  className="absolute -bottom-2 -right-2 rounded-2xl border-2 border-white bg-orange-500 p-3 shadow-lg">
                  <Ionicons name={isEditing ? 'close' : 'pencil'} size={18} color="white" />
                </TouchableOpacity>
              </View>

              <View className="mt-6 w-full items-center">
                {isEditing ? (
                  <View className="w-full space-y-6">
                    <View>
                      <Text className="mb-3 text-lg font-bold text-gray-700">Full Name</Text>
                      <TextInput
                        value={editForm.name}
                        onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                        className="rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-lg"
                        placeholder="Enter your name"
                      />
                    </View>
                    <View>
                      <Text className="mb-3 mt-3 text-lg font-bold text-gray-700">Avatar URL</Text>
                      <TextInput
                        value={editForm.avatar}
                        onChangeText={(text) => setEditForm({ ...editForm, avatar: text })}
                        className="rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-lg"
                        placeholder="Enter avatar URL"
                      />
                    </View>
                    <View className="mt-6 flex-row gap-4">
                      <TouchableOpacity
                        onPress={() => setIsEditing(false)}
                        className="flex-1 rounded-2xl bg-gray-200 py-4">
                        <Text className="text-center text-lg font-bold text-gray-700">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 rounded-2xl bg-orange-500 py-4 shadow-lg">
                        <Text className="text-center text-lg font-bold text-white">
                          {isLoading ? 'Saving...' : 'Save'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View className="items-center space-y-3">
                    <Text className="text-3xl font-bold text-gray-800">{user.name}</Text>
                    <Text className="my-2 text-lg text-gray-600">{user.email}</Text>
                    <View className="rounded-2xl border-2 border-orange-200 bg-orange-100 px-6 py-3">
                      <Text className="text-lg font-bold text-orange-600">Foodie Member</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View className="mx-4 mt-6">
            <View className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
              <Text className="mb-6 text-center text-2xl font-bold text-gray-800">Quick Stats</Text>
              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <View className="mb-4 rounded-3xl border-2 border-blue-200 bg-blue-100 p-4">
                    <Ionicons name="restaurant" size={28} color="#3b82f6" />
                  </View>
                  <Text className="text-3xl font-bold text-gray-800">0</Text>
                  <Text className="font-medium text-gray-600">Orders</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="mb-4 rounded-3xl border-2 border-green-200 bg-green-100 p-4">
                    <Ionicons name="star" size={28} color="#10b981" />
                  </View>
                  <Text className="text-3xl font-bold text-gray-800">{user.points || 0}</Text>
                  <Text className="font-medium text-gray-600">Points</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="mb-4 rounded-3xl border-2 border-purple-200 bg-purple-100 p-4">
                    <Ionicons name="heart" size={28} color="#8b5cf6" />
                  </View>
                  <Text className="text-3xl font-bold text-gray-800">0</Text>
                  <Text className="font-medium text-gray-600">Favorites</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="mx-4 mt-6">
            <View className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-800">Points History</Text>
                <TouchableOpacity
                  onPress={loadPointsHistory}
                  className="rounded-2xl border border-orange-200 bg-orange-100 p-3">
                  <Ionicons name="refresh" size={20} color="#f97316" />
                </TouchableOpacity>
              </View>

              {loadingHistory ? (
                <View className="items-center py-12">
                  <View className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                  <Text className="mt-4 font-medium text-gray-500">Loading history...</Text>
                </View>
              ) : pointsHistory.length > 0 ? (
                <View className="flex-col gap-2 space-y-4">
                  {pointsHistory.slice(0, 5).map((transaction) => (
                    <View
                      key={transaction._id}
                      className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <View className="flex-1 flex-row items-center">
                        <View
                          className={`mr-4 rounded-2xl border-2 p-3 ${
                            transaction.type === 'earned'
                              ? 'border-green-200 bg-green-100'
                              : 'border-red-200 bg-red-100'
                          }`}>
                          <Ionicons
                            name={transaction.type === 'earned' ? 'add-circle' : 'remove-circle'}
                            size={24}
                            color={transaction.type === 'earned' ? '#10b981' : '#ef4444'}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-gray-800">
                            {transaction.reason}
                          </Text>
                          <Text className="font-medium text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`text-xl font-bold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'earned' ? '+' : '-'}
                        {transaction.points}
                      </Text>
                    </View>
                  ))}

                  {pointsHistory.length > 5 && (
                    <TouchableOpacity className="mt-4 rounded-2xl border-2 border-gray-200 bg-gray-100 py-4">
                      <Text className="text-center text-lg font-bold text-gray-600">
                        View All History ({pointsHistory.length} transactions)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View className="items-center py-12">
                  <View className="mb-4 rounded-3xl bg-gray-100 p-6">
                    <Ionicons name="document-text" size={48} color="#d1d5db" />
                  </View>
                  <Text className="text-center text-lg font-bold text-gray-500">
                    No points history yet
                  </Text>
                  <Text className="mt-2 text-center text-gray-400">
                    Start ordering to earn points!
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="mx-4 mb-8 mt-6">
            <View className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
              {[
                {
                  icon: 'list',
                  color: '#3b82f6',
                  bg: 'blue',
                  title: 'Order History',
                  desc: 'View your past orders',
                },
                {
                  icon: 'heart',
                  color: '#8b5cf6',
                  bg: 'purple',
                  title: 'Favorites',
                  desc: 'Your favorite dishes',
                },
                {
                  icon: 'location',
                  color: '#10b981',
                  bg: 'green',
                  title: 'Addresses',
                  desc: 'Manage delivery addresses',
                },
                {
                  icon: 'card',
                  color: '#f59e0b',
                  bg: 'yellow',
                  title: 'Payment Methods',
                  desc: 'Manage payment options',
                },
                {
                  icon: 'settings',
                  color: '#6b7280',
                  bg: 'gray',
                  title: 'Settings',
                  desc: 'App preferences',
                },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center px-6 py-5 ${index < 4 ? 'border-b border-gray-100' : ''}`}>
                  <View className={`mr-5 rounded-2xl bg-${item.bg}-100 p-3`}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                    <Text className="font-medium text-gray-500">{item.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
