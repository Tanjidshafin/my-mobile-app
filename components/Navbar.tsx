'use client';

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { productsAPI } from 'services/api';
import type { Product } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
  ProductDetails: { id: string };
};
export default function EnhancedNavbar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [searchAnimated] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchProducts(searchQuery.trim());
      setShowSearchResults(true);
      Animated.timing(searchAnimated, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      Animated.timing(searchAnimated, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [searchQuery]);

  const searchProducts = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await productsAPI.getAll();
      if (response) {
        const filtered = response.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(query.toLowerCase())
            )
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const handleProductPress = (product: Product) => {
    setSearchQuery('');
    setShowSearchResults(false);
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('ProductDetails', { id: product._id });
  };

  const handleLogoPress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('Home');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const logoScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const searchOpacity = searchAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const searchTranslateY = searchAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View className="relative">
      <View className="border-b border-gray-100 bg-white px-4 py-3 pt-12 shadow-lg">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={handleLogoPress} className="flex-row items-center">
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <View className="mr-3 rounded-full bg-orange-500 p-3 shadow-md">
                <Ionicons name="restaurant" size={28} color="white" />
              </View>
            </Animated.View>
            <View>
              <Text className="text-2xl font-bold text-gray-800">FoodieHub</Text>
              <Text className="text-sm font-medium text-orange-500">Delicious Moments</Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-3">
            {user ? (
              <View className="flex-row items-center gap-2 space-x-3">
                <View className="flex-row items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
                  <View className="mr-2 rounded-full bg-orange-500 p-1">
                    <Ionicons name="star" size={14} color="white" />
                  </View>
                  <Text className="text-sm font-bold text-orange-600">{user.points || 0}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  className="rounded-full border border-gray-200 bg-gray-100 p-3">
                  <Ionicons name="person" size={20} color="#f97316" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logout()} className="rounded-full bg-red-100 p-3">
                  <Ionicons name="log-out-outline" size={20} color="#dc2626" />{' '}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="rounded-xl bg-orange-500 px-6 py-3 shadow-md">
                <Text className="font-semibold text-white">Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="relative">
          <View className="flex-row items-center rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-1 focus:border-orange-300">
            <View className="mr-3 rounded-full bg-orange-100 p-2">
              <Ionicons name="search" size={18} color="#f97316" />
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for delicious food..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base font-medium text-gray-800"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="ml-2 rounded-full bg-gray-200 p-1">
                <Ionicons name="close" size={16} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          {isSearching && (
            <View className="absolute right-16 top-1/2 -translate-y-1/2 transform">
              <View className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            </View>
          )}
        </View>
      </View>
      {showSearchResults && (
        <Animated.View
          style={{
            opacity: searchOpacity,
            transform: [{ translateY: searchTranslateY }],
          }}
          className="absolute left-0 right-0 top-full z-50 max-h-96 border-t border-gray-100 bg-white shadow-2xl">
          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            {searchResults.length > 0 ? (
              <View className="p-4">
                <Text className="mb-3 text-sm font-medium text-gray-500">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "
                  {searchQuery}"
                </Text>

                {searchResults.map((product) => (
                  <TouchableOpacity
                    key={product._id}
                    onPress={() => handleProductPress(product)}
                    className="mb-2 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-3">
                    {/* Product Image */}
                    <View className="relative">
                      <Image
                        source={{ uri: product.image }}
                        className="h-16 w-16 rounded-xl bg-gray-200"
                      />
                      {product.isVegetarian && (
                        <View className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
                          <Text className="text-xs text-white">🌱</Text>
                        </View>
                      )}
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
                        {product.description}
                      </Text>

                      <View className="mt-2 flex-row items-center">
                        <View className="mr-2 rounded-full bg-orange-100 px-2 py-1">
                          <Text className="text-xs font-semibold text-orange-600">
                            {product.category}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <Ionicons name="star" size={12} color="#fbbf24" />
                          <Text className="ml-1 text-xs text-gray-600">{product.rating}</Text>
                        </View>

                        <View className="ml-3 flex-row items-center">
                          <Ionicons name="time" size={12} color="#6b7280" />
                          <Text className="ml-1 text-xs text-gray-600">{product.cookingTime}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Price */}
                    <View className="items-end">
                      <Text className="text-lg font-bold text-orange-500">${product.price}</Text>
                      {product.isSpicy && (
                        <View className="mt-1 rounded-full bg-red-100 px-2 py-1">
                          <Text className="text-xs text-red-600">Spicy</Text>
                        </View>
                      )}
                    </View>

                    {/* Arrow */}
                    <View className="ml-3">
                      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : searchQuery.length > 0 && !isSearching ? (
              <View className="items-center p-8">
                <View className="mb-4 rounded-full bg-gray-100 p-4">
                  <Ionicons name="search" size={32} color="#9ca3af" />
                </View>
                <Text className="text-lg font-semibold text-gray-500">No results found</Text>
                <Text className="mt-2 text-center text-gray-400">
                  Try searching for different keywords or check the spelling
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>
      )}

      {/* Backdrop for search results */}
      {showSearchResults && (
        <TouchableOpacity
          onPress={clearSearch}
          className="absolute bottom-0 left-0 right-0 top-full z-40 bg-black/20"
          style={{ height: 1000 }}
        />
      )}
    </View>
  );
}
