import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './context/UserContext';

// 화면 불러오기
import SplashScreen from './screen/SplashScreen';
import Step1 from './screen/onboarding/Step1';
import Step2 from './screen/onboarding/Step2';
import Step3 from './screen/onboarding/Step3';
import Step4 from './screen/onboarding/Step4';
import Step5 from './screen/onboarding/Step5';
import MainScreen from './screen/main/MainScreen';
import ReportScreen from './screen/main/ReportScreen';
import FoodSearch from './screen/main/FoodSearch';
import PatternIntro from './screen/main/PatternIntro';
import PatternTest from './screen/main/PatternTest';
import PatternResult from './screen/main/PatternResult';
import TodayFailed from './screen/main/TodayFailed';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          
          {/* 온보딩 */}
          <Stack.Screen name="Step1" component={Step1} options={{ headerShown: false }} />
          <Stack.Screen name="Step2" component={Step2} options={{ headerShown: false }} />
          <Stack.Screen name="Step3" component={Step3} options={{ headerShown: false }} />
          <Stack.Screen name="Step4" component={Step4} options={{ headerShown: false }} />
          <Stack.Screen name="Step5" component={Step5} options={{ headerShown: false }} />

          {/* 메인 */}
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FoodSearch" component={FoodSearch} options={{ headerShown: false }} />

          {/* 실패 이유 */}
          <Stack.Screen name="PatternIntro" component={PatternIntro} options={{ headerShown: false }} />
          <Stack.Screen name="PatternTest" component={PatternTest} options={{ headerShown: false }} />
          <Stack.Screen name="PatternResult" component={PatternResult} options={{ headerShown: false }} />

          {/* 오늘 망했어요 플로우 */}
          <Stack.Screen name="TodayFailed" component={TodayFailed} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}