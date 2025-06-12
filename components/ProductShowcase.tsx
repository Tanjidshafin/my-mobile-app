'use client';

import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Pressable,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productsAPI } from 'services/api';
import type { Product } from '../types';
import { useUser } from 'context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ProductShowcaseProps {
  user?: any;
}
type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
  ProductDetails: { id: string };
};
export default function ProductShowcase() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Animation values
  const filterAnimation = useRef(new Animated.Value(0)).current;
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const categories = ['All', 'Main Course', 'Sushi', 'Burgers', 'Healthy', 'Desserts', 'Asian'];

  // Initialize header animation
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        if (response && Array.isArray(response)) {
          setProducts(response);
          setAnimatedValues(response.map(() => new Animated.Value(0)));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  useEffect(() => {
    if (animatedValues.length > 0) {
      Animated.stagger(
        150,
        filteredProducts.map((_, index) =>
          Animated.spring(animatedValues[index], {
            toValue: 1,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          })
        )
      ).start();
      products.forEach((product, index) => {
        if (!filteredProducts.some((p) => p._id === product._id)) {
          animatedValues[index]?.setValue(0);
        }
      });
    }
  }, [filteredProducts, animatedValues]);

  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: showCategoryDropdown ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [showCategoryDropdown]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    animatedValues.forEach((value) => value?.setValue(0));
    Animated.timing(filterAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      filterAnimation.setValue(0);
    });
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const animatedValue = animatedValues[index];
    if (!animatedValue) return null;

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
          marginBottom: 24,
        }}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => {
            navigation.navigate('ProductDetails', { id: product._id });
          }}
          className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          <View className="relative">
            <Image source={{ uri: product.image }} className="h-64 w-full object-cover" />
            <View className="absolute inset-0 bg-black/10" />
            {/* Top badges */}
            <View className="absolute left-4 top-4 flex-row space-x-2">
              {product.isVegetarian && (
                <View className="rounded-full border-2 border-white bg-green-500 px-3 py-2 shadow-lg">
                  <Text className="text-xs font-bold text-white">VEG</Text>
                </View>
              )}
              {product.isSpicy && (
                <View className="rounded-full border-2 border-white bg-red-500 px-3 py-2 shadow-lg">
                  <Text className="text-xs font-bold text-white">SPICY</Text>
                </View>
              )}
            </View>

            {/* Rating badge */}
            <View className="absolute right-4 top-4 flex-row items-center rounded-full bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text className="ml-1 text-sm font-bold text-gray-800">{product.rating}</Text>
            </View>

            {/* Category badge */}
            <View className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-4 py-2 shadow-lg">
              <Text className="text-sm font-bold text-white">{product.category}</Text>
            </View>
          </View>
          <View className="space-y-4 p-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="mb-2 text-2xl font-bold leading-tight text-gray-800">
                  {product.name}
                </Text>
                <Text className="text-base font-medium leading-6 text-gray-600">
                  {product.description}
                </Text>
              </View>
            </View>
            <View className="mt-3 flex-row items-center justify-between rounded-2xl bg-orange-50 p-4">
              <View className="flex-row items-center">
                <View className="mr-3 rounded-full bg-orange-100 p-2">
                  <Ionicons name="time" size={18} color="#f97316" />
                </View>
                <View>
                  <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Prep Time
                  </Text>
                  <Text className="text-sm font-bold text-gray-800">{product.cookingTime}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="mr-3 rounded-full bg-orange-100 p-2">
                  <Ionicons name="people" size={18} color="#f97316" />
                </View>
                <View>
                  <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Serves
                  </Text>
                  <Text className="text-sm font-bold text-gray-800">2-3 people</Text>
                </View>
              </View>
            </View>

            {/* Enhanced Price and Action Section */}
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View className="flex-1">
                <View className="flex-row items-baseline">
                  <Text className="text-3xl font-extrabold text-orange-500">${product.price}</Text>
                  <Text className="ml-2 text-sm font-medium text-gray-500">per serving</Text>
                </View>
                <View className="mt-1 flex-row items-center">
                  <View className="rounded-full bg-green-100 px-2 py-1">
                    <Text className="text-xs font-bold text-green-700">Fresh Today</Text>
                  </View>
                </View>
              </View>

              <View className="ml-4">
                {user ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ProductDetails', { id: product._id });
                    }}
                    className="flex-row items-center rounded-2xl bg-orange-500 px-8 py-4 shadow-lg">
                    <Text className="mr-2 text-base font-bold text-white">View Details</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}
                    className="flex-row items-center rounded-2xl bg-gray-400 px-8 py-4 shadow-lg">
                    <Ionicons name="lock-closed" size={16} color="white" />
                    <Text className="ml-2 text-base font-bold text-white">Login to View</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const dropdownIconRotation = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#f97316" />
        <View className="flex-1 items-center justify-center bg-orange-50">
          <View className="mx-8 items-center justify-center rounded-3xl border border-orange-100 bg-white p-16 shadow-2xl">
            <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-orange-100">
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: headerAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}>
                <Ionicons name="restaurant" size={64} color="#f97316" />
              </Animated.View>
            </View>
            <Text className="mb-3 text-center text-2xl font-bold text-gray-800">
              Loading Delicious Dishes
            </Text>
            <Text className="text-center text-base leading-6 text-gray-500">
              Please wait while we fetch our finest culinary creations
            </Text>
            <View className="mt-6 flex-row space-x-2">
              {[0, 1, 2].map((i) => (
                <View key={i} className="h-2 w-2 animate-pulse rounded-full bg-orange-300" />
              ))}
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />
      <View className="flex-1 bg-orange-50">
        <Animated.View
          style={{ transform: [{ translateY: headerTranslateY }] }}
          className="bg-orange-500 px-6 pb-8 pt-12 shadow-xl">
          <View className="items-center">
            <Text className="mb-3 text-center text-4xl font-bold leading-tight text-white">
              Signature Dishes
            </Text>
            <Text className="text-center text-lg font-medium text-orange-100">
              Crafted with passion, served with love
            </Text>
            <View className="mt-6 flex-row items-center justify-center gap-3 space-x-8">
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{products.length}</Text>
                <Text className="text-sm font-medium text-orange-200">Dishes</Text>
              </View>
              <View className="h-8 w-px bg-white/30" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{categories.length - 1}</Text>
                <Text className="text-sm font-medium text-orange-200">Categories</Text>
              </View>
              <View className="h-8 w-px bg-white/30" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">4.8</Text>
                <Text className="text-sm font-medium text-orange-200">Rating</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Filter Section */}
        <View className="border-b border-orange-100 bg-white px-6 py-6 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">
                Current Selection
              </Text>
              <Text className="text-xl font-bold text-gray-800">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'dish' : 'dishes'}{' '}
                available
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex-row items-center rounded-2xl bg-orange-500 px-6 py-4 shadow-lg">
              <Ionicons name="filter" size={20} color="white" />
              <Text className="ml-2 font-bold text-white">Filter</Text>
              <Animated.View
                style={{ transform: [{ rotate: dropdownIconRotation }] }}
                className="ml-2">
                <Ionicons name="chevron-down" size={18} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Modal */}
        <Modal
          transparent={true}
          visible={showCategoryDropdown}
          animationType="fade"
          onRequestClose={() => setShowCategoryDropdown(false)}>
          <Pressable onPress={() => setShowCategoryDropdown(false)} className="flex-1 bg-black/50">
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: dropdownAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                    }),
                  },
                  {
                    scale: dropdownAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
                opacity: dropdownAnimation,
              }}
              className="absolute right-6 top-40 w-64 rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl">
              <View className="mb-4 border-b border-gray-100 pb-4">
                <Text className="text-center text-lg font-bold text-gray-800">Select Category</Text>
              </View>

              {categories.map((category, index) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleCategoryChange(category)}
                  className={`mb-2 flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                    selectedCategory === category ? 'bg-orange-500' : 'bg-gray-50'
                  }`}>
                  <Text
                    className={`text-base font-semibold ${
                      selectedCategory === category ? 'text-white' : 'text-gray-700'
                    }`}>
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </Pressable>
        </Modal>

        {/* Products List */}
        <ScrollView className="flex-1 px-3 py-6" showsVerticalScrollIndicator={false}>
          <View>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </View>

          {/* Enhanced Empty State */}
          {filteredProducts.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <View className="mb-6 rounded-full bg-orange-100 p-8">
                <Ionicons name="restaurant" size={80} color="#f97316" />
              </View>
              <Text className="mb-3 text-2xl font-bold text-gray-800">No Dishes Found</Text>
              <Text className="mb-8 max-w-xs text-center text-base leading-6 text-gray-500">
                We couldn't find any dishes in the{' '}
                <Text className="font-semibold text-orange-500">{selectedCategory}</Text> category.
                Try exploring other categories.
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCategory('All')}
                className="flex-row items-center rounded-2xl bg-orange-500 px-8 py-4 shadow-lg">
                <Ionicons name="grid" size={20} color="white" />
                <Text className="ml-2 text-base font-bold text-white">View All Dishes</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
