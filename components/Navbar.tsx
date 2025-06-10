import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Navbar = () => {
  return (
    <View className="bg-[#e91e63] px-4 pb-4 pt-10">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={28} color="white" />
          <View className="ml-2">
            <Text className="text-2xl font-bold text-white">Birinchi Road</Text>
            <Text className="text-lg text-white">Feni</Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="ml-5">
            <Ionicons name="heart-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-5">
            <MaterialIcons name="shopping-basket" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-12 flex-row items-center rounded-full bg-white px-4">
        <Ionicons name="search" size={24} color="#777" className="mr-2" />
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Search for restaurants and groceries"
          placeholderTextColor="#777"
        />
      </View>
    </View>
  );
};

export default Navbar;
