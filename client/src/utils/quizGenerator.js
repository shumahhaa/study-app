import { generateQuiz, saveQuizToFirestore } from './api';

// チャット履歴から復習問題を生成する関数
export const generateQuizFromChatHistory = async (studyTopic) => {
  // セッションストレージからチャット履歴を取得
  const chatStorageKey = `aiChat_${studyTopic}`;
  const savedChat = sessionStorage.getItem(chatStorageKey);
  
  if (!savedChat) {
    throw new Error('チャット履歴が見つかりません');
  }
  
  const chatHistory = JSON.parse(savedChat);
  
  // ユーザーの質問だけを抽出
  const userQuestions = chatHistory
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content);
  
  if (userQuestions.length === 0) {
    throw new Error('質問が見つかりません');
  }
  
  try {
    // バックエンドAPIを使用してクイズを生成
    const quizData = await generateQuiz(userQuestions, studyTopic);
    return quizData;
  } catch (error) {
    console.error('問題生成エラー:', error);
    throw error;
  }
};

// 復習問題をFirebaseに保存する関数
export const saveQuizToFirebase = async (quiz, studyTopic, studyDuration) => {
  try {
    // バックエンドAPIを使用してFirestoreに保存
    const result = await saveQuizToFirestore(quiz, studyTopic, studyDuration);
    return result.id;
  } catch (error) {
    console.error('問題の保存エラー:', error);
    throw error;
  }
}; 