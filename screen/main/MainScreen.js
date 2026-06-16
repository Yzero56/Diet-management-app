import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Modal
} from 'react-native';
import { useUser } from '../../context/UserContext';

// 감정 질문 선택지
const 감정_옵션 = [
  { label: '😊 좋았어요', value: 'good' },
  { label: '😐 보통이에요', value: 'normal' },
  { label: '😔 힘들었어요', value: 'bad' },
  { label: '😤 스트레스 받았어요', value: 'stress' },
];

const 감정별_식단제안 = {
  good: {
    comment: '좋은 하루네요! 오늘처럼 컨디션 좋은 날 식단을 잘 챙기면 더 좋아요.',
    tip: '균형 잡힌 식단으로 좋은 컨디션을 유지해요.',
    foods: ['현미밥 + 닭가슴살 구이', '채소 샐러드 + 삶은 달걀'],
  },
  normal: {
    comment: '무난한 하루였군요. 규칙적인 식사가 컨디션 유지에 도움이 돼요.',
    tip: '오늘은 단백질을 좀 더 챙겨봐요.',
    foods: ['두부 된장찌개 + 잡곡밥', '닭가슴살 샐러드'],
  },
  bad: {
    comment: '힘든 날엔 간단하고 따뜻한 게 최고예요. 무리하지 말고 가볍게 먹어요.',
    tip: '지친 날엔 소화가 잘 되는 음식이 좋아요.',
    foods: ['계란죽', '미역국 + 흰밥'],
  },
  stress: {
    comment: '스트레스받은 날 탄수화물이 당기는 건 자연스러워요. 단백질 위주로 먹으면 포만감이 오래 가요.',
    tip: '스트레스받을 때 단 음식 대신 이걸 먹어봐요.',
    foods: ['닭가슴살 샐러드', '두부 + 나물 비빔밥'],
  },
  failed : {
    comment: '오늘 수고했어요.',
    tip : '내일 아침은 이걸로 가볍게 시작해봐요.'
  }
};

const 패턴유형_요약 = {
  '감정적 섭식': {
    emoji: '🌋',
    color: '#FF6B6B',
    bg: '#FFF0F0',
    desc: '스트레스받을 때 식단 관리가 핵심이에요',
  },
  '무의식적 섭식': {
    emoji: '🌊',
    color: '#4A90D9',
    bg: '#F0F5FF',
    desc: '나도 모르게 먹는 습관을 발견했어요',
  },
  '악순환 섭식': {
    emoji: '🔄',
    color: '#FF9800',
    bg: '#FFF8F0',
    desc: '한 번 무너져도 괜찮아요. 다시 시작하면 돼요',
  },
  '균형 섭식': {
    emoji: '⚖️',
    color: '#2A9D5C',
    bg: '#F0FFF5',
    desc: '비교적 안정적인 식습관을 가지고 있어요',
  },
};

// 실패 시의 식단 제안
const getFailedSuggestion = (lastLog) => {
  const emotion = lastLog?.emotion;
  const situation = lastLog?.situation;
  const extra = lastLog?.extra;

  if (emotion === '스트레스받아서' && situation === '혼자 있을 때') {
    return {
      comment : '스트레스받고 혼자 있을 때 가장 힘드네요. 혼자 있는 시간이 식욕을 높이고 있어요.',
      tip : `혼자 있을 때 식욕이 올라오면 먼저 따뜻한 물을 마시거나 양치질을 해봐요.\n 내일 아침은 이걸로 가볍게 시작해봐요.`,
      tomorrowFoods : ['현미밥 + 계란후라이', '그릭요거트 + 블루베리']
    };
  }
  if (emotion === '스트레스받아서' && situation === 'TV/유튜브 보다가') {
    return {
      comment : 'TV 볼 때 스트레스까지 겹치면 손이 자동으로 가요. 흔한 패턴이에요.',
      tip : `TV 볼 때 헤비한 간식 대신 방울토마토나 소량의 견과류로 바꿔보는 게 도움이 돼요.\n내일은 이 식단으로 재출발해볼까요?`,
      tomorrowFoods : ['오트밀 + 과일', '삶은 달걀 + 통밀빵'],
    };
  }
  if (emotion === '힘들어서' && extra?.sleep === '거의 못 잤어요') {
    return {
      comment : '잠을 못 잔 날 더 힘들고, 먹는 걸로 에너지를 채우려는 경향이 있어요.',
      tip : '오늘은 일찍 잠자리에 들어 에너지를 보충하는 게 중요해요.',
      tomorrowFoods : ['계란죽', '아몬드 + 따뜻한 두유'],
    };
  }
  if (emotion === '힘들어서') {
    return {
      comment : '지친 날은 억지로 식단을 지키려하지 않아도 돼요.',
      tip : '내일 아침 식사 후 가벼운 산책 15분만 해봐요. 지친 날 무리한 운동보다 가벼운 움직임이 컨디션 회복에 도움이 돼요.',
      tomorrowFoods : ['미역국 + 흰밥', '계란죽'],
    };
  }
  if(extra?.time === '밤 10시 이후') {
    return {
      comment : '밤 10시 이후에 식욕이 올라오는 경향이 있어요.',
      tip : '내일은 저녁 식사를 조금 더 든든하게 먹어봐요.',
      tomorrowFoods : ['잡곡밥 + 닭가슴살', '두부 된장찌개']
    };
  }
  
  return {
    comment : '오늘 수고했어요. 망한 날의 패턴도 데이터가 돼요.',
    tip : '내일은 이 메뉴로 다시 시작해볼까요?',
    tomorrowFoods : ['따뜻한 국물 요리', '계란죽 or 흰죽']
  };
};

export default function MainScreen({ navigation }) {
  const { userInfo, setUserInfo } = useUser();

  // 감정 답변 상태
  const emotionAnswered = userInfo.emotionAnswered || false;
  const selectedEmotion = userInfo.selectedEmotion || '';

  // 실패이유 팝업 상태
  const [showFailModal, setShowFailModal] = useState(!userInfo.failReason);

  // 오늘 날짜
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 감정 답변 처리
  const handleEmotion = (emotion) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setUserInfo(prev => ({
      ...prev, emotionAnswered : true, selectedEmotion : emotion.value,
      dailyEmotions : [
        ...(prev.dailyEmotions || []).filter(l => l.date !== today), { date : today, emotion : emotion.value }
      ],
    }));
  };

  // 실패이유 저장
  const handleFailReason = () => {
    setUserInfo(prev => ({ ...prev, failReason: selectedFail }));
    setShowFailModal(false);
  };
  
  return (
    <View style={styles.wrap}>

      {/* 실패 이유 팝업 — 처음 한 번만 */}
      <Modal
        visible={showFailModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {/* 건너뛰기 */}
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => setShowFailModal(false)}>
              <Text style={styles.skipText}>건너뛰기</Text>
            </TouchableOpacity>

                <Text style={styles.modalTitle}>이전에 다이어트를{'\n'}해본 적 있어요?</Text>
                <Text style={styles.modalSub}>솔직하게 말해줘도 괜찮아요</Text>

                <View style={styles.failOptions}>
                  <TouchableOpacity
                    style={styles.failBtn}
                    onPress={() => {
                      setShowFailModal(false);
                      navigation.navigate('PatternIntro');
                    }}
                  >
                    <Text style={styles.failBtnText}>있어요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.failBtn}
                    onPress={() => {
                      setUserInfo(prev => ({ ...prev, failReason: '처음이에요' }));
                      setShowFailModal(false);
                    }}
                  >
                    <Text style={styles.failBtnText}>처음이에요</Text>
                  </TouchableOpacity>
                </View>
          </View>
      </View>
    </Modal>

      <ScrollView contentContainerStyle={styles.container}>

        {/* 상단 날짜 + 이름 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.nameText}>{userInfo.name}님의 하루</Text>
          </View>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>{userInfo.mainGoal}</Text>
          </View>
        </View>

        {/* 감정 질문 카드 */}
        <View style={styles.emotionCard}>
          {!emotionAnswered ? (
            <>
              <Text style={styles.emotionTitle}>오늘 하루 어땠어요?</Text>
              <Text style={styles.emotionSub}>답변하면 오늘의 식단 카드가 열려요</Text>
              <View style={styles.emotionOptions}>
                {감정_옵션.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.emotionBtn}
                    onPress={() => handleEmotion(option)}
                  >
                    <Text style={styles.emotionBtnText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 오늘 망했어요 버튼 */}
              <TouchableOpacity style={styles.failDayBtn}
              onPress={() => navigation.navigate('TodayFailed')}>
                <Text style={styles.failDayText}>오늘 망했어요</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emotionDone}>
              <Text style={styles.emotionDoneSub}>오늘 감정이 기록됐어요</Text>
              <Text style={styles.emotionDoneText}>
                {감정_옵션.find(e => e.value === selectedEmotion)?.label}
              </Text>
            </View>
          )}
        </View>

        {/* 패턴 유형 카드 — 감정 답변 전에 항상 보임 */}
        {!emotionAnswered && (
          userInfo.patternDone && userInfo.patternTypes?.length > 0 ? (
            <TouchableOpacity
              style={[styles.patternCard, {
                backgroundColor: 패턴유형_요약[userInfo.patternTypes[0]]?.bg,
                borderColor: 패턴유형_요약[userInfo.patternTypes[0]]?.color,
              }]}
              onPress={() => navigation.navigate('PatternResult')}
            >
              <View style={styles.patternCardLeft}>
                <Text style={styles.patternCardEmoji}>
                  {패턴유형_요약[userInfo.patternTypes[0]]?.emoji}
                </Text>
                <View style={styles.patternCardInfo}>
                  <Text style={styles.patternCardLabel}>나의 식습관 유형</Text>
                  <Text style={[styles.patternCardType, {
                    color: 패턴유형_요약[userInfo.patternTypes[0]]?.color
                  }]}>                        
                    {userInfo.patternTypes[0]}
                  </Text>
                  <Text style={styles.patternCardDesc}>
                    {패턴유형_요약[userInfo.patternTypes[0]]?.desc}
                  </Text>
                </View>
              </View>
              <Text style={styles.patternCardArrow}>›</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => navigation.navigate('PatternIntro')}
            >
              <View>
                <Text style={styles.reportTitle}>나의 식습관 유형이 궁금해요?</Text>
                <Text style={styles.reportSub}>10개의 질문으로 패턴을 발견해봐요</Text>
              </View>
              <Text style={styles.reportArrow}>›</Text>
            </TouchableOpacity>
          ))}
          
        {/* 감정 답변 후에만 보이는 영역 */}
        {emotionAnswered && (
          <>
            {/* WAI 분석 코멘트 */}
            <View style={styles.waiComment}>
              <Text style={styles.waiLabel}>WAI 분석</Text>

              {/* 코멘트 */}
              <Text style={styles.waiText}>
                {selectedEmotion === 'failed' ? getFailedSuggestion(userInfo.failLogs?.[userInfo.failLogs.length - 1]).comment : 감정별_식단제안[selectedEmotion]?.comment}
              </Text>

            {/* 오늘의 팁 */}
            <Text style={styles.waiTip}>
              💡 {selectedEmotion === 'failed' ? getFailedSuggestion(userInfo.failLogs?.[userInfo.failLogs.length - 1]).tip : 감정별_식단제안[selectedEmotion]?.tip}</Text>
            
            {/* 추천 식단 타이틀 */}
            <Text style = {styles.waiMenuTitle}>
              {selectedEmotion === 'failed' ? '내일 추천 식단' : '오늘 추천 식단'}
            </Text>

            {/* 추천 식단 */}
            {(selectedEmotion === 'failed' ? getFailedSuggestion(userInfo.failLogs?.[userInfo.failLogs.length - 1]).tomorrowFoods : 감정별_식단제안[selectedEmotion]?.foods)?.map((food, index) => (
              <View key={index} style={styles.waiMenuItem}>
                <View style={styles.waiMenuDot} />
                <Text style={styles.waiMenuText}>{food}</Text>
              </View>
              ))}
            </View>
            
            {/* 칼로리 카드 */}
            <View style={styles.calorieCard}>
              <View style={styles.calorieHeader}>
                <Text style={styles.calorieTitle}>오늘 칼로리</Text>
                {/* 기록하기 버튼 */}
                  <TouchableOpacity onPress={() => navigation.navigate('FoodSearch')}>
                    <Text style={styles.calorieAdd}>+ 기록하기</Text>
                  </TouchableOpacity>
              </View>
              {/* 칼로리 수치 */}
              <Text style={styles.calorieValue}>
                {Math.round(userInfo.todayCalorie || 0).toLocaleString()} / {userInfo.targetCalorie?.toLocaleString()} kcal
              </Text>

              {/* 진행 바 */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((userInfo.todayCalorie / userInfo.targetCalorie) * 100, 100)}%` }]} />
              </View>
              <Text style={styles.calorieRemain}>
                {Math.max(userInfo.targetCalorie - (userInfo.todayCalorie || 0), 0).toLocaleString()} kcal 더 먹을 수 있어요
              </Text>
            </View>

            {/* 탄단지 카드 */}
            <View style={styles.nutriCard}>
              {[
                { label: '탄수화물', today: userInfo.todayCarbs, goal: userInfo.carbs, color: '#FFB347' },
                { label: '단백질', today: userInfo.todayProtein, goal: userInfo.protein, color: '#87CEEB' },
                { label: '지방', today: userInfo.todayFat, goal: userInfo.fat, color: '#98FB98' },
              ].map((item, index) => {
                const exceeded = (item.today || 0) > item.goal;
                return (
                  <React.Fragment key={item.label}>
                    {index !== 0 && <View style={styles.nutriDivider} />}
                    <View style={styles.nutriItem}>
                      <Text style={styles.nutriLabel}>{item.label}</Text>
                      <View style={styles.nutriValueRow}>
                        <Text style={[styles.nutriValue, exceeded && styles.nutriExceeded]}>
                          {Math.round(item.today || 0)} / {item.goal}g
                        </Text>
                        {exceeded && <Text style={styles.nutriWarning}>  !</Text>}
                      </View>
                      <View style={styles.nutriBar}>
                        <View style={[styles.nutriFill, {
                          width: `${Math.min((item.today || 0) / item.goal * 100, 100)}%`,
                          backgroundColor: exceeded ? '#FF4444' : item.color
                        }]} />
                      </View>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>

            {/* 주간 리포트 버튼 */}
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => navigation.navigate('ReportScreen')}
            >
              <View>
                <Text style={styles.reportTitle}>주간 패턴 리포트</Text>
                <Text style={styles.reportSub}>이번 주 기록 쌓는 중</Text>
              </View>
              <Text style={styles.reportArrow}>›</Text>
            </TouchableOpacity>

          </>
        )}

      {/* 개발자용 초기화 버튼 */}
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={() => {
          setUserInfo({
            name: '',
            birth: '',
            gender: '',
            height: '',
            weight: '',
            mainGoal: '',
            subGoal: '',
            targetWeight: '',
            targetPeriod: '',
            bmr: 0,
            tdee: 0,
            targetCalorie: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
            activity: '',
            failReason: '',
            patternScores: null,
            patternTypes: [],
            patternDone: false,
            todayFoods: [],
            todayCalorie: 0,
            todayCarbs: 0,
            todayProtein: 0,
            todayFat: 0,
            failLogs: [],
            dailyAnswers: [],
            dailyEmotions: [],
            weeklyNutri: [],
            emotionAnswered: false,
            selectedEmotion: '',
          });
          navigation.navigate('SplashScreen');
        }}
      >
        <Text style={styles.resetBtnText}>초기화</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 20,
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
  },
  emotionCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  emotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  emotionSub: {
    fontSize: 12,
    color: '#999',
  },
  emotionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  emotionBtnText: {
    fontSize: 13,
    color: '#666',
  },
  failDayBtn: {
    borderWidth: 1,
    borderColor: '#FFE0E0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  failDayText: {
    fontSize: 13,
    color: '#FF6B6B',
  },
  emotionDone: {
    alignItems: 'center',
    gap: 4,
  },
  emotionDoneText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emotionDoneSub: {
    fontSize: 12,
    color: '#999',
  },
  waiComment: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  waiLabel: {
    fontSize: 10,
    color: '#FF9800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  waiText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  calorieCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieTitle: {
    fontSize: 13,
    color: '#999',
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 3,
  },
  calorieRemain: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'right',
  },
  calorieAdd: {
    fontSize: 13,
    color: '#999',
  },
  nutriCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 8,
  },
  nutriItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  nutriLabel: {
    fontSize: 11,
    color: '#999',
  },
  nutriValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  nutriBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  nutriFill: {
    height: '100%',
    borderRadius: 2,
  },
  nutriDivider: {
    width: 0.5,
    backgroundColor: '#E0E0E0',
  },
  reportBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reportSub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  reportArrow: {
    fontSize: 24,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 16,
    position: 'relative',
  },
  skipBtn: {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
  },
  skipText: {
    fontSize: 13,
    color: '#bbb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  modalSub: {
    fontSize: 13,
    color: '#999',
    lineHeight: 20,
  },
  failOptions: {
    gap: 8,
  },
  failBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
  },
  failBtnText: {
    fontSize: 13,
    color: '#999',
  },
  waiTip: {
  fontSize: 12,
  color: '#FF9800',
  lineHeight: 18,
  marginTop: 4,
  },
  waiMenuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 10,
    marginBottom: 6,
  },
  waiMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  waiMenuDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF9800',
  },
  waiMenuText: {
    fontSize: 13,
    color: '#666',
  },
  nutriValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutriExceeded: {
    color: '#FF4444',
    fontWeight: '700',
  },
  nutriWarning: {
    color: '#FF4444',
    fontWeight: '900',
    fontSize: 14,
  },
  patternCard: {
  borderWidth: 1,
  borderRadius: 16,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
  },
  patternCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  patternCardEmoji: {
    fontSize: 32,
    lineHeight: 40,
  },
  patternCardInfo: {
    flex: 1,
    gap: 2,
  },
  patternCardLabel: {
    fontSize: 11,
    color: '#999',
  },
  patternCardType: {
    fontSize: 16,
    fontWeight: '700',
  },
  patternCardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  patternCardArrow: {
    fontSize: 20,
    color: '#999',
  },
  resetBtn: {
  alignSelf: 'center',
  padding: 6,
  marginBottom: 8,
  },
  resetBtnText: {
    fontSize: 10,
    color: '#ccc',
  },
});