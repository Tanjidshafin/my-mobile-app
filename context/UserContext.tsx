'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  addPoints: (points: number) => void;
  redeemPoints: (points: number) => boolean;
  calculateDiscount: (
    price: number,
    pointsToUse: number
  ) => { discount: number; finalPrice: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    points: 245,
    avatar: '/placeholder.svg?height=100&width=100',
  });

  const addPoints = (points: number) => {
    if (user) {
      setUser({ ...user, points: user.points + points });
    }
  };

  const redeemPoints = (points: number): boolean => {
    if (user && user.points >= points) {
      setUser({ ...user, points: user.points - points });
      return true;
    }
    return false;
  };

  const calculateDiscount = (price: number, pointsToUse: number) => {
    const pointValue = 0.1;
    const maxPointsUsable = Math.min(pointsToUse, user?.points || 0);
    const maxDiscountAllowed = price * 0.5; 
    const potentialDiscount = maxPointsUsable * pointValue;
    const actualDiscount = Math.min(potentialDiscount, maxDiscountAllowed);
    const finalPrice = Math.max(price - actualDiscount, price * 0.5);

    return {
      discount: actualDiscount,
      finalPrice: finalPrice,
      pointsUsed: Math.ceil(actualDiscount / pointValue),
    };
  };

  return (
    <UserContext.Provider value={{ user, setUser, addPoints, redeemPoints, calculateDiscount }}>
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
