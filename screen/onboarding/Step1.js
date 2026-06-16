import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../../context/UserContext';

export default function Step1({ navigation }) {
  const { userInfo, setUserInfo } = useUser();
  const handleBirth = (text) => {
  // 숫자만 추출
  const numbers = text.replace(/[^0-9]/g, '');
  
  // 자동으로 . 찍기
  let formatted = numbers;
  if (numbers.length > 4) {
    formatted = numbers.slice(0, 4) + '.' + numbers.slice(4);
  }
  if (numbers.length > 6) {
    formatted = numbers.slice(0, 4) + '.' + numbers.slice(4, 6) + '.' + numbers.slice(6, 8);
  }
  
  setUserInfo(prev => ({ ...prev, birth : formatted }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 진행도 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      {/* 타이틀 */}
      <Text style={styles.title}>기본 정보를{'\n'}입력해주세요</Text>
      <Text style={styles.sub}>1 / 5</Text>

      {/* 이름 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해주세요"
        placeholderTextColor="#999"
        value={userInfo.name}
        onChangeText={(text) => setUserInfo(prev => ({ ...prev, name : text }))}
      />

      {/* 생년월일 */}
      <Text style={styles.label}>생년월일</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY.MM.DD"
        placeholderTextColor="#999"
        value={userInfo.birth}
        onChangeText={handleBirth}
        keyboardType="numeric"
      />

      {/* 성별 */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[styles.genderBtn, userInfo.gender === '남자' && styles.genderSelected]}
          onPress={() => setUserInfo(prev => ({ ...prev, gender : '남자' }))}
        >
          <Text style={userInfo.gender === '남자' ? styles.genderTextSelected : styles.genderText}>남자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderBtn, userInfo.gender === '여자' && styles.genderSelected]}
          onPress={() => setUserInfo(prev => ({ ...prev, gender : '여자' }))}
        >
          <Text style={userInfo.gender === '여자' ? styles.genderTextSelected : styles.genderText}>여자</Text>
        </TouchableOpacity>
      </View>

      {/* 키 / 체중 */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>키 (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="000"
            placeholderTextColor="#999"
            value={userInfo.height}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, height : text }))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>체중 (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="00"
            placeholderTextColor="#999"
            value={userInfo.weight}
            onChangeText={(text) => setUserInfo(prev => ({ ...prev, weight : text }))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Step2')}
      >
        <Text style={styles.btnText}>다음</Text>
      </TouchableOpacity>

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
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  genderSelected: {
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  genderText: {
    fontSize: 14,
    color: '#999',
  },
  genderTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});