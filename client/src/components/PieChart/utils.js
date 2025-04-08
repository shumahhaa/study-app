/**
 * パーセンテージを計算し、合計が100%になるように調整する
 * @param {Array} data 円グラフデータ配列
 * @returns {Array} 計算されたパーセンテージ配列
 */
export const calculatePercentages = (data) => {
  // 0より大きい値を持つデータのみをフィルタリング
  const validData = data.filter(item => item.value > 0);
  
  // 有効なデータがない場合は0の配列を返す
  if (validData.length === 0) {
    return data.map(() => 0);
  }
  
  const total = validData.reduce((sum, item) => sum + item.value, 0);
  
  // データがあるが合計が0の場合（あり得ないが念のため）
  if (total <= 0) {
    return data.map(() => 0);
  }
  
  // 各アイテムのパーセンテージを計算（小数点以下2桁まで保持）
  const rawPercentages = data.map(item => item.value > 0 ? (item.value / total) * 100 : 0);
  
  // 整数パーセンテージを計算（切り捨て）
  const intPercentages = rawPercentages.map(p => Math.floor(p));
  
  // パーセンテージの合計を計算
  const totalPercentage = intPercentages.reduce((sum, p) => sum + p, 0);
  
  // 100%に足りない分を、小数部分が大きい順に分配
  const remainder = 100 - totalPercentage;
  
  if (remainder > 0) {
    // 小数部分でソートするためのインデックス付き配列
    const fractionalParts = rawPercentages
      .map((p, i) => ({ index: i, value: p - Math.floor(p) }))
      .filter(item => item.value > 0) // 小数部分がある項目のみ
      .sort((a, b) => b.value - a.value); // 小数部分の大きい順にソート
    
    // 残りのパーセンテージを分配
    const finalPercentages = [...intPercentages];
    for (let i = 0; i < remainder && i < fractionalParts.length; i++) {
      finalPercentages[fractionalParts[i].index]++;
    }
    
    return finalPercentages;
  } else {
    return intPercentages;
  }
}; 