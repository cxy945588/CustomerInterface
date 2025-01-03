import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Title, Paragraph, Button, Text, Divider, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, RootStackParamList, CartItem } from '../types';

type CartScreenRouteProp = RouteProp<RootStackParamList, 'Cart'>;

interface CartScreenHeaderProps {
  storeName: string;
}

const CartScreenHeader: React.FC<CartScreenHeaderProps> = ({ storeName }) => (
  <View style={styles.headerContainer}>
    <StatusBar style="light" />
    <LinearGradient
      colors={['#FF5E62','#FF5E62']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={StyleSheet.absoluteFillObject}
    />
    <SafeAreaView style={styles.headerSafeArea}>
      <View style={styles.header}>
        <Ionicons name="cart-outline" size={28} color="white" style={styles.headerIcon} />
        <View>
          <Title style={styles.headerTitle}>購物車</Title>
          {storeName && <Text style={styles.storeName}>{storeName}</Text>}
        </View>
      </View>
    </SafeAreaView>
  </View>
);

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CartScreenRouteProp>();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeName, setStoreName] = useState<string>('');

  useEffect(() => {
    if (route.params) {
      const { cartItems: initialCartItems, storeName: initialStoreName } = route.params;
      setCartItems(initialCartItems);
      setStoreName(initialStoreName);
    }
  }, [route.params]);

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalSavings = (): number => {
    return cartItems.reduce((total, item) =>
      total + (item.originalPrice - item.price) * item.quantity, 0);
  };

  const updateQuantity = (id: string, newQuantity: number): void => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const renderCartItem: ListRenderItem<CartItem> = ({ item }) => (
    <Card style={styles.cartItemCard}>
      <View style={styles.cartItemContent}>
        <Image source={{ uri: item.image }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Title style={styles.cartItemTitle}>{item.name}</Title>
          <Paragraph style={styles.cartItemPrice}>
            <Text style={styles.discountPrice}>${item.price} </Text>
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          </Paragraph>
          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            />
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <CartScreenHeader storeName={storeName} />
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        style={styles.cartList}
        ListEmptyComponent={
          <Text style={styles.emptyCartText}>購物車是空的</Text>
        }
      />
      <View style={styles.summaryContainer}>
        <Divider />
        <View style={styles.summaryRow}>
          <Text>總計</Text>
          <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>節省</Text>
          <Text style={styles.savings}>${getTotalSavings().toFixed(2)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {
            console.log('Proceeding to checkout');
            navigation.navigate('Checkout', { cartItems: cartItems });
          }}
          style={styles.checkoutButton}
          disabled={cartItems.length === 0}
        >
          前往結帳
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 150,
  },
  headerSafeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  storeName: {
    color: 'white',
    fontSize: 18,
    opacity: 0.8,
  },
  cartList: {
    flex: 1,
  },
  cartItemCard: {
    margin: 8,
    elevation: 4,
  },
  cartItemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#FF5E62',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 16,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  savings: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 16,
    backgroundColor: '#FF5E62',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5E62',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
    marginLeft: 8,
  },
});

export default CartScreen;