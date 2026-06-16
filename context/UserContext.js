import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
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

  const [loaded, setLoaded] = useState(false);

  // 앱 시작 시 저장된 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('userInfo');
        if (saved) {
          setUserInfo(JSON.parse(saved));
        }
      } catch (e) {
        console.log('불러오기 실패:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  // userInfo 바뀔 때마다 저장
  useEffect(() => {
    if (!loaded) return;
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      } catch (e) {
        console.log('저장 실패:', e);
      }
    };
    saveData();
  }, [userInfo, loaded]);

  if (!loaded) return null;

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};