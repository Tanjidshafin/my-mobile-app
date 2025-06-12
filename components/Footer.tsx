"use client"

import { View, Text, TouchableOpacity, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function EnhancedFooter() {
  const socialLinks = [
    { name: "logo-facebook" as const, url: "https://facebook.com" },
    { name: "logo-instagram" as const, url: "https://instagram.com" },
    { name: "logo-twitter" as const, url: "https://twitter.com" },
  ]

  const quickLinks = [
    { title: "About Us", route: "/about" },
    { title: "Menu", route: "/menu" },
    { title: "Contact", route: "/contact" },
    { title: "Privacy Policy", route: "/privacy" },
  ]

  return (
    <View className="mt-8 bg-gray-900 px-6 py-8 relative overflow-hidden">
      <View className="space-y-8">
        <View className="items-center space-y-4 pb-6">
            <View className="rounded-full bg-orange-500 p-4 shadow-xl">
              <Ionicons name="restaurant" size={36} color="white" />
            </View>
          <View className="items-center space-y-2">
            <Text className="text-3xl font-extrabold text-white my-1 tracking-wide">FoodieHub</Text>
            <Text className="text-orange-300 font-medium tracking-wider">Delicious Moments</Text>
            <View className="w-16 h-0.5 bg-orange-500 rounded-full my-1 mt-2" />
          </View>
          <Text className="max-w-xs text-center text-gray-300 leading-relaxed">
            Bringing you the finest culinary experiences with every bite
          </Text>
        </View>
        <View className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <Text className="text-center text-xl font-bold text-white mb-4">Quick Links</Text>
          <View className="flex-row flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-700/50 rounded-xl px-4 py-2.5 border border-gray-600/30"
              >
                <Text className="text-gray-200 font-medium">{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="bg-gray-800/50 rounded-2xl p-6 my-5 border border-gray-700/50">
          <Text className="text-center text-xl font-bold text-white mb-5">Contact Us</Text>
          <View className="space-y-4 flex-col gap-2">
            <View className="flex-row items-center justify-center space-x-3 bg-gray-700/30 rounded-xl p-3 gap-2">
              <View className="bg-orange-500 rounded-full p-2">
                <Ionicons name="location" size={16} color="white" />
              </View>
              <Text className="text-gray-200 font-medium">123 Food Street, Culinary City</Text>
            </View>
            <View className="flex-row items-center justify-center space-x-3 bg-gray-700/30 rounded-xl p-3 gap-2">
              <View className="bg-orange-500 rounded-full p-2">
                <Ionicons name="call" size={16} color="white" />
              </View>
              <Text className="text-gray-200 font-medium">+1 (555) 123-4567</Text>
            </View>
            <View className="flex-row items-center justify-center space-x-3 bg-gray-700/30 rounded-xl p-3 gap-2">
              <View className="bg-orange-500 rounded-full p-2">
                <Ionicons name="mail" size={16} color="white" />
              </View>
              <Text className="text-gray-200 font-medium">hello@foodiehub.com</Text>
            </View>
          </View>
        </View>

        <View className="items-center space-y-4">
          <Text className="text-xl font-bold mb-5 text-white">Follow Us</Text>
          <View className="flex-row justify-center gap-4">
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(social.url)}
                className="bg-gray-800 rounded-2xl p-4 border-2 border-gray-700 shadow-lg active:scale-95"
              >
                <Ionicons name={social.name} size={24} color="#f97316" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="bg-orange-500/10 mt-5 rounded-3xl p-6 border-2 border-orange-500/20">
          <View className="items-center space-y-4">
            <View className="bg-orange-500 rounded-full p-3">
              <Ionicons name="notifications" size={24} color="white" />
            </View>
            <Text className="text-xl font-bold text-white">Stay Updated</Text>
            <Text className="text-center my-2 text-gray-300 leading-relaxed">
              Get the latest updates on new dishes and special offers
            </Text>
            <TouchableOpacity className="bg-orange-500 rounded-2xl px-8 py-4 shadow-xl border-2 border-orange-400">
              <Text className="font-bold text-white text-lg">Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="mt-10 pt-6 border-t-2 border-gray-700/50">
        <View className="items-center space-y-2">
          <Text className="text-gray-400 font-medium">
            © 2025 FoodieHub. All rights reserved.
          </Text>
          <Text className="text-gray-500 text-sm">Made with ❤️ for food lovers</Text>
        </View>
      </View>
    </View>
  )
}
