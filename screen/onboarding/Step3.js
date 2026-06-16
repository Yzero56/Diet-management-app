import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

export default function Step3({ navigation }) {
  const { userInfo, setUserInfo } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  //목표 기간 옵션
  const 목표기간_옵션 = [
  { label: '1개월 안에 빼고 싶어요', months: 1 },
  { label: '2~3개월 안에 빼고 싶어요', months: 2.5 },
  { label: '6개월 안에 빼고 싶어요', months: 6 },
  { label: '천천히 꾸준히 할 거예요', months: 12 },
  ];

  // 기초대사량 계산
  const calculateBMR = () => {
    const weight = parseFloat(userInfo.weight);
    const height = parseFloat(userInfo.height);
    const birthYear = parseInt(userInfo.birth.slice(0, 4));
    const age = new Date().getFullYear() - birthYear;

    if (userInfo.gender === '남자') {
      return Math.round(66 + (13.7 * weight) + (5 * height) - (6.8 * age));
    } else {
      return Math.round(655 + (9.6 * weight) + (1.8 * height) - (4.7 * age));
    }
  };

  // 화면 진입 시 BMR 계산해서 저장
  const bmr = userInfo.bmr || calculateBMR();

  const handleNext = () => {
    // BMR Context에 저장하고 다음으로
    setUserInfo(prev => ({ ...prev, bmr: bmr }));
    navigation.navigate('Step4');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 진행도 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <Text style={styles.title}>목표 체중을{'\n'}알려주세요</Text>
      <Text style={styles.sub}>3 / 5</Text>

      {/* 목표 체중 입력 */}
      <Text style={styles.label}>목표 체중 (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="00"
        placeholderTextColor="#999"
        value={userInfo.targetWeight}
        onChangeText={(text) => setUserInfo(prev => ({ ...prev, targetWeight: text }))}
        keyboardType="numeric"
      />



      {/* 현재 vs 목표 */}
      {userInfo.targetWeight !== '' && (
        <View style={styles.diffBox}>
          <View style={styles.diffItem}>
            <Text style={styles.diffLabel}>현재 체중</Text>
            <Text style={styles.diffValue}>{userInfo.weight}kg</Text>
          </View>
          <Text style={styles.diffArrow}>→</Text>
          <View style={styles.diffItem}>
            <Text style={styles.diffLabel}>목표 체중</Text>
            <Text style={styles.diffValue}>{userInfo.targetWeight}kg</Text>
          </View>
          <View style={styles.diffItem}>
            <Text style={styles.diffLabel}>감량 목표</Text>
            <Text style={[styles.diffValue, { color: '#FF6B6B' }]}>
              -{(parseFloat(userInfo.weight) - parseFloat(userInfo.targetWeight)).toFixed(1)}kg
            </Text>
          </View>
        </View>
      )}

      {/* 목표 기간 */}
      <Text style={styles.label}>언제까지 목표를 이루고 싶어요?</Text>
      <View style={styles.periodList}>
        {목표기간_옵션.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.periodBtn,
              userInfo.targetPeriod === option.months && styles.periodBtnSelected
            ]}
            onPress={() => setUserInfo(prev => ({ ...prev, targetPeriod: option.months }))}
          >
            <Text style={[
              styles.periodBtnText,
              userInfo.targetPeriod === option.months && styles.periodBtnTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* 기초대사량 */}
      <Text style={styles.label}>기초대사량</Text>
      <Text style={styles.bmrDesc}>
        키, 체중, 나이, 성별로 자동 계산됐어요. 다르다면 수정할 수 있어요.
      </Text>
      <View style={styles.bmrRow}>
        {isEditing ? (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={String(userInfo.bmr || bmr)}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, bmr: parseInt(text) || 0 }))}
            keyboardType="numeric"
            autoFocus
          />
        ) : (
          <View style={styles.bmrValue}>
            <Text style={styles.bmrText}>{userInfo.bmr || bmr} kcal</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            if (!isEditing) {
              setUserInfo(prev => ({ ...prev, bmr: bmr }));
            }
            setIsEditing(!isEditing);
          }}
        >
          <Text style={styles.editBtnText}>{isEditing ? '완료' : '수정'}</Text>
        </TouchableOpacity>
      </View>

      {/* 탄단지는 Step4 활동량 선택 후 계산된다는 안내 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          탄수화물, 단백질, 지방 목표량은 다음 단계에서 활동량을 선택하면 자동으로 계산돼요.
        </Text>
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
          style={[styles.btn, !userInfo.targetWeight && styles.btnDisabled]}
          onPress={handleNext}
          disabled={!userInfo.targetWeight || !userInfo.targetPeriod}
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
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
  },
  periodList: {
    gap: 8,
  },
  periodBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
  },
  periodBtnSelected: {
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  periodBtnText: {
    fontSize: 14,
    color: '#999',
  },
  periodBtnTextSelected: {
    color: '#000',
    fontWeight: '500',
  },
  diffBox: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diffItem: {
    alignItems: 'center',
    gap: 4,
  },
  diffLabel: {
    fontSize: 11,
    color: '#999',
  },
  diffValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  diffArrow: {
    fontSize: 16,
    color: '#ccc',
  },
  bmrDesc: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 8,
  },
  bmrRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  bmrValue: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
  },
  bmrText: {
    fontSize: 14,
    color: '#000',
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  infoBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
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