import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const BehaviorPieChart = ({ data, totalDetections }) => {
  // Enhanced color palette with gradients
  const colorMap = {
    'Normal Driving': ['#4CAF50', '#81C784'],
    'Operating Radio': ['#2196F3', '#64B5F6'],
    'Hair and Makeup': ['#FFC107', '#FFD54F'],
    'Phone in Hand Left': ['#FF5722', '#FF8A65'],
    'Phone in Hand Right': ['#F44336', '#E57373'],
    'Reaching Behind': ['#9C27B0', '#BA68C8'],
    'Talking on Phone Left': ['#3F51B5', '#7986CB'],
    'Talking on Phone Right': ['#673AB7', '#9575CD'],
    'Talking with Passenger': ['#009688', '#4DB6AC'],
    'Drinking': ['#795548', '#A1887F']
  };

  const chartData = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([behavior, count]) => ({
      name: behavior,
      population: count,
      color: colorMap[behavior][0],
      legendFontColor: '#4A5568',
      legendFontSize: 12
    }));

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F7FAFC']}
      style={styles.chartContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.chartTitle}>Behavior Distribution</Text>
      <Text style={styles.chartSubtitle}>Total Detections: {totalDetections}</Text>
      
      <PieChart
        data={chartData}
        width={screenWidth - 48}
        height={220}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          color: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend
        avoidFalseZero
        center={[10, 10]}
        style={{
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      />

      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <LinearGradient
              colors={colorMap[item.name]}
              style={styles.legendColor}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.legendText}>
              {item.name}: {item.population} (
              {Math.round((item.population / totalDetections) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
    flexShrink: 1,
  },
});

export default BehaviorPieChart;