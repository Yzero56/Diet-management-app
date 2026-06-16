import React from 'react';
import {  View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function PatternIntro({ navigation }) {
  return (
    <View style={styles.container}>

      {/* 닫기 버튼 */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.navigate('MainScreen')}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* 상단 영역 */}
      <View style={styles.topArea}>
        <Text style={styles.topTitle}>다이어트,{'\n'} 매번 실패하는 이유가 궁금하지 않아요?</Text>
      </View>

      {/* 하단 영역 */}
      <View style={styles.bottomArea}>
        <Text style={styles.highlight}>열심히 해도 늘 제자리 같았다면</Text>
        <Text style={styles.mainText}>
          나의 식습관 패턴을{'\n'}먼저 이해하는 것부터 시작해요
        </Text>
        <Text style={styles.descText}>
          식단도, 운동도 열심히 했는데 왜 안 됐을까요?{'\n'}
          이유가 생각보다 가까운 곳에 있을 수 있어요.{'\n'}
          10개의 질문으로 나만의 패턴을 찾아봐요.
        </Text>
        

        {/* 시작하기 버튼 */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('PatternTest')}
        >
          <Text style={styles.btnText}>시작하기</Text>
        </TouchableOpacity>

        {/* 건너뛰기 */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('MainScreen')}
        >
          <Text style={styles.skipText}>나중에 할게요</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2A7A',
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    left: 24,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
  },
  topArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingTop: 100,
  },
  topTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
  },
  bottomArea: {
    backgroundColor: '#0f1a4e',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    gap: 16,
  },
  highlight: {
    fontSize: 13,
    color: '#C6FF00',
    letterSpacing: 1,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 32,
  },
  descText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
  btn: {
  backgroundColor: '#C6FF00',
  borderRadius: 16,
  padding: 18,
  alignItems: 'center',
  marginTop: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  skipBtn: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    fontSize: 13,
    color: '#666',
  },
});