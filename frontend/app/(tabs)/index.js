import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';

export default function App() {
  const [menuData, setMenuData] = useState([]);
  const [displayMode, setDisplayMode] = useState('');

  // Use /api because Vercel serverless API is always /api/*
  const API_BASE_URL = 'https://coffeeshop-git-main-shaheers-projects-6d04e7f2.vercel.app';

  const fetchFullMenu = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);

      const data = await response.json();
      setMenuData(data);
      setDisplayMode('full');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch the full menu.');
    }
  };

  const fetchRandomItem = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/random`);
      const data = await response.json();

      setMenuData([data]);
      setDisplayMode('random');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch a surprise item.');
    }
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Category: {item.category}</Text>
      <Text style={styles.itemDetails}>Price: Rs. {item.price?.toFixed(2)}</Text>
      <Text style={[styles.itemDetails, { color: item.inStock ? 'green' : 'red' }]}>
        {item.inStock ? 'In Stock' : 'Out of Stock'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Coffee Shop Menu</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchFullMenu}>
          <Text style={styles.buttonText}>Full Menu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fetchRandomItem}>
          <Text style={styles.buttonText}>Surprise Me!</Text>
        </TouchableOpacity>
      </View>

      {displayMode === 'full' && <Text style={styles.subtitle}>All Menu Items:</Text>}
      {displayMode === 'random' && <Text style={styles.subtitle}>Your Surprise Item:</Text>}

      <FlatList
        data={menuData}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item._id || item.name}
        style={styles.list}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#6F4E37',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6F4E37',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 10,
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});
