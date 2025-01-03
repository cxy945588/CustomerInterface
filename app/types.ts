import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Cart: {
    cartItems: CartItem[];
    storeName: string;
  };
  Checkout: {
    cartItems: CartItem[];
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  expiryDate: Date;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  image: string;
  products: Product[];
}
