import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const EMOTION_EMOJI = {
  good: '😊',
  normal: '😐',
  bad: '😔',
  stress: '😤',
  failed: '😵',
};

const EMOTION_COLOR = {
  good: '#a8e6cf',
  normal: '#dcedc1',
  bad: '#ffaaa5',
  stress: '#ff8b94',
  failed: '#ffd3b6',
};

export default function ReportScreen({ navigation }) {
  const { userInfo } = useUser();

  const getThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    return DAYS.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        label,
        dateStr: `${date.getMonth() + 1}/${date.getDate()}`,
        fullDate,
      };
    });
  };

  const thisWeek = getThisWeek();

  const getEmotionForDate = (fullDate) => {
    const logs = userInfo.dailyEmotions || [];
    const found = logs.find(l => l.date === fullDate);
    return found?.emotion || null;
  };

  const getThisWeekFailLogs = () => {
    const weekDates = thisWeek.map(d => d.fullDate);
    return (userInfo.failLogs || []).filter(log =>
      weekDates.includes(log.date?.split('T')[0])
    );
  };

  const weekFailLogs = getThisWeekFailLogs();

  const getMostEmotion = () => {
    const logs = userInfo.dailyEmotions || [];
    const weekDates = thisWeek.map(d => d.fullDate);
    const weekLogs = logs.filter(l => weekDates.includes(l.date));
    if (weekLogs.length === 0) return null;
    const count = {};
    weekLogs.forEach(l => {
      count[l.emotion] = (count[l.emotion] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  };

  const getMostSituation = () => {
    if (weekFailLogs.length === 0) return null;
    const count = {};
    weekFailLogs.forEach(l => {
      if (l.situation) count[l.situation] = (count[l.situation] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  };

  const getLateNightCount = () => {
    return weekFailLogs.filter(l => l.extra?.time === '밤 10시 이후').length;
  };

  const mostEmotion = getMostEmotion();
  const mostSituation = getMostSituation();
  const lateNightCount = getLateNightCount();
  
  const getPatternInsights = () => {
    const insights = [];
    if (weekFailLogs.length === 0) return insights;           

    const emotionSituationMap = {};
    weekFailLogs.forEach(log => {
      if (log.emotion && log.situation) {
        const key = `${log.emotion}_${log.situation}`;
        emotionSituationMap[key] = (emotionSituationMap[key] || 0) + 1;
      }
    });

    const stressTV = (emotionSituationMap['스트레스받아서_TV/유튜브 보다가'] || 0);
    if (stressTV >= 2) {
      insights.push({
        emoji: '📺',
        title: '스트레스 + TV 패턴',
        text: `스트레스받은 날 ${stressTV}번 TV나 유튜브를 보다가 먹었어요. 화면을 보는 게 식욕을 자극하는 패턴이에요.`
      });
    }

    const aloneCount = weekFailLogs.filter(l => l.situation === '혼자 있을 때').length;
    if (aloneCount >= 2) {
      insights.push({
        emoji: '🚪',
        title: '혼자 있을 때 패턴',
        text: `이번 주 혼자 있을 때 ${aloneCount}번 먹게 됐어요. 혼자 있는 시간이 식욕과 연결돼 있을 수 있어요.`
      });
    }

    const lateNightWithBadSleep = weekFailLogs.filter(
      l => l.extra?.time === '밤 10시 이후' && l.extra?.sleep === '거의 못 잤어요'
    ).length;
    if (lateNightWithBadSleep >= 1) {
      insights.push({
        emoji: '😴',
        title: '수면 부족 + 야식 패턴',
        text: `잠을 못 잔 날 밤에 식욕이 올라오는 경향이 있어요. 수면 부족이 식욕 호르몬을 높이는 거예요.`
      });
    }

    const tiredCount = weekFailLogs.filter(l => l.emotion === '힘들어서').length;
    const stressCount = weekFailLogs.filter(l => l.emotion === '스트레스받아서').length;
    if (tiredCount > stressCount && tiredCount >= 2) {
      insights.push({
        emoji: '🪫',
        title: '피로 패턴',
        text: `스트레스보다 힘들어서 먹는 경우가 더 많았어요. 피로가 쌓일수록 식단 조절이 어려워지는 패턴이에요.`
      });
    }

    const peopleCount = weekFailLogs.filter(l => l.extra?.people === '있어요').length;
    if (peopleCount >= 2) {
      insights.push({
        emoji: '🫂',
        title: '감정 소진 패턴',
        text: `누군가에게 맞춰준 날 ${peopleCount}번 먹게 됐어요. 감정을 억누른 뒤 음식으로 보상받으려는 경향이에요.`
      });
    }

    if (insights.length === 0 && weekFailLogs.length > 0) {
      insights.push({
        emoji: '🌱',
        title: '패턴 수집 중',
        text: '아직 데이터가 쌓이는 중이에요. 며칠 더 기록하면 더 선명한 패턴이 보여요.'
      });
    }

    return insights;
  };
  
  const patternInsights = getPatternInsights();

  const weekNutri = thisWeek.map((d) => {
    const log = (userInfo.weeklyNutri || []).find(l => l.date === d.fullDate);
    return {
      label: d.label,
      carbs: log?.carbs || 0,
      protein: log?.protein || 0,
      fat: log?.fat || 0,
    };
  });

  const hasNutriData = weekNutri.some(d => d.carbs > 0 || d.protein > 0 || d.fat > 0);
  const maxValue = Math.max(
  ...weekNutri.map(d => d.carbs),
  ...weekNutri.map(d => d.protein),
  ...weekNutri.map(d => d.fat),
  1
);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주간 리포트</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* 1. 감정 달력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주 감정</Text>
          <View style={styles.calendarRow}>
            {thisWeek.map((day) => {
              const emotion = getEmotionForDate(day.fullDate);
              return (
                <View key={day.label} style={styles.dayBox}>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                  <View style={[
                    styles.emotionCircle,
                    { backgroundColor: emotion ? EMOTION_COLOR[emotion] : '#F0F0F0' }
                  ]} />
                  <Text style={styles.dayDate}>{day.dateStr}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            {Object.entries(EMOTION_EMOJI).map(([key, emoji]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: EMOTION_COLOR[key] }]} />
                <Text style={styles.legendText}>{emoji}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 2. 패턴 발견 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주 패턴 발견</Text>

          {weekFailLogs.length === 0 && !mostEmotion ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                아직 데이터가 부족해요.{'\n'}며칠 더 기록하면 패턴이 보여요.
              </Text>
            </View>
          ) : (
            <View style={styles.patternList}>
              {mostEmotion && (
                <View style={styles.patternItem}>
                  <View style={[styles.patternDot, { backgroundColor: EMOTION_COLOR[mostEmotion[0]] }]} />
                  <View style={styles.patternContent}>
                    <Text style={styles.patternLabel}>가장 많은 감정</Text>
                    <Text style={styles.patternValue}>
                      {EMOTION_EMOJI[mostEmotion[0]]} {mostEmotion[1]}회
                    </Text>
                  </View>
                </View>
              )}
              {weekFailLogs.length > 0 && (
                <View style={styles.patternItem}>
                  <View style={[styles.patternDot, { backgroundColor: '#ffaaa5' }]} />
                  <View style={styles.patternContent}>
                    <Text style={styles.patternLabel}>오늘 망했어요</Text>
                    <Text style={styles.patternValue}>{weekFailLogs.length}회</Text>
                  </View>
                </View>
              )}
              {mostSituation && (
                <View style={styles.patternItem}>
                  <View style={[styles.patternDot, { backgroundColor: '#dcedc1' }]} />
                  <View style={styles.patternContent}>
                    <Text style={styles.patternLabel}>주로 이럴 때 먹었어요</Text>
                    <Text style={styles.patternValue}>{mostSituation[0]}</Text>
                  </View>
                </View>
              )}
              {lateNightCount > 0 && (
                <View style={styles.patternItem}>
                  <View style={[styles.patternDot, { backgroundColor: '#ff8b94' }]} />
                  <View style={styles.patternContent}>
                    <Text style={styles.patternLabel}>밤 10시 이후 섭취</Text>
                    <Text style={styles.patternValue}>{lateNightCount}회</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* 3. 나만의 패턴 */}
        {patternInsights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>나만의 패턴 발견</Text>
            <View style={styles.patternList}>
              {patternInsights.map((insight, i) => (
                <View key={i} style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightText}>{insight.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ③ 탄단지 주간 차트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주 탄단지</Text>

          <View style={styles.chartLegend}>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#FFB347' }]} />
              <Text style={styles.chartLegendText}>탄수화물</Text>
            </View>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#87CEEB' }]} />
              <Text style={styles.chartLegendText}>단백질</Text>
            </View>
            <View style={styles.chartLegendItem}>
              <View style={[styles.chartLegendDot, { backgroundColor: '#98FB98' }]} />
              <Text style={styles.chartLegendText}>지방</Text>
            </View>
          </View>

          {hasNutriData ? (
            <View style={styles.chart}>
              {weekNutri.map((d, i) => {
                const carbsGoal = userInfo.carbs || 1;
                const proteinGoal = userInfo.protein || 1;
                const fatGoal = userInfo.fat || 1;
                
                const carbsNormal = Math.min(d.carbs, carbsGoal);
                const carbsOver = Math.max(d.carbs - carbsGoal, 0);
                const proteinNormal = Math.min(d.protein, proteinGoal);
                const proteinOver = Math.max(d.protein - proteinGoal, 0);
                const fatNormal = Math.min(d.fat, fatGoal);
                const fatOver = Math.max(d.fat - fatGoal, 0);
                
                const maxValue = Math.max(carbsGoal, proteinGoal, fatGoal, d.carbs, d.protein, d.fat, 1);
                return (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.chartBars}>
                   {/* 탄수화물 */}
                    <View style={styles.chartBarCol}>
                      {carbsOver > 0 && (
                        <View style={[styles.chartBar, {
                          height: Math.min((carbsOver / maxValue) * 100, 50),
                          backgroundColor: '#FF4444'
                        }]} />
                      )}
                      <View style={[styles.chartBar, {
                        height: Math.min((carbsNormal / maxValue) * 100, 100),
                        backgroundColor: '#FFB347'
                      }]} />
                    </View> 

                  {/* 단백질 */}
                  <View style={styles.chartBarCol}>
                    {proteinOver > 0 && (
                      <View style={[styles.chartBar, {
                        height: Math.min((proteinOver / maxValue) * 100, 50),
                        backgroundColor: '#FF4444'
                      }]} />
                    )}
                    <View style={[styles.chartBar, {
                      height: Math.min((proteinNormal / maxValue) * 100, 100),
                      backgroundColor: '#87CEEB'
                    }]} />
                  </View>

                  {/* 지방 */}
                  <View style={styles.chartBarCol}>
                    {fatOver > 0 && (
                      <View style={[styles.chartBar, {
                        height: Math.min((fatOver / maxValue) * 100, 50),
                        backgroundColor: '#FF4444'
                      }]} />
                    )}
                    <View style={[styles.chartBar, {
                      height: Math.min((fatNormal / maxValue) * 100, 100),
                      backgroundColor: '#98FB98'
                    }]} />
                  </View></View>
                  <Text style={styles.chartLabel}>{d.label}</Text>
                </View>
                );
                })}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                아직 식단 기록이 없어요.{'\n'}식단을 기록하면 여기서 볼 수 있어요.
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    fontSize: 28,
    color: '#1A2A7A',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  scroll: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBox: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  emotionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDate: {
    fontSize: 10,
    color: '#bbb',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#999',
  },
  emptyBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  patternList: {
    gap: 12,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  patternDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  patternContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternLabel: {
    fontSize: 13,
    color: '#666',
  },
  patternValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLegendText: {
    fontSize: 11,
    color: '#999',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 16,
    paddingBottom: 28,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  chartBars: {
    height : 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    width: '100%',
    justifyContent: 'center',
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 2,
  },
  chartLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    position: 'absolute',
    bottom: -20,
  },
  insightCard: {
  flexDirection: 'row',
  gap: 12,
  backgroundColor: '#F0F2FF',
  borderRadius: 14,
  padding: 16,
  borderWidth: 1,
  borderColor: '#D0D8FF',
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightContent: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2A7A',
  },
  insightText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  chartBarCol: {
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  },
});