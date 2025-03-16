// サンプルデータ生成ユーティリティ

// 学習トピックのリスト
const topics = [
  "JavaScript",
  "React",
  "HTML/CSS",
  "Python",
  "データベース",
  "英語",
  "数学",
  "機械学習",
  "統計学",
  "ネットワーク"
];

// 過去の日付を生成する関数
const getRandomPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  return date;
};

// 学習時間を生成する関数（分単位）
const getRandomDuration = () => {
  // 15分から3時間の間でランダム
  return Math.floor(Math.random() * (180 - 15 + 1) + 15) * 60;
};

// モチベーションを生成する関数
const getRandomMotivation = () => {
  return Math.floor(Math.random() * 5) + 1;
};

// 休憩時間を生成する関数
const getRandomPausedTime = (duration) => {
  // 学習時間の0%〜20%をランダムに休憩時間とする
  return Math.floor(Math.random() * (duration * 0.2));
};

// サンプルデータを生成する関数
export const generateSampleData = (count = 30) => {
  const sampleData = [];
  
  for (let i = 0; i < count; i++) {
    const startTime = getRandomPastDate(60).getTime(); // 過去60日以内
    const duration = getRandomDuration();
    const pausedTime = getRandomPausedTime(duration);
    const endTime = startTime + duration * 1000 + pausedTime * 1000;
    
    sampleData.push({
      topic: topics[Math.floor(Math.random() * topics.length)],
      motivation: getRandomMotivation(),
      duration: duration,
      startTime: startTime,
      endTime: endTime,
      pausedTime: pausedTime,
      timestamp: new Date(startTime)
    });
  }
  
  return sampleData;
}; 