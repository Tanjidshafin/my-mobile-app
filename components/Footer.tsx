'use client';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Footer() {
  const socialLinks = [
    { name: 'logo-facebook' as const, url: 'https://facebook.com' },
    { name: 'logo-instagram' as const, url: 'https://instagram.com' },
    { name: 'logo-twitter' as const, url: 'https://twitter.com' },
  ];

  const quickLinks = [
    { title: 'About Us', route: '/about' },
    { title: 'Menu', route: '/menu' },
    { title: 'Contact', route: '/contact' },
    { title: 'Privacy Policy', route: '/privacy' },
  ];

  return (
    <View className="mt-8 bg-gray-900 px-6 py-7">
      {/* Main Footer Content */}
      <View className="space-y-6">
        {/* Brand Section */}
        <View className="items-center space-y-3 pb-5">
          <View className="rounded-full bg-orange-500 p-3">
            <Ionicons name="restaurant" size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white">FoodieHub</Text>
          <Text className="max-w-xs text-center text-gray-400">
            Bringing you the finest culinary experiences with every bite
          </Text>
        </View>

        {/* Quick Links */}
        <View className="space-y-3 pb-5">
          <Text className="text-center text-lg font-semibold text-white">Quick Links</Text>
          <View className="flex-row flex-wrap justify-center gap-3 space-x-4">
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                // onPress={() => router.push(link.route as any)}
                className="py-2">
                <Text className="text-gray-300 transition-colors hover:text-orange-400">
                  {link.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View className="space-y-3 pb-5">
          <Text className="text-center text-lg font-semibold text-white">Contact Us</Text>
          <View className="space-y-2">
            <View className="flex-row items-center justify-center space-x-2">
              <Ionicons name="location" size={16} color="#f97316" />
              <Text className="text-gray-300">123 Food Street, Culinary City</Text>
            </View>
            <View className="flex-row items-center justify-center space-x-2">
              <Ionicons name="call" size={16} color="#f97316" />
              <Text className="text-gray-300">+1 (555) 123-4567</Text>
            </View>
            <View className="flex-row items-center justify-center space-x-2">
              <Ionicons name="mail" size={16} color="#f97316" />
              <Text className="text-gray-300">hello@foodiehub.com</Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        <View className="space-y-3 pb-5">
          <Text className="mb-2 text-center text-lg font-semibold text-white">Follow Us</Text>
          <View className="flex-row justify-center gap-3 space-x-4">
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(social.url)}
                className="rounded-full bg-gray-800 p-3 transition-colors hover:bg-orange-500">
                <Ionicons name={social.name} size={20} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Newsletter Signup */}
        <View className="space-y-3 rounded-2xl bg-gray-800 p-4 pb-5">
          <Text className="text-center text-lg font-semibold text-white">Stay Updated</Text>
          <Text className="my-2 text-center text-sm text-gray-400">
            Get the latest updates on new dishes and special offers
          </Text>
          <TouchableOpacity className="self-center rounded-full bg-orange-500 px-6 py-3">
            <Text className="font-semibold text-white">Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="mt-8 border-t border-gray-700 pt-6">
        <Text className="text-center text-sm text-gray-400">
          © 2025 FoodieHub. All rights reserved.
        </Text>
        <Text className="mt-1 text-center text-xs text-gray-500">Made with ❤️ for food lovers</Text>
      </View>
    </View>
  );
}
