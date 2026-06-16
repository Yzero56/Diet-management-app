import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

const 질문목록 = [
  // 감정 & 스트레스
  { id: 1, category: '감정 & 스트레스', text: '스트레스를 받으면 음식이 생각나요.' },
  { id: 2, category: '감정 & 스트레스', text: '기분이 좋지 않을 때 먹는 것으로 풀 때가 있어요.' },
  { id: 3, category: '감정 & 스트레스', text: '열심히 했다고 생각하는 날 음식으로 나를 보상해요.' },
  // 숨겨진 행동 패턴
  { id: 4, category: '숨겨진 패턴', text: '누군가한테 맞춰주거나 참은 날 혼자 뭔가 먹고 싶어져요.' },
  { id: 5, category: '숨겨진 패턴', text: '잠을 못 잔 날 다음 날 더 많이 먹게 돼요.' },
  { id: 6, category: '숨겨진 패턴', text: 'TV나 유튜브 볼 때 뭔가 먹어야 할 것 같은 느낌이 들어요.' },
  { id: 7, category: '숨겨진 패턴', text: '밤 10시 이후에 유독 음식이 당겨요.' },
  // 심리 & 죄책감
  { id: 8, category: '심리 & 죄책감', text: '한 번 식단을 망치면 "어차피 망했으니까" 하며 더 먹게 돼요.' },
  { id: 9, category: '심리 & 죄책감', text: '먹고 나서 죄책감이 드는 경우가 자주 있어요.' },
  { id: 10, category: '심리 & 죄책감', text: '배가 불러도 맛있으면 계속 먹게 돼요.' },
];

const 점수라벨 = ['전혀 아니다', '', '보통', '', '매우 그렇다'];

export default function PatternTest({ navigation }) {
  const { setUserInfo } = useUser();
  const [answers, setAnswers] = useState({});
  const [currentCategory, setCurrentCategory] = useState('감정 & 스트레스');

  const categories = ['감정 & 스트레스', '숨겨진 패턴', '심리 & 죄책감'];
  const currentIndex = categories.indexOf(currentCategory);
  const currentQuestions = 질문목록.filter(q => q.category === currentCategory);

  // 현재 카테고리 모두 답했는지
  const isCurrentDone = currentQuestions.every(q => answers[q.id] !== undefined);

  // 전체 완료 여부
  const isAllDone = 질문목록.every(q => answers[q.id] !== undefined);

  const handleAnswer = (id, score) => {
    setAnswers(prev => ({ ...prev, [id]: score }));
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1]);
    } else {
      // 패턴 계산
      const emotionScore = [1, 2, 3].reduce((sum, id) => sum + (answers[id] || 0), 0);
      const hiddenScore = [4, 5, 6, 7].reduce((sum, id) => sum + (answers[id] || 0), 0);
      const guiltScore = [8, 9, 10].reduce((sum, id) => sum + (answers[id] || 0), 0);

      // 패턴 유형 결정
      const patterns = [];
      if (emotionScore >= 9) patterns.push('감정적 섭식');
      if (hiddenScore >= 12) patterns.push('무의식적 섭식');
      if (guiltScore >= 9) patterns.push('악순환 섭식');
      if (patterns.length === 0) patterns.push('균형 섭식');

      setUserInfo(prev => ({
        ...prev,
        patternScores: { emotionScore, hiddenScore, guiltScore },
        patternTypes: patterns,
        failReason: patterns[0],
        patternDone : true,
      }));

      navigation.navigate('PatternResult');
    }
  };

  return (
    <View style={styles.container}>

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressRow}>
          {categories.map((cat, i) => (
            <View
              key={cat}
              style={[
                styles.progressDot,
                i <= currentIndex && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.categoryLabel}>{currentCategory}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {currentQuestions.map((q, qi) => (
          <View key={q.id} style={styles.questionBox}>
            <Text style={styles.questionNum}>Q.{q.id}</Text>
            <Text style={styles.questionText}>{q.text}</Text>

            {/* 5점 슬라이더 */}
            <View style={styles.scaleRow}>
              {[1, 2, 3, 4, 5].map((score) => (
                <TouchableOpacity
                  key={score}
                  style={styles.scaleItem}
                  onPress={() => handleAnswer(q.id, score)}
                >
                  <View style={[
                    styles.scaleCircle,
                    score === 3 && styles.scaleCircleMid,
                    score === 5 && styles.scaleCircleLarge,
                    answers[q.id] === score && styles.scaleCircleSelected,
                  ]}>
                    {answers[q.id] === score && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 라벨 */}
            <View style={styles.labelRow}>
              <Text style={styles.scaleLabel}>전혀 아니다</Text>
              <Text style={styles.scaleLabel}>매우 그렇다</Text>
            </View>

          </View>
        ))}

      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.btn, !isCurrentDone && styles.btnDisabled]}
        onPress={handleNext}
        disabled={!isCurrentDone}
      >
        <Text style={styles.btnText}>
          {currentIndex < categories.length - 1 ? '다음' : '결과 보기'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2A7A',
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
  },
  progressDotActive: {
    backgroundColor: '#C6FF00',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#C6FF00',
    letterSpacing: 2,
  },
  scroll: {
    padding: 24,
    gap: 32,
    paddingBottom: 40,
  },
  questionBox: {
    gap: 16,
  },
  questionNum: {
    fontSize: 13,
    color: '#C6FF00',
    fontWeight: '700',
  },
  questionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    lineHeight: 28,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  scaleItem: {
    alignItems: 'center',
  },
  scaleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleCircleMid: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  scaleCircleLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  scaleCircleSelected: {
    backgroundColor: '#C6FF00',
  },
  checkmark: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#666',
  },
  btn: {
  backgroundColor: '#FFFFFF',
  margin: 24,
  borderRadius: 16,
  padding: 18,
  alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  btnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});