import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, ActivityIndicator
} from 'react-native';
import { useUser } from '../../context/UserContext';

const API_KEY = 'process.env.FOOD_API_KEY';

export default function FoodSearch({ navigation }) {
  const { userInfo, setUserInfo } = useUser();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 음식 검색
  const searchFood = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const url = `https://api.data.go.kr/openapi/tn_pubr_public_nutri_info_api?serviceKey=${API_KEY}&foodNm=${encodeURIComponent(query)}&type=json&numOfRows=1000&pageNo=1`;
      console.log(url);

      const response = await fetch(url);
      const data = await response.json();
      console.log(JSON.stringify(data));

      const items = data?.response?.body?.items;
      console.log('items:', items);        // ← 여기
      console.log('length:', items?.length); // ← 여기

      if (items && items.length > 0) {
        //검색어 포함한 필터링
        const filtered = items.filter(item => item.foodNm && item.foodNm.toLowerCase().includes(query.toLowerCase().trim()));
        setResults(filtered.length > 0 ? filtered : items);
      } else {
        setError('검색 결과가 없어요');
      }
    } catch (e) {
      setError('검색 중 오류가 발생했어요');
    } finally {
      setLoading(false);
    }
  };

  // 음식 선택 → 오늘 식단에 추가
  const handleSelect = (food) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newFood = {
      name: food.foodNm,
      calorie: parseFloat(food.enerc) || 0,
      carbs: parseFloat(food.chocdf) || 0,
      protein: parseFloat(food.prot) || 0,
      fat: parseFloat(food.fatce) || 0,
      sugar: parseFloat(food.sugar) || 0,
    };

    // 오늘 식단에 추가
    setUserInfo(prev => {

      const existingLog = (prev.weeklyNutri || []).find(l => l.date === today);
      const updatedLog = {
        date : today,
        carbs : (existingLog?.carbs || 0) + newFood.carbs,
        protein : (existingLog?.protein || 0) + newFood.protein,
        fat : (existingLog?.fat || 0) + newFood.fat,
      };

      return {
        ...prev,
      todayFoods: [...(prev.todayFoods || []), newFood],
      todayCalorie: (prev.todayCalorie || 0) + newFood.calorie,
      todayCarbs: (prev.todayCarbs || 0) + newFood.carbs,
      todayProtein: (prev.todayProtein || 0) + newFood.protein,
      todayFat: (prev.todayFat || 0) + newFood.fat,
      weeklyNutri : [
        ...(prev.weeklyNutri || []).filter( l => l.date !== today ), updatedLog ],
      };
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ 돌아가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>음식 검색</Text>
      </View>

      {/* 검색창 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="음식 이름을 입력해주세요"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchFood}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchFood}>
          <Text style={styles.searchBtnText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* 직접 입력 버튼 */}
      <TouchableOpacity
        style={styles.manualBtn}
        onPress={() => navigation.navigate('FoodManual')}
      >
        <Text style={styles.manualBtnText}>+ 직접 입력하기</Text>
      </TouchableOpacity>

      {/* 로딩 */}
      {loading && (
        <ActivityIndicator style={{ marginTop: 40 }} color="#000" />
      )}

      {/* 에러 */}
      {error !== '' && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* 검색 결과 */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelect(item)}
          >
            <View style={styles.resultLeft}>
              <Text style={styles.foodName}>{item.foodNm}</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.nutConSrtrQua || '100g 기준'}</Text></View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.typeNm}</Text></View>
                </View>
              </View>

            <View style={styles.resultRight}>
              <Text style={styles.calorie}>{Math.round(item.enerc)} kcal</Text>
              <View style={styles.nutriRow}>
                  <View style={styles.nutriBadge}>
                    <Text style={styles.nutriBadgeLabel}>탄</Text>
                    <Text style={styles.nutriBadgeValue}>{Math.round(item.chocdf)}g</Text>
                  </View>
                  <View style={styles.nutriBadge}>
                    <Text style={styles.nutriBadgeLabel}>단</Text>
                    <Text style={styles.nutriBadgeValue}>{Math.round(item.prot)}g</Text>
                  </View>
                  <View style={styles.nutriBadge}>
                  <Text style={styles.nutriBadgeLabel}>지</Text>
                  <Text style={styles.nutriBadgeValue}>{Math.round(item.fatce)}g</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  back: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  manualBtn: {
    marginHorizontal: 24,
  },
  resultItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 16,
  paddingHorizontal: 24,
  backgroundColor: '#fff',
  },
  resultLeft: {
    flex: 1,
    gap: 6,
    marginRight: 12,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#999',
  },
  resultRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  calorie: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  nutriRow: {
    flexDirection: 'row',
    gap: 4,
  },
  nutriBadge: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  nutriBadgeLabel: {
    fontSize: 10,
    color: '#999',
  },
  nutriBadgeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 24,
  },
});