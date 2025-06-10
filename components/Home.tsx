import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import ProductShowcase from './ProductShowcase';
const Home = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <ProductShowcase />
    </View>
  );
};

export default Home;
