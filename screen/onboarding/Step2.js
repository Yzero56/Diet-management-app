import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../../context/UserContext';

const 체중관리_옵션 = ['건강한 라이프스타일', '옷핏', '컨디션 관리', '대회 준비', '웨딩 준비'];
const 감정체중_옵션 = ['폭식을 줄이고 싶어요', '스트레스를 먹는 걸로 풀어요', '다이어트 강박이 심해요', '식습관을 바꾸고 싶어요'];

export default function Step2({ navigation }) {
  const { userInfo, setUserInfo } = useUser();

  const subOptions = userInfo.mainGoal === '체중관리' ? 체중관리_옵션 : 감정체중_옵션;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 진행도 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Text style={styles.title}>목표를{'\n'}선택해주세요</Text>
      <Text style={styles.sub}>2 / 5</Text>

      {/* 큰 목표 선택 */}
      <Text style={styles.label}>어떤 관리를 원하세요?</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.mainBtn, userInfo.mainGoal === '체중관리' && styles.mainBtnSelected]}
          onPress={() => { setUserInfo(prev => ( { ...prev, mainGoal : '체중관리', subGoal : '' })); }}
        >
          <Text style={[styles.mainBtnText, userInfo.mainGoal === '체중관리' && styles.mainBtnTextSelected]}>
            체중 관리
          </Text>
          <Text style={styles.mainBtnDesc}>식단 + 패턴 분석</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainBtn, userInfo.mainGoal === '감정+체중' && styles.mainBtnSelected]}
          onPress={() => { setUserInfo(prev => ( { ...prev, mainGoal : '감정+체중', subGoal : '' })); }}
        >
          <Text style={[styles.mainBtnText, userInfo.mainGoal === '감정+체중' && styles.mainBtnTextSelected]}>
            감정 + 체중 관리
          </Text>
          <Text style={styles.mainBtnDesc}>감정적 원인 분석 포함</Text>
        </TouchableOpacity>
      </View>

      {/* 세부 목표 선택 — 큰 목표 선택 후 나타남 */}
      {userInfo.mainGoal !== '' && (
        <>
          <Text style={[styles.label, { marginTop: 28 }]}>
            {userInfo.mainGoal === '체중관리' ? '목표 이유가 뭐예요?' : '어떤 부분이 고민이에요?'}
          </Text>
          <View style={styles.subOptionWrap}>
            {subOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.subBtn, userInfo.subGoal === option && styles.subBtnSelected]}
                onPress={() => setUserInfo(prev => ({ ...prev, subGoal: option }))}
              >
                <Text style={[styles.subBtnText, userInfo.subGoal === option && styles.subBtnTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, (!userInfo.mainGoal || !userInfo.subGoal) && styles.btnDisabled]}
          onPress={() => navigation.navigate('Step3')}
          disabled={!userInfo.mainGoal || !userInfo.subGoal}
        >
          <Text style={styles.btnText}>다음</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
    marginTop: 48,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 32,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#999',
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mainBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  mainBtnSelected: {
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  mainBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  mainBtnTextSelected: {
    color: '#000',
  },
  mainBtnDesc: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
  },
  subOptionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  subBtnSelected: {
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  subBtnText: {
    fontSize: 13,
    color: '#999',
  },
  subBtnTextSelected: {
    color: '#000',
    fontWeight: '500',
  },
  btn: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#E0E0E0',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  backBtn: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#E0E0E0',
  borderRadius: 10,
  padding: 16,
  alignItems: 'center',
  },
  backBtnText: {
    color: '#999',
    fontSize: 15,
  },
});