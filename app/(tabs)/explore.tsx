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
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={styles.loadingText}>Loading driver behaviors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ Data Loading Error</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBehaviorColor = (result: string) => {
    const colors: Record<string, string> = {
      'normal-driving': '#4CAF50',
      'operating-radio': '#2196F3',
      'hair-and-makeup': '#FFC107',
      'phone-in-hand-left': '#FF5722',
      'phone-in-hand-right': '#F44336',
      'reaching-behind': '#9C27B0',
      'talking-on-phone-left': '#3F51B5',
      'talking-on-phone-right': '#673AB7',
      'talking-with-passenger': '#009688',
      'drinking': '#795548'
    };
    return colors[result] || '#607D8B';
  };

  const formatBehaviorName = (result: string) => {
    return result
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Behaviors</Text>
        <Text style={styles.headerSubtitle}>{data.length} recent events</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[
            styles.card,
            { borderLeftColor: getBehaviorColor(item.result) }
          ]}>
            <View style={styles.cardHeader}>
              <View style={[
                styles.behaviorBadge,
                { backgroundColor: getBehaviorColor(item.result) }
              ]}>
                <Text style={styles.behaviorText}>
                  {formatBehaviorName(item.result)}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.detailText}>
                Detected at {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No behaviors detected yet</Text>
            <Text style={styles.emptySubtext}>
              Driver activity will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  behaviorBadge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  behaviorText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    color: '#718096',
    fontSize: 12,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#4A5568',
    fontSize: 13,
  },
  loadingText: {
    marginTop: 16,
    color: '#5D3FD3',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#E53E3E',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#2D3748',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});

export default ExploreScreen;