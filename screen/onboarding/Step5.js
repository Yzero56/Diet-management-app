import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

export default function Step5({ navigation }) {
  const { userInfo } = useUser();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 진행도 — 전부 완료 */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
        <View style={[styles.progressDot, styles.dotActive]} />
      </View>

      {/* 타이틀 */}
      <Text style={styles.title}>가입을{'\n'}축하해요! 🎉</Text>
      <Text style={styles.sub}>5 / 5</Text>
      <Text style={styles.sub}>나만의 식단 카드가 만들어졌어요</Text>

      {/* 카드 */}
      <View style={styles.card}>

        {/* 이름 + 목표 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{userInfo.name}</Text>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>{userInfo.mainGoal}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 체중 */}
        <View style={styles.cardRow}>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>현재 체중</Text>
            <Text style={styles.cardValue}>{userInfo.weight}kg</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>목표 체중</Text>
            <Text style={[styles.cardValue, { color: '#FF6B6B' }]}>{userInfo.targetWeight}kg</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>감량 목표</Text>
            <Text style={[styles.cardValue, { color: '#FF6B6B' }]}>
              -{(parseFloat(userInfo.weight) - parseFloat(userInfo.targetWeight)).toFixed(1)}kg
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 칼로리 */}
        <View style={styles.cardRow}>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>기초대사량</Text>
            <Text style={styles.cardValue}>{userInfo.bmr?.toLocaleString()} kcal</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>하루 총 소비</Text>
            <Text style={styles.cardValue}>{userInfo.tdee?.toLocaleString()} kcal</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.cardLabel}>목표 칼로리</Text>
            <Text style={[styles.cardValue, { color: '#4CAF50' }]}>{userInfo.targetCalorie?.toLocaleString()} kcal</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 탄단지 */}
        <Text style={styles.nutriTitle}>목표 탄단지</Text>
        <View style={styles.nutriRow}>
          <View style={styles.nutriItem}>
            <View style={[styles.nutriDot, { backgroundColor: '#FFB347' }]} />
            <Text style={styles.nutriLabel}>탄수화물</Text>
            <Text style={styles.nutriValue}>{userInfo.carbs}g</Text>
          </View>
          <View style={styles.nutriItem}>
            <View style={[styles.nutriDot, { backgroundColor: '#87CEEB' }]} />
            <Text style={styles.nutriLabel}>단백질</Text>
            <Text style={styles.nutriValue}>{userInfo.protein}g</Text>
          </View>
          <View style={styles.nutriItem}>
            <View style={[styles.nutriDot, { backgroundColor: '#98FB98' }]} />
            <Text style={styles.nutriLabel}>지방</Text>
            <Text style={styles.nutriValue}>{userInfo.fat}g</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 활동량 */}
        <View style={styles.activityRow}>
          <Text style={styles.cardLabel}>활동량</Text>
          <Text style={styles.activityValue}>
            {userInfo.activity === 'sedentary' && '하루 종일 앉아서 생활해요'}
            {userInfo.activity === 'light' && '가볍게 걷는 정도는 할 수 있어요'}
            {userInfo.activity === 'moderate' && '주 3회 정도 운동할 수 있어요'}
            {userInfo.activity === 'active' && '거의 매일 운동할 수 있어요'}
            {userInfo.activity === 'very_active' && '매일 강도 높게 운동할 수 있어요'}
          </Text>
        </View>

      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('MainScreen')}
      >
        <Text style={styles.btnText}>시작하기</Text>
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
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  goalBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  goalBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardItem: {
    alignItems: 'center',
    gap: 4,
  },
  cardLabel: {
    fontSize: 11,
    color: '#999',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  arrow: {
    fontSize: 16,
    color: '#ccc',
  },
  nutriTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  nutriRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutriItem: {
    alignItems: 'center',
    gap: 4,
  },
  nutriDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nutriLabel: {
    fontSize: 11,
    color: '#999',
  },
  nutriValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
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