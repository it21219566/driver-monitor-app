import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useFirestore } from '../../hooks/useFirestore';
import BehaviorPieChart from '../../components/PieCharts';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

type BehaviorKey =
  | 'Normal Driving'
  | 'Operating Radio'
  | 'Hair and Makeup'
  | 'Phone in Hand Left'
  | 'Phone in Hand Right'
  | 'Reaching Behind'
  | 'Talking on Phone Left'
  | 'Talking on Phone Right'
  | 'Talking with Passenger'
  | 'Drinking';

type BehaviorCounts = Record<BehaviorKey, number>;

const HomeScreen = () => {
  // Get ALL entries for the pie chart (no limit)
  const { data: allData, loading, error } = useFirestore('detections');

  const processBehaviorData = (): BehaviorCounts => {
    const behaviorCounts: BehaviorCounts = {
      'Normal Driving': 0,
      'Operating Radio': 0,
      'Hair and Makeup': 0,
      'Phone in Hand Left': 0,
      'Phone in Hand Right': 0,
      'Reaching Behind': 0,
      'Talking on Phone Left': 0,
      'Talking on Phone Right': 0,
      'Talking with Passenger': 0,
      'Drinking': 0
    };

    allData.forEach(item => {
      const behavior = formatBehaviorName(item.result) as BehaviorKey;
      if (behaviorCounts.hasOwnProperty(behavior)) {
        behaviorCounts[behavior]++;
      }
    });

    return behaviorCounts;
  };

  const formatBehaviorName = (result: string) => {
    return result
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const totalDetections = allData.length;

  if (loading) {
    return (
      <LinearGradient colors={['#F7FAFC', '#EBF4FF']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={styles.loadingText}>Analyzing Driver Behaviors...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#FFF5F5', '#FED7D7']} style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#E53E3E" />
        <Text style={styles.errorText}>Data Loading Failed</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </LinearGradient>
    );
  }

  const behaviorCounts = processBehaviorData();

  return (
    <LinearGradient colors={['#F7FAFC', '#EBF4FF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Driver Analytics Dashboard</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalDetections}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {Math.round((behaviorCounts['Normal Driving'] / totalDetections) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Safe Driving</Text>
            </View>
          </View>
        </View>

        <BehaviorPieChart 
          data={processBehaviorData()} 
          totalDetections={totalDetections} 
        />

        <View style={styles.tipContainer}>
          <MaterialIcons name="lightbulb" size={24} color="#F6AD55" />
          <Text style={styles.tipText}>
            {getRandomTip(behaviorCounts)}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Helper function for driving tips
const getRandomTip = (behaviors: BehaviorCounts) => {
  const tips = [
    "Regular breaks can reduce distracted driving by up to 40%.",
    "Hands-free devices are safer but can still be distracting.",
    "Adjust mirrors and seats before starting your journey.",
    "Keep both hands on the wheel for better control.",
    "Plan your route before driving to minimize distractions."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5D3FD3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#5D3FD3',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E53E3E',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  tipContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 12,
    flex: 1,
  },
});

export default HomeScreen;