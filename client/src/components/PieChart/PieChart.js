import React, { useState, useEffect } from 'react';
import styles from './styles';
import ChartSVG from './ChartSVG';
import Legend from './Legend';
import { calculatePercentages } from './utils';

/**
 * 円グラフコンポーネント
 * @param {Array} data - グラフデータの配列。各項目は {label: string, value: number} 形式
 * @param {Array} colors - 色の配列
 * @param {Function} formatTime - 時間のフォーマット関数
 * @param {number} legendColumns - 凡例の列数
 */
const PieChart = ({ data, colors, formatTime, legendColumns = 4 }) => {
  const [percentages, setPercentages] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      setReady(false);
      return;
    }
    
    // 初期化時にreadyをfalseにリセット
    setReady(false);
    
    // パーセンテージを計算
    const calculatedPercentages = calculatePercentages(data);
    setPercentages(calculatedPercentages);
    
    // パーセント計算が終わったことをマーク
    setReady(true);
  }, [data]);

  if (!data || data.length === 0) {
    return <div>データがありません</div>;
  }

  // 0より大きい値を持つデータのみをフィルタリング
  const validData = data.filter(item => item.value > 0);
  
  // 有効なデータがない場合
  if (validData.length === 0) {
    return <div>有効なデータがありません</div>;
  }
  
  // データの準備ができていない場合
  if (!ready) {
    return <div>グラフデータを準備中...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartContainer}>
        <ChartSVG 
          percentages={percentages} 
          colors={colors} 
          data={data} 
        />
      </div>
      <Legend 
        data={data} 
        colors={colors} 
        percentages={percentages}
        formatTime={formatTime} 
        legendColumns={legendColumns}
      />
    </div>
  );
};

export default PieChart; 