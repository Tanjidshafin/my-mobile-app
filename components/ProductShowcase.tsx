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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockProducts } from 'hooks/mockProducts';
import type { Product } from '../types';

interface ProductShowcaseProps {
  user?: any;
}

export default function ProductShowcase() {
  const user = { name: 'Safin' };
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [animatedValues] = useState(mockProducts.map(() => new Animated.Value(0)));
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  // Animation values
  const filterAnimation = useRef(new Animated.Value(0)).current;
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const categories = ['All', 'Main Course', 'Sushi', 'Burgers', 'Healthy', 'Desserts', 'Asian'];
  const filteredProducts =
    selectedCategory === 'All'
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory);
  useEffect(() => {
    Animated.stagger(
      100,
      filteredProducts.map((_, index) =>
        Animated.spring(animatedValues[index], {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      )
    ).start();
    mockProducts.forEach((product, index) => {
      if (!filteredProducts.some((p) => p.id === product.id)) {
        animatedValues[index].setValue(0);
      }
    });
  }, [filteredProducts]);

  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: showCategoryDropdown ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [showCategoryDropdown]);

  const handleProductPress = (product: Product, index: number) => {
    if (!user) {
      //   router.push('/login');
      return;
    }
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues[index], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    // router.push(`/product/${product.id}`);
  };
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    animatedValues.forEach((value) => value.setValue(0));
    Animated.timing(filterAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      filterAnimation.setValue(0);
    });
  };
  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const translateY = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateY }],
          marginBottom: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleProductPress(product, index)}
          className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <View className="relative">
            <Image source={{ uri: product.image }} className="h-56 w-full object-cover" />
            <View className="absolute left-3 top-3 flex-row space-x-2">
              {product.isVegetarian && (
                <View className="rounded-full bg-green-500 px-3 py-1.5 shadow-md">
                  <Text className="text-xs font-bold text-white">VEG</Text>
                </View>
              )}
              {product.isSpicy && (
                <View className="rounded-full bg-red-500 px-3 py-1.5 shadow-md">
                  <Text className="text-xs font-bold text-white">SPICY</Text>
                </View>
              )}
            </View>
            <View className="absolute right-3 top-3 flex-row items-center rounded-full bg-black/70 px-3 py-1.5 shadow-md">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text className="ml-1 text-xs font-bold text-white">{product.rating}</Text>
            </View>
            <View className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 shadow-md">
              <Text className="text-xs font-bold text-gray-800">{product.category}</Text>
            </View>
          </View>
          <View className="space-y-3 p-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="mb-1 text-xl font-bold text-gray-800">{product.name}</Text>
                <Text className="text-sm leading-5 text-gray-600">{product.description}</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#f97316" />
                <Text className="ml-1 text-xs font-medium text-gray-600">
                  {product.cookingTime}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="text-2xl font-extrabold text-orange-500">${product.price}</Text>
                <Text className="text-xs font-medium text-gray-500">per serving</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleProductPress(product, index)}
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 shadow-lg">
                <Text className="font-bold text-white">
                  {user ? 'View Details' : 'Login to View'}
                </Text>
              </TouchableOpacity>
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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-8 shadow-lg">
        <Text className="mb-2 text-center text-3xl font-extrabold text-orange-500">
          Our Signature Dishes
        </Text>
        <Text className="text-center text-lg font-medium text-orange-500/90">
          Crafted with passion, served with love
        </Text>
      </View>
      <View className="flex-row items-center justify-between bg-white px-5 py-4 shadow-md">
        <Text className="text-lg font-bold text-gray-800">
          {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
        </Text>
        <TouchableOpacity
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          className="flex-row items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
          <Text className="mr-2 font-semibold text-orange-600">Categories</Text>
          <Animated.View style={{ transform: [{ rotate: dropdownIconRotation }] }}>
            <Ionicons name="chevron-down" size={18} color="#ea580c" />
          </Animated.View>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={showCategoryDropdown}
          animationType="fade"
          onRequestClose={() => setShowCategoryDropdown(false)}>
          <Pressable onPress={() => setShowCategoryDropdown(false)} className="flex-1 bg-black/30">
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: dropdownAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
                opacity: dropdownAnimation,
              }}
              className="absolute right-5 top-24 w-48 rounded-2xl bg-white p-2 shadow-xl">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleCategoryChange(category)}
                  className={`mb-1 rounded-xl px-4 py-3 ${
                    selectedCategory === category ? 'bg-orange-100' : 'bg-white'
                  }`}>
                  <Text
                    className={`font-semibold ${selectedCategory === category ? 'text-orange-600' : 'text-gray-700'}`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
      <ScrollView className="flex-1 px-4 py-6">
        <View>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </View>
        {filteredProducts.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <View className="rounded-full bg-orange-50 p-6">
              <Ionicons name="restaurant" size={64} color="#f97316" />
            </View>
            <Text className="mt-6 text-xl font-bold text-gray-700">No dishes found</Text>
            <Text className="mt-2 max-w-xs text-center text-gray-500">
              We couldn't find any dishes in this category. Try selecting a different one.
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedCategory('All')}
              className="mt-6 rounded-full bg-orange-500 px-6 py-3 shadow-md">
              <Text className="font-bold text-white">View All Dishes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
