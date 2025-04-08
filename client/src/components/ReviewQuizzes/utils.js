// 日付型に変換するヘルパー関数
export const toDateObject = (dateValue) => {
  if (!dateValue) return null;
  
  // すでにDateオブジェクトの場合はそのまま返す
  if (dateValue instanceof Date) return dateValue;
  
  // Firestoreのtimestampオブジェクトの場合
  if (typeof dateValue === 'object' && dateValue.toDate) {
    return dateValue.toDate();
  }
  
  // バックエンドから返された通常のJSONオブジェクトの場合
  if (dateValue && typeof dateValue === 'object' && dateValue._seconds !== undefined) {
    return new Date(dateValue._seconds * 1000);
  }
  
  // ISO文字列または数値の場合
  try {
    return new Date(dateValue);
  } catch (e) {
    console.error("日付変換エラー:", e, dateValue);
    return null; // エラーの場合はnullを返す
  }
};

// 日付を安全にフォーマットする関数
export const formatDateSafe = (dateValue, formatType = "short") => {
  try {
    const date = toDateObject(dateValue);
    if (!date) return "不明な日付";
    
    if (formatType === "full") {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  } catch (e) {
    console.error("日付フォーマットエラー:", e, dateValue);
    return "不明な日付";
  }
};

// 日付をフォーマットする関数
export const formatDate = (dateValue) => {
  if (!dateValue) return '不明';
  
  try {
    const date = toDateObject(dateValue);
    if (!date) return '不明';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateDay = new Date(date);
    dateDay.setHours(0, 0, 0, 0);
    
    if (dateDay < today) {
      return '期限切れ';
    } else if (isSameDay(dateDay, today)) {
      return '今日';
    } else if (isSameDay(dateDay, tomorrow)) {
      return '明日';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  } catch (e) {
    console.error("日付フォーマットエラー:", e, dateValue);
    return "不明";
  }
};

// 同じ日かどうかを判定する関数
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  // すでにDate型であることを確認
  date1 = date1 instanceof Date ? date1 : toDateObject(date1);
  date2 = date2 instanceof Date ? date2 : toDateObject(date2);
  
  if (!date1 || !date2) return false;
  
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

// 今日が復習日かどうかを判定する関数
export const isDueToday = (quiz) => {
  if (!quiz || !quiz.nextReviewDate || quiz.reviewStatus === false) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextReviewDate = toDateObject(quiz.nextReviewDate);
  if (!nextReviewDate) return false;
  
  // 次の復習日が今日以前の場合は復習日とする
  const nextReviewDay = new Date(nextReviewDate);
  nextReviewDay.setHours(0, 0, 0, 0);
  return nextReviewDay <= today;
};

// 現在の復習ステップを表示
export const getCurrentReviewInfo = (quiz) => {
  if (!quiz.reviewSchedule || quiz.reviewSchedule.length === 0) {
    return '復習スケジュールなし';
  }
  
  const currentIndex = quiz.currentReviewIndex || 0;
  
  if (currentIndex >= quiz.reviewSchedule.length) {
    return '全ての復習完了';
  }
  
  const intervals = ['1日後', '3日後', '1週間後', '2週間後', '1ヶ月後'];
  const currentInterval = intervals[currentIndex] || '次の復習';
  
  return `${currentInterval}の復習`;
}; 