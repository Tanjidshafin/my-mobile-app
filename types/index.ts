export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  cookingTime: string;
  ingredients: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  avatar?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
