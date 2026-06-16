import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Step1');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* 왼쪽 화살표 장식 */}
      <Text style={styles.arrowLeft}>›</Text>

      {/* 중앙 텍스트 */}
      <View style={styles.center}>
        <Text style={styles.sub}>나를 들여다보는 식단 관리 앱</Text>
        <View style={styles.line} />
        <Text style={styles.logo}>WAI(WHY AM I)</Text>
      </View>

      {/* 오른쪽 하단 점 장식 */}
      <View style={styles.dots}>
        {[...Array(25)].map((_, i) => (
          <View key={i} style={styles.dot} />
        ))}
      </View>

      {/* 오른쪽 하단 곡선 장식 */}
      <View style={styles.circle} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    position: 'absolute',
    left: -10,
    top: '40%',
    fontSize: 120,
    color: '#D8DCF0',
    fontWeight: '300',
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  sub: {
    fontSize: 15,
    color: '#1A2A7A',
    letterSpacing: 1,
  },
  line: {
    width: 32,
    height: 2,
    backgroundColor: '#1A2A7A',
    borderRadius: 1,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A2A7A',
    letterSpacing: 2,
  },
  dots: {
    position: 'absolute',
    bottom: 60,
    right: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 80,
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1A2A7A',
    opacity: 0.3,
  },
  circle: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#D8DCF0',
    opacity: 0.5,
  },
});