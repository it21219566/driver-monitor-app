import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useFirestore } from '../../hooks/useFirestore';

interface Detection {
  id: string;
  result: string;
  timestamp: string;
}

const ExploreScreen = () => {
  const { data, loading, error } = useFirestore<Detection>('detections');

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorDetails}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest 10 Driver Actions</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.resultText}>
              {item.result.replace('-', ' ').split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
            <Text style={styles.timestampText}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent actions detected</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  itemContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExploreScreen;