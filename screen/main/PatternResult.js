import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

const 패턴유형데이터 = {
  '감정적 섭식': {
    emoji: '🌋',
    subtitle: '스트레스받으면 먹는 유형',
    desc: '기분에 따라 식욕이 크게 달라지고,\n감정 해소를 위해 음식을 찾는 경향이 있어요.',
    tags: ['#감정폭식', '#스트레스섭식', '#감정기복'],
    tips: [
      '스트레스받을 때 음식 대신 5분 산책을 해봐요',
      '감정 일기를 써보면 패턴을 더 빨리 발견해요',
      '배고픔인지 감정인지 먼저 구분해봐요',
    ],
    color: 'FF6B6B',
    bg: 'FFF0F0',
  },
  '무의식적 섭식': {
    emoji: '🌊',
    subtitle: '모르는 사이에 먹는 유형',
    desc: '의식하지 못한 채 먹는 경우가 많고,\n특정 상황이나 환경에서 자동으로 먹게 돼요.',
    tags: ['#무의식섭식', '#습관적폭식', '#야식'],
    tips: [
      'TV볼 때 간식 없애기부터 시작해봐요',
      '밤 10시 이후엔 주방에 가지 않는 규칙을 만들어봐요',
      '먹기 전 잠깐 멈추고 이유를 떠올려봐요',
    ],
    color: '4A90D9',
    bg: 'F0F5FF',
  },
  '악순환 섭식': {
    emoji: '🔄',
    subtitle: '한 번 무너지면 끝까지 가는 유형',
    desc: '한 번 식단이 무너지면 죄책감이 생기고,\n"어차피 망했으니까" 하며 더 먹게 되는 패턴이에요.',
    tags: ['#죄책감폭식', '#작심삼일', '#악순환'],
    tips: [
      '한 번 무너져도 괜찮아요. 다음 끼니부터 다시 시작해요',
      '"오늘 망했어요" 버튼이 새로운 시작점이에요',
      '완벽하지 않아도 된다는 걸 기억해요',
    ],
    color: 'FF9800',
    bg: 'FFF8F0',
  },
  '균형 섭식': {
    emoji: '⚖️',
    subtitle: '비교적 안정적인 유형',
    desc: '규칙적이고 균형 잡힌 식사를 유지하며,\n자기 조절력이 높은 편이에요.',
    tags: ['#균형식단', '#자기조절', '#안정적'],
    tips: [
      '지금 습관을 유지하는 것이 가장 중요해요',
      '가끔 무너지는 날도 데이터로 쌓아봐요',
      'WAI로 더 정교한 패턴을 발견해봐요',
    ],
    color: '2A9D5C',
    bg: 'F0FFF5',
  },
};

export default function PatternResult({ navigation }) {
  const { userInfo, setUserInfo } = useUser();
  const types = userInfo.patternTypes || ['균형 섭식'];
  const mainType = types[0];
  const data = 패턴유형데이터[mainType] || 패턴유형데이터['균형 섭식'];
  const scores = userInfo.patternScores || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: '#' + data.color }]}>
        <Text style={styles.headerEmoji}>{data.emoji}</Text>
        <Text style={styles.headerSub}>{data.subtitle}</Text>
        <Text style={styles.headerTitle}>{mainType}</Text>
        <Text style={styles.headerDesc}>{data.desc}</Text>
      </View>

      {/* 태그 */}
      <View style={styles.tagRow}>
        {data.tags.map((tag, i) => (
          <View key={i} style={[styles.tag, { borderColor: '#' + data.color }]}>
            <Text style={[styles.tagText, { color: '#' + data.color }]}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* 점수 카드 */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>패턴 점수</Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>감정 & 스트레스</Text>
            <Text style={[styles.scoreNum, { color: '#FF6B6B' }]}>
              {scores.emotionScore || 0}
              <Text style={styles.scoreMax}>/15</Text>
            </Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, {
                width: `${((scores.emotionScore || 0) / 15) * 100}%`,
                backgroundColor: '#FF6B6B'
              }]} />
            </View>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>숨겨진 패턴</Text>
            <Text style={[styles.scoreNum, { color: '#4A90D9' }]}>
              {scores.hiddenScore || 0}
              <Text style={styles.scoreMax}>/20</Text>
            </Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, {
                width: `${((scores.hiddenScore || 0) / 20) * 100}%`,
                backgroundColor: '#4A90D9'
              }]} />
            </View>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>심리 & 죄책감</Text>
            <Text style={[styles.scoreNum, { color: '#FF9800' }]}>
              {scores.guiltScore || 0}
              <Text style={styles.scoreMax}>/15</Text>
            </Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, {
                width: `${((scores.guiltScore || 0) / 15) * 100}%`,
                backgroundColor: '#FF9800'
              }]} />
            </View>
          </View>
        </View>
      </View>

      {/* 복합 유형 */}
      {types.length > 1 && (
        <View style={styles.multiCard}>
          <Text style={styles.multiTitle}>복합 패턴도 발견됐어요</Text>
          {types.slice(1).map((t, i) => (
            <View key={i} style={styles.multiItem}>
              <Text style={styles.multiEmoji}>{패턴유형데이터[t]?.emoji}</Text>
              <Text style={styles.multiText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* WAI 팁 */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>WAI 추천</Text>
        {data.tips.map((tip, i) => (
          <View key={i} style={styles.tipItem}>
            <View style={[styles.tipDot, { backgroundColor: '#' + data.color }]} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* 버튼 */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#' + data.color }]}
        onPress={() => {
          setUserInfo(prev => ({ ...prev, patternDone: true }));
          navigation.navigate('MainScreen');
        }}
      >
        <Text style={styles.btnText}>나의 식단 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.retryBtn}
        onPress={() => navigation.navigate('PatternTest')}
      >
        <Text style={styles.retryText}>다시 테스트하기</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
    gap: 8,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 20,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  scoreRow: {
    gap: 12,
  },
  scoreItem: {
    gap: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
  },
  scoreNum: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '400',
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  multiCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  multiTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  multiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  multiEmoji: {
    fontSize: 20,
  },
  multiText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tipCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  btn: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  retryBtn: {
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  retryText: {
    fontSize: 13,
    color: '#999',
  },
});