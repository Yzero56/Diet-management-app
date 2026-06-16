import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

const 활동량_옵션 = [
  { label: '하루 종일 앉아서 생활해요', value: 'sedentary', multiplier: 1.2 },
  { label: '가볍게 걷는 정도는 할 수 있어요', value: 'light', multiplier: 1.375 },
  { label: '주 3회 정도는 운동할 수 있어요', value: 'moderate', multiplier: 1.55 },
  { label: '거의 매일 운동할 수 있어요', value: 'active', multiplier: 1.725 },
  { label: '매일 강도 높게 운동할 수 있어요', value: 'very_active', multiplier: 1.9 },
];

export default function Step4({ navigation }) {
  const { userInfo, setUserInfo } = useUser();

  const handleSelect = (option) => {
    const bmr = userInfo.bmr;
    const tdee = Math.round(bmr * option.multiplier);

    // 감량해야 할 kg
    const weightToLose = parseFloat(userInfo.weight) - parseFloat(userInfo.targetWeight);

    // 목표 기간 동안 필요한 하루 칼로리 적자
    // 체지방 1kg = 7,000 kcal / 목표기간(개월) / 30일
    const dailyDeficit = Math.round((weightToLose * 7000) / (userInfo.targetPeriod * 30));

    // 목표 칼로리 = TDEE - 하루 칼로리 적자
    // 단, 너무 낮으면 위험하니까 최소 1200 kcal 보장
    const minCalorie = userInfo.gender === '남자' ? 1500 : 1200;
    let targetCalorie  = Math.max(tdee - dailyDeficit, minCalorie);

    // 감정+체중의 경우, 너무 급격한 감량은 스트레스 유발 가능성 있음. 
    if (userInfo.mainGoal === '감정+체중') {
      targetCalorie = Math.max(tdee - Math.round(dailyDeficit * 0.7), minCalorie);
    }

    targetCalorie = Math.round(targetCalorie);

    // 목표에 따라 탄단지 비율 계산
    let carbRatio, proteinRatio, fatRatio;
    if (userInfo.mainGoal === '체중관리') {
      carbRatio = 0.4; proteinRatio = 0.3; fatRatio = 0.3;
    } else {
      carbRatio = 0.45; proteinRatio = 0.3; fatRatio = 0.25;
    }

    const carbs = Math.round((targetCalorie * carbRatio) / 4);
    const protein = Math.round((targetCalorie * proteinRatio) / 4);
    const fat = Math.round((targetCalorie * fatRatio) / 9);

    setUserInfo(prev => ({
      ...prev,
      activity: option.value,
      tdee,
      targetCalorie,
      carbs,
      protein,
      fat,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 진행도 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={styles.progressDot} />
      </View>

      <Text style={styles.title}>얼마만큼{'\n'}운동할 수 있어요?</Text>
      <Text style={styles.sub}>4 / 5</Text>

      <Text style={styles.label}>본인 생활 패턴에 맞게 선택하주세요</Text>

      <View style={styles.optionList}>
        {활동량_옵션.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionBtn,
              userInfo.activity === option.value && styles.optionBtnSelected
            ]}
            onPress={() => handleSelect(option)}
          >
            <Text style={[
              styles.optionText,
              userInfo.activity === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
            {/* 선택하면 계산된 칼로리 미리보기 */}
            {userInfo.activity === option.value && (
              <Text style={styles.tdeeText}>
                하루 총 소비 칼로리 약 {Math.round(userInfo.bmr * option.multiplier).toLocaleString()} kcal
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 버튼 */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, !userInfo.activity && styles.btnDisabled]}
          onPress={() => navigation.navigate('Step5')}
          disabled={!userInfo.activity}
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
  optionList: {
    gap: 10,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
  },
  optionBtnSelected: {
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 14,
    color: '#999',
  },
  optionTextSelected: {
    color: '#000',
    fontWeight: '500',
  },
  tdeeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40,
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
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});