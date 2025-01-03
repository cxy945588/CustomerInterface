import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Text, RadioButton, TextInput, Divider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, RootStackParamList, CartItem } from './types';
import { Stack } from 'expo-router';

type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CheckoutScreenRouteProp>();

  const [deliveryMethod, setDeliveryMethod] = useState<'外送' | '自取'>('外送');
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
      const total = route.params.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setSubtotal(total);
      updateDeliveryFee(total, deliveryMethod);
    }
  }, [route.params]);

  const updateDeliveryFee = (total: number, method: '外送' | '自取') => {
    if (method === '外送') {
      setDeliveryFee(total < 200 ? 30 : 0);
    } else {
      setDeliveryFee(0);
    }
  };

  useEffect(() => {
    updateDeliveryFee(subtotal, deliveryMethod);
  }, [deliveryMethod, subtotal]);

  const renderCartItem = (item: CartItem) => (
    <Card style={styles.itemCard} key={item.id}>
      <Card.Content style={styles.itemContent}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Title>{item.name}</Title>
          <Paragraph>數量: {item.quantity}</Paragraph>
          <Paragraph>價格: ${item.price * item.quantity}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  const totalPrice = subtotal + deliveryFee;

  return (
    <>
      <Stack.Screen
        options={{
          title: '結帳',
          headerStyle: {
            backgroundColor: '#FF5E62',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '返回',
        }}
      />
      <ScrollView style={styles.content}>
        <Card style={styles.deliveryMethodCard}>
          <Card.Content>
            <Title>取餐方式</Title>
            <RadioButton.Group 
              onValueChange={(value) => setDeliveryMethod(value as '外送' | '自取')} 
              value={deliveryMethod}
            >
              <RadioButton.Item label="外送" value="外送" />
              <RadioButton.Item label="自取" value="自取" />
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {deliveryMethod === '外送' && (
          <Card style={styles.addressCard}>
            <Card.Content>
              <Title>外送地址</Title>
              <TextInput
                label="輸入地址"
                value={address}
                onChangeText={setAddress}
                style={styles.addressInput}
              />
              <View style={styles.mapContainer}>
                <Image
                  source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Taiwan&zoom=7&size=400x200&key=YOUR_API_KEY' }}
                  style={styles.mapImage}
                />
                <Text style={styles.mapPlaceholder}>此處顯示Google Maps</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.orderSummaryCard}>
          <Card.Content>
            <Title>訂單摘要</Title>
            {cartItems.map(renderCartItem)}
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text>小計</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </View>
            {deliveryMethod === '外送' && deliveryFee > 0 && (
              <View style={styles.totalRow}>
                <Text>外送費</Text>
                <Text>${deliveryFee.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>總計</Text>
              <Text style={styles.totalText}>${totalPrice.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => {
            // 處理結帳邏輯
            console.log('Processing checkout...');
          }}
          style={styles.checkoutButton}
        >
          確認結帳
        </Button>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  deliveryMethodCard: {
    marginBottom: 16,
  },
  addressCard: {
    marginBottom: 16,
  },
  addressInput: {
    marginBottom: 8,
  },
  mapContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
    marginTop: 8,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  orderSummaryCard: {
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  checkoutButton: {
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: '#FF5E62',
  },
});

export default CheckoutScreen;