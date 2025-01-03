import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Text, Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, Store, Product, CartItem } from '../types';


const stores: Store[] = [
  {
    id: '1',
    name: '甜點天堂',
    image: 'https://kafkalin.com/wp-content/uploads/20200113084200_55.jpg',
    products: [
      { id: '1', name: '蘋果派', price: 60, originalPrice: 90, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), image: 'https://yukigo.tw/wp-content/uploads/pixnet/1634655719-3413557853-g.jpg' },
      { id: '2', name: '藍莓慕斯', price: 80, originalPrice: 120, expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000), image: 'https://i.ytimg.com/vi/sa-upIs_JOg/maxresdefault.jpg' },
      { id: '3', name: '巧克力蛋糕', price: 70, originalPrice: 100, expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000), image: 'https://i0.wp.com/aumabakery.com/wp-content/uploads/2023/02/醇黑生巧克力6吋2-scaled-e1690463062652.jpg?fit=1350%2C1350&ssl=1' },
    ]
  },
  {
    id: '2',
    name: '春水堂',
    image: 'https://image-cdn.learnin.tw/bnextmedia/image/album/2016-12/img-1481267885-28163.jpg?w=900&output=webp',
    products: [
      { id: '1', name: '高麗菜(原材料)', price: 60, originalPrice: 90, expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), image: 'https://doqvf81n9htmm.cloudfront.net/data/crop_article/89687/cabbage.jpg_1140x855.jpg' },
      { id: '2', name: '蘿蔔糕', price: 80, originalPrice: 120, expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000), image: 'https://www.chunshuitang.com.tw/upload/cuisine_list_pic/twL_cuisine_24D01_Rau6TgPXIU.webp' },
    ]
  },
  // ... 其他商店數據 ...
];


const formatExpiryDate = (date: Date) => {
  const now = new Date();
  const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 0) return '已過期';
  if (diffHours === 0) return '即將過期';
  if (diffHours < 24) return `${diffHours} 小時後到期`;
  return `${Math.floor(diffHours / 24)} 天後到期`;
};

export default function UserShoppingScreen() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const addToCart = (productId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const navigateToCart = () => {
    if (selectedStore) {
      const cartItems: CartItem[] = Object.keys(cart).map(productId => {
        const product = selectedStore.products.find(p => p.id === productId);
        if (!product) throw new Error(`Product with id ${productId} not found`);
        return {
          ...product,
          quantity: cart[productId]
        };
      }).filter(item => item.quantity > 0);

      navigation.navigate('Cart', { 
        cartItems: cartItems,
        storeName: selectedStore.name
      });
    }
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity onPress={() => setSelectedStore(item)}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.storeCard}
        imageStyle={styles.storeCardImage}
      >
        <BlurView intensity={80} style={styles.storeCardContent}>
          <Text style={styles.storeCardTitle}>{item.name}</Text>
        </BlurView>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.productCard}>
      <Card.Cover source={{ uri: item.image }} style={styles.productImage} />
      <Card.Content>
        <Title style={styles.productTitle}>{item.name}</Title>
        <View style={styles.priceContainer}>
          <Text style={styles.discountPrice}>${item.price}</Text>
          <Text style={styles.originalPrice}>${item.originalPrice}</Text>
          <Chip style={styles.discountChip}>{Math.round((1 - item.price / item.originalPrice) * 100)}% OFF</Chip>
        </View>
        <Paragraph style={styles.expiryDate}>{formatExpiryDate(item.expiryDate)}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        {cart[item.id] ? (
          <View style={styles.quantityContainer}>
            <Button icon="minus" onPress={() => removeFromCart(item.id)} children={undefined} />
            <Text style={styles.quantityText}>{cart[item.id]}</Text>
            <Button icon="plus" onPress={() => addToCart(item.id)} children={undefined} />
          </View>
        ) : (
          <Button mode="contained" onPress={() => addToCart(item.id)}>
            加入購物車
          </Button>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#FF5E62', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Searchbar
            placeholder="搜尋美食"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>
        <ScrollView style={styles.content}>
          <Title style={styles.sectionTitle}>附近的店家</Title>
          <FlatList
            horizontal
            data={stores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.storeList}
          />
          <Title style={styles.sectionTitle}>今日特惠</Title>
          {selectedStore ? (
            <FlatList
              data={selectedStore.products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={styles.noStoreSelected}>請選擇一家店鋪查看商品</Text>
          )}
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="cart"
          label={`${getTotalItems()}`}
          onPress={navigateToCart}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 10,
  },
  storeList: {
    paddingLeft: 16,
  },
  storeCard: {
    width: 200,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  storeCardImage: {
    borderRadius: 8,
  },
  storeCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  storeCardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },
  productImage: {
    height: 150,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
  discountChip: {
    marginLeft: 8,
    backgroundColor: '#FFE5E5',
  },
  expiryDate: {
    color: '#FF9966',
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5E62',
  },
  noStoreSelected: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});