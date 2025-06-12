'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, pointsAPI } from 'services/api';

interface User {
  _id: string;
  email: string;
  name: string;
  points: number;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<boolean>;
  addPoints: (points: number, reason?: string) => Promise<boolean>;
  redeemPoints: (points: number, reason?: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  calculateDiscount: (
    price: number,
    pointsToUse: number
  ) => { discount: number; finalPrice: number; pointsUsed: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        const response = await authAPI.getProfile(storedToken);
        if (response.user) {
          setUser(response.user);
        } else {
          await AsyncStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        await AsyncStorage.setItem('authToken', response.token);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        await AsyncStorage.setItem('authToken', response.token);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
  };
  const updateProfile = async (data: { name?: string; avatar?: string }) => {
    if (!token) return false;
    try {
      const response = await authAPI.updateProfile(data);
      if (response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };
  const addPoints = async (points: number, reason?: string) => {
    if (!token) return false;
    try {
      const response = await pointsAPI.add(token, points, reason);
      if (response.points !== undefined) {
        setUser((prev) => (prev ? { ...prev, points: response.points } : null));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add points error:', error);
      return false;
    }
  };
  const redeemPoints = async (points: number, reason?: string) => {
    const validPoints = Number(points);
    if (isNaN(validPoints) || validPoints <= 0) {
      console.error('Invalid points value:', points);
      return false;
    }
    if (!user || (user.points || 0) < validPoints) {
      console.error('Insufficient points:', user?.points, 'needed:', validPoints);
      return false;
    }
    try {
      const response = await pointsAPI.redeem(validPoints, reason);
      if (response.points !== undefined && !isNaN(response.points)) {
        setUser((prev) => (prev ? { ...prev, points: Number(response.points) } : null));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Redeem points error:', error);
      return false;
    }
  };
  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await authAPI.getProfile(token);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };
  const calculateDiscount = (price: number, pointsToUse: number) => {
    const validPrice = Number(price);
    const validPointsToUse = Number(pointsToUse);

    if (isNaN(validPrice) || isNaN(validPointsToUse) || validPrice <= 0) {
      console.error('Invalid calculation inputs:', { price, pointsToUse });
      return {
        discount: 0,
        finalPrice: validPrice || 0,
        pointsUsed: 0,
      };
    }
    const pointValue = 0.1;
    const userPoints = user?.points || 0;
    const maxPointsUsable = Math.min(validPointsToUse, userPoints);
    const maxDiscountAllowed = validPrice * 0.5;
    const potentialDiscount = maxPointsUsable * pointValue;
    const actualDiscount = Math.min(potentialDiscount, maxDiscountAllowed);
    const finalPrice = Math.max(validPrice - actualDiscount, validPrice * 0.5);
    const pointsUsed = Math.ceil(actualDiscount / pointValue);
    if (isNaN(actualDiscount) || isNaN(finalPrice) || isNaN(pointsUsed)) {
      console.error('Invalid calculation outputs:', { actualDiscount, finalPrice, pointsUsed });
      return {
        discount: 0,
        finalPrice: validPrice,
        pointsUsed: 0,
      };
    }

    return {
      discount: actualDiscount,
      finalPrice: finalPrice,
      pointsUsed: pointsUsed,
    };
  };
  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addPoints,
        redeemPoints,
        refreshUser,
        calculateDiscount,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
