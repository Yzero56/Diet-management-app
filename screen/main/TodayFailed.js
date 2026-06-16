import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, TextInput
} from 'react-native';
import { useUser } from '../../context/UserContext';

const 추가질문_풀 = [
  { id: 'sleep', question: '어젯밤 잠을 잘 잤어요?', options: ['잘 잤어요', '별로였어요', '거의 못 잤어요'], key: 'sleep' }, // 수면
  { id: 'people', question: '오늘 누군가한테 맞춰준 일이 있었어요?', options: ['있어요', '없어요', '잘 모르겠어요'], key: 'people' }, // 인간관계
  { id: 'time', question: '먹고 싶었던 게 언제였어요?', options: ['점심 전', '오후', '저녁', '밤 10시 이후'], key: 'time' }, // 식사 시간
  { id: 'alone', question: '그 순간 혼자였어요?', options: ['혼자였어요', '사람들이랑 있었어요', '기억 안 나요'], key: 'alone' }, // 식사 상황
];

const getRandomQuestion = () => {
  const idx = Math.floor(Math.random() * 추가질문_풀.length);
  return 추가질문_풀[idx];
};

const getInsight = (emotion, situation, extra) => {
  if (emotion === '스트레스받아서' && situation === '혼자 있을 때') {
    return '스트레스받고 혼자 있을 때 가장 먹고 싶어지는 패턴이 보여요.';
  }
  if (emotion === '힘들어서' && extra?.sleep === '거의 못 잤어요') {
    return '잠을 못 잔 날 더 많이 지치고, 먹는 걸로 풀려는 경향이 있어요.';
  }
  if (situation === 'TV/유튜브 보다가') {
    return 'TV나 유튜브 볼 때 자동으로 손이 가는 패턴이에요.';
  }
  if (extra?.time === '밤 10시 이후') {
    return '밤 10시 이후에 특히 식욕이 올라오는 경향이 있어요.';
  }
  if (emotion === '스트레스받아서') {
    return '스트레스가 식욕을 높이는 패턴이 보여요. 이것도 나에 대한 발견이에요.';
  }
  return '오늘 답변이 패턴 데이터로 쌓였어요. 며칠 후 더 선명해져요.';
};

const BG_COLORS = {
  1: '#ffd3b6',
  2: '#ffaaa5',
  3: '#dcedc1',
  4: '#a8e6cf',
};

export default function TodayFailed({ navigation }) {
  const { userInfo, setUserInfo } = useUser();
  const [step, setStep] = useState(1);
  const [emotion, setEmotion] = useState('');
  const [situation, setSituation] = useState('');
  const [extraAnswer, setExtraAnswer] = useState({});
  const [randomQ] = useState(getRandomQuestion());
  const [wakeTime, setWakeTime] = useState('');
  const [customInput, setCustomInput] = useState({
    emotion : '',
    situation : '',
    extra : '',
  })

  const saveLog = (wake) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const log = {
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      emotion : emotion === '기타' ? customInput.emotion : emotion,
      situation : situation === '기타' ? customInput.situation : situation,
      extra: { ...extraAnswer, [randomQ.key] : extraAnswer[randomQ.key] === '기타' ? customInput.extra : extraAnswer[randomQ.key], wakeTime: wake },
    };
    setUserInfo(prev => ({
      ...prev,
      failLogs: [...(prev.failLogs || []), log], 
      dailyEmotions : [
        ...(prev.dailyEmotions || []).filter(l => l.date !== today), {date : today, emotion : 'failed'}
      ],
    }));
  };

  const totalLogs = (userInfo.failLogs?.length || 0) + 1;
  const progress = Math.min((totalLogs / 7) * 100, 100);
  const daysLeft = Math.max(7 - totalLogs, 0);

  return (
    <View style={[styles.container, { backgroundColor: BG_COLORS[step] }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* 닫기 */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Step 1: 공감 + 감정 */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.emoji}>👌</Text>
            <Text style={styles.title}>괜찮아요.{'\n'}오늘도 데이터가 됐어요.</Text>
            <Text style={styles.sub}>오늘 뭔가 먹게 된 이유가{'\n'}뭔 것 같아요?</Text>

            <View style={styles.optionList}>
              {['스트레스받아서', '힘들어서', '배고파서', '사람들이랑 있어서'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, emotion === opt && styles.optionSelected]}
                  onPress={() => setEmotion(opt)}
                >
                  <Text style={[styles.optionText, emotion === opt && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 기타 버튼 */}
              <TouchableOpacity
                style = {[styles.optionBtn, emotion === '기타' && styles.optionSelected]}
                onPress = {() => setEmotion('기타')}>

                <Text style={[styles.optionText, emotion === '기타' && styles.optionTextSelected]}>기타</Text>
              </TouchableOpacity>

              {/* 기타 선택 시 입력 창 */}
              {emotion === '기타' && (
                <TextInput
                  style = {styles.customInput}
                  placeholder="직접 입력"
                  placeholderTextColor="#aaa"
                  value={customInput.emotion}
                  onChangeText={(text) => setCustomInput(prev => ({ ...prev, emotion : text }))}/>
              )}
            </View>

            <TouchableOpacity
              style={[styles.btn, !emotion && styles.btnDisabled]}
              onPress={() => setStep(2)}
              disabled={!emotion || (emotion === '기타' && !customInput.emotion)}
            >
              <Text style={styles.btnText}>다음</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: 상황 */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.emoji}>🔍</Text>
            <Text style={styles.title}>그 순간{'\n'}어떤 상황이었어요?</Text>

            <View style={styles.optionList}>
              {['혼자 있을 때', 'TV/유튜브 보다가', '일하다가', '사람들이랑 있을 때', '기억 안 나요'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, situation === opt && styles.optionSelected]}
                  onPress={() => setSituation(opt)}
                >
                  <Text style={[styles.optionText, situation === opt && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 기타 버튼 */}
              <TouchableOpacity 
              style = {[styles.optionBtn, situation === '기타' && styles.optionSelected]}
              onPress = {() => setSituation('기타')}>

              <Text style={[styles.optionText, situation === '기타' && styles.optionTextSelected]}>기타</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.btn, !situation && styles.btnDisabled]}
              onPress={() => setStep(3)}
              disabled={!situation || (situation === '기타' && !customInput.situation)}
            >
              <Text style={styles.btnText}>다음</Text>
            </TouchableOpacity>

            {/* 기타 선택 시 입력창 */}
            {situation === '기타' && (
              <TextInput
                style={styles.customInput}
                placeholder="직접 입력"
                placeholderTextColor="#aaa"
                value={customInput.situation}
                onChangeText={(text) => setCustomInput(prev => ({ ...prev, situation : text }))}/>
            )}
          </View>
        )}

        {/* Step 3: 랜덤 추가 질문 */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.emoji}>💭</Text>
            <Text style={styles.title}>하나만 더{'\n'}물어볼게요</Text>
            <Text style={styles.sub}>{randomQ.question}</Text>

            <View style={styles.optionList}>
              {randomQ.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, extraAnswer[randomQ.key] === opt && styles.optionSelected]}
                  onPress={() => setExtraAnswer({ [randomQ.key]: opt })}
                >
                  <Text style={[styles.optionText, extraAnswer[randomQ.key] === opt && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 기타 버튼 */}
              <TouchableOpacity
                style={[styles.optionBtn, extraAnswer[randomQ.key] === '기타' && styles.optionSelected]}
                onPress = {() => setExtraAnswer({ [randomQ.key] : '기타' })}>

                <Text style = {[styles.optionText, extraAnswer[randomQ.key] === '기타' && styles.optionTextSelected]}>기타</Text>
              </TouchableOpacity>

              {/* 기타 선택 시 입력창 */}
              {extraAnswer[randomQ.key] === '기타' && (
                <TextInput 
                  style = {styles.customInput}
                  placeholder = "직접 입력"
                  placeholderTextColor = "#aaa"
                  value = {customInput.extra}
                  onChangeText={(text) => setCustomInput(prev => ({ ...prev, extra : text }))}/>
              )}
            </View>

            <TouchableOpacity
              style={[styles.btn, !extraAnswer[randomQ.key] && styles.btnDisabled]}
              onPress={() => setStep(4)}
              disabled={!extraAnswer[randomQ.key] || (extraAnswer[randomQ.key] === '기타' && !customInput.extra)}
            >
              <Text style={styles.btnText}>다음</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: 발견 + 내일 시작 */}
        {step === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>오늘의 발견</Text>

            {/* 즉각 인사이트 */}
            <View style={styles.insightBox}>
              <Text style={styles.insightLabel}>WAI 분석</Text>
              <Text style={styles.insightText}>
                {getInsight(emotion, situation, extraAnswer)}
              </Text>
            </View>

            {/* 패턴 진행 바 */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>패턴 발견까지</Text>
                <Text style={styles.progressCount}>
                  {daysLeft > 0 ? `${daysLeft}일 더` : '패턴 발견!'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressSub}>
                {daysLeft > 0
                  ? `${daysLeft}일 후 나만의 패턴을 발견할 수 있어요`
                  : '패턴 리포트를 확인해봐요!'}
              </Text>
            </View>

            {/* 내일 시작 시간 */}
            <Text style={styles.wakeTitle}>내일 오전 몇 시에 시작할까요?</Text>
            <View style={styles.timeGrid}>
              {['7시', '8시', '9시', '10시'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeBtn, wakeTime === t && styles.timeBtnSelected]}
                  onPress={() => setWakeTime(t)}
                >
                  <Text style={[styles.timeBtnText, wakeTime === t && styles.timeBtnTextSelected]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 예고 */}
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                💡 내일 질문은 오늘과 조금 달라요
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.btn, !wakeTime && styles.btnDisabled]}
              onPress={() => {
                saveLog(wakeTime);
                setUserInfo(prev => ({
                  ...prev, emotionAnswered : true, selectedEmotion : 'failed',
                }));
                navigation.navigate('MainScreen');
              }}
              disabled={!wakeTime}
            >
              <Text style={styles.btnText}>내일 다시 시작하기</Text>
            </TouchableOpacity>

          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.3)',
  },
  stepBox: {
    flex: 1,
    gap: 16,
    paddingTop: 40,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    lineHeight: 36,
  },
  sub: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionList: {
    gap: 10,
    marginTop: 8,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  optionSelected: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  optionText: {
    fontSize: 15,
    color: '#666',
  },
  optionTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  insightBox: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },
  insightLabel: {
    fontSize: 11,
    color: '#555',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  insightText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 13,
    color: '#555',
  },
  progressCount: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#333',
    borderRadius: 3,
  },
  progressSub: {
    fontSize: 12,
    color: '#777',
  },
  wakeTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  timeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  timeBtnSelected: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  timeBtnText: {
    fontSize: 14,
    color: '#666',
  },
  timeBtnTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  previewBox: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 13,
    color: '#555',
  },
  customInput : {
    borderWidth : 1,
    borderColor : 'rgba(0, 0, 0, 0.15)',
    borderRadius : 12,
    padding : 14,
    fontSize : 14,
    color : '#333',
    backgroundColor : 'rgba(255, 255, 255, 0.7)',
  },
});