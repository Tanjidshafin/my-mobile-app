'use client';

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockProducts } from 'hooks/mockProducts';
import { useUser } from '../context/UserContext';
import type { Product } from '../types';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProductDetails() {
  const { user, redeemPoints, calculateDiscount, addPoints } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [heartAnimated] = useState(new Animated.Value(1));
  const [isLiked, setIsLiked] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    const foundProduct = mockProducts.find((p) => p._id === id);
    setProduct(foundProduct || null);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    Animated.sequence([
      Animated.timing(heartAnimated, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnimated, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = () => {
    if (!product || !user) return;

    const basePrice = product.price * quantity;
    const discountInfo = calculateDiscount(basePrice, pointsToUse);
    if (pointsToUse > 0) {
      const success = redeemPoints(discountInfo.pointsUsed);
      if (!success) {
        Alert.alert('Insufficient Points', "You don't have enough points for this discount.");
        return;
      }
    }

    const earnedPoints = Math.floor(discountInfo.finalPrice * 0.05 * 10);
    addPoints(earnedPoints);
    Alert.alert(
      'Added to Cart!',
      `${product.name} x${quantity} added to cart!\n` +
        `Final Price: $${discountInfo.finalPrice.toFixed(2)}\n` +
        `Points Used: ${discountInfo.pointsUsed}\n` +
        `Points Earned: ${earnedPoints}`,
      [{ text: 'Continue Shopping', onPress: () => navigation.navigate('Home') }]
    );
  };

  const maxPointsUsable = user
    ? Math.min(user.points, Math.floor(product?.price || 0 * quantity * 5))
    : 0;

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <View className="items-center justify-center rounded-3xl bg-white p-12 shadow-2xl">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <Ionicons name="restaurant" size={48} color="#64748b" />
          </View>
          <Text className="text-xl font-bold text-slate-700">Product not found</Text>
          <Text className="mt-2 text-slate-500">The item you're looking for doesn't exist</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            className="mt-6 rounded-2xl bg-orange-500 px-8 py-3">
            <Text className="font-bold text-white">Go Back Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const basePrice = product.price * quantity;
  const discountInfo = calculateDiscount(basePrice, pointsToUse);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-slate-50">
      <Animated.View
        style={{ opacity: headerOpacity }}
        className="absolute left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <View className="flex-row items-center justify-between px-6 py-4 pt-12">
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleLike}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
            <Animated.View style={{ transform: [{ scale: heartAnimated }] }}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#ef4444' : '#64748b'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View className="absolute left-6 top-12 z-40">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg backdrop-blur-md">
          <Ionicons name="arrow-back" size={22} color="#334155" />
        </TouchableOpacity>
      </View>
      <View className="absolute right-6 top-12 z-40">
        <TouchableOpacity
          onPress={handleLike}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg backdrop-blur-md">
          <Animated.View style={{ transform: [{ scale: heartAnimated }] }}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? '#ef4444' : '#64748b'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}>
        <View className="relative h-96 overflow-hidden">
          <Animated.Image
            source={{ uri: product.image }}
            className="h-full w-full object-cover"
            style={{ transform: [{ scale: imageScale }] }}
          />
          <View className="absolute bottom-10 left-6 space-y-3">
            {product.isVegetarian && (
              <View className="flex-row items-center rounded-2xl bg-emerald-500/90 px-4 py-2 shadow-lg backdrop-blur-md">
                <Text className="text-lg">🌱</Text>
                <Text className="ml-2 font-bold text-white">Vegetarian</Text>
              </View>
            )}
            {product.isSpicy && (
              <View className="flex-row items-center rounded-2xl bg-red-500/90 px-4 py-2 shadow-lg backdrop-blur-md">
                <Text className="text-lg">🌶️</Text>
                <Text className="ml-2 font-bold text-white">Spicy</Text>
              </View>
            )}
          </View>
          <View className="absolute bottom-10 right-6">
            <View className="flex-row items-center rounded-2xl bg-amber-500/90 px-4 py-2 shadow-lg backdrop-blur-md">
              <Ionicons name="star" size={18} color="white" />
              <Text className="ml-2 font-bold text-white">{product.rating}</Text>
            </View>
          </View>
          <View className="absolute -bottom-1 left-0 right-0 h-8 rounded-t-3xl bg-slate-50" />
        </View>
        <View className="bg-slate-50 px-6 pb-32">
          <View className="-mt-4 mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <Text className="mb-3 text-3xl font-black text-slate-800">{product.name}</Text>
            <Text className="mb-6 text-lg leading-7 text-slate-600">{product.description}</Text>
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-4xl font-black text-orange-500">
                  ${product.price.toFixed(2)}
                </Text>
                <Text className="text-slate-500">per serving</Text>
              </View>
              <View className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2">
                <Text className="font-bold text-orange-600">{product.category}</Text>
              </View>
            </View>
          </View>
          <View className="mb-6 flex-row space-x-4">
            <View className="flex-1 items-center rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/30">
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <Ionicons name="time" size={24} color="#3b82f6" />
              </View>
              <Text className="font-bold text-slate-800">{product.cookingTime}</Text>
              <Text className="text-sm text-slate-500">Cook Time</Text>
            </View>
            <View className="flex-1 items-center rounded-2xl bg-white p-4 shadow-lg shadow-slate-200/30">
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                <Ionicons name="star" size={24} color="#f59e0b" />
              </View>
              <Text className="font-bold text-slate-800">{product.rating}</Text>
              <Text className="text-sm text-slate-500">Rating</Text>
            </View>
          </View>
          <View className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                <Ionicons name="leaf" size={18} color="#10b981" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Fresh Ingredients</Text>
            </View>

            <View className="flex-row flex-wrap">
              {product.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="mb-3 mr-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                  <Text className="font-semibold text-slate-700">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
                <Ionicons name="calculator" size={18} color="#8b5cf6" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Quantity</Text>
            </View>

            <View className="flex-row items-center justify-center gap-5 space-x-6">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-14 w-14 items-center justify-center rounded-full bg-slate-100 shadow-md">
                <Ionicons name="remove" size={24} color="#475569" />
              </TouchableOpacity>

              <View className="h-16 w-20 items-center justify-center rounded-2xl border-2 border-orange-200 bg-orange-50">
                <Text className="text-3xl font-black text-orange-600">{quantity}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
                  <Ionicons name="diamond" size={18} color="#8b5cf6" />
                </View>
                <Text className="text-xl font-bold text-slate-800">Reward Points</Text>
              </View>
              <View className="flex-row items-center rounded-2xl bg-purple-500 px-4 py-2 shadow-md">
                <Ionicons name="star" size={16} color="white" />
                <Text className="ml-2 font-bold text-white">{user?.points || 0}</Text>
              </View>
            </View>
            <Text className="mb-4 text-slate-600">
              Use up to {maxPointsUsable} points for instant savings
            </Text>
            <View className="mb-4 flex-row items-center gap-3 space-x-4">
              <TouchableOpacity
                onPress={() => setPointsToUse(Math.max(0, pointsToUse - 10))}
                className="h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 shadow-md">
                <Ionicons name="remove" size={20} color="#8b5cf6" />
              </TouchableOpacity>
              <View className="flex-1 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                <Text className="text-center text-2xl font-bold text-purple-600">
                  {pointsToUse}
                </Text>
                <Text className="text-center text-sm text-purple-500">
                  points = ${(pointsToUse * 0.1).toFixed(2)} off
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPointsToUse(Math.min(maxPointsUsable, pointsToUse + 10))}
                className="h-12 w-12 items-center justify-center rounded-2xl bg-purple-500 shadow-lg">
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setPointsToUse(maxPointsUsable)}
              className="rounded-2xl bg-purple-500 py-3 shadow-lg">
              <Text className="text-center font-bold text-white">Use All Available Points</Text>
            </TouchableOpacity>
          </View>
          <View className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <Ionicons name="receipt" size={18} color="#3b82f6" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Order Summary</Text>
            </View>
            <View className="space-y-3">
              <View className="flex-row justify-between pb-1">
                <Text className="text-slate-600">Subtotal ({quantity}x)</Text>
                <Text className="font-bold text-slate-800">${basePrice.toFixed(2)}</Text>
              </View>
              {pointsToUse > 0 && (
                <View className="flex-row justify-between pb-1">
                  <Text className="text-purple-600">
                    Points Discount ({discountInfo.pointsUsed} pts)
                  </Text>
                  <Text className="font-bold text-purple-600">
                    -${discountInfo.discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View className="border-t border-slate-200 pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-2xl font-black text-slate-800">Total</Text>
                  <Text className="text-2xl font-black text-orange-500">
                    ${discountInfo.finalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <Text className="text-center font-semibold text-emerald-700">
                  🎉 You'll earn {Math.floor(discountInfo.finalPrice * 0.05 * 10)} points!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="rounded-3xl bg-orange-500 py-5 shadow-2xl shadow-orange-500/30">
          <View className="flex-row items-center justify-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <Ionicons name="bag-add" size={20} color="white" />
            </View>
            <Text className="text-xl font-black text-white">
              Add to Cart • ${discountInfo.finalPrice.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>

        {pointsToUse > 0 && (
          <Text className="mt-2 text-center text-sm font-semibold text-purple-600">
            💎 Saving ${discountInfo.discount.toFixed(2)} with {discountInfo.pointsUsed} points
          </Text>
        )}
      </View>
    </View>
  );
}
