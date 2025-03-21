import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Configuration, OpenAIApi } from "openai";

// OpenAI設定
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    // システムプロンプト
    const systemPrompt = `
あなたは教育AIアシスタントです。学習者のチャット履歴から、学習内容を確認するための記述式問題を5問作成してください。
学習トピックは「${studyTopic}」です。
各問題には、問題文と詳細な解答を含めてください。
回答は以下のJSON形式で返してください。

{
  "questions": [
    {
      "question": "問題文をここに記述",
      "answer": "解答をここに記述"
    },
    ...
  ]
}`;
    
    // OpenAI APIを呼び出して問題を生成
    const completion = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `以下は学習中に私が行った質問です。これらの内容に基づいて問題を作成してください：\n\n${userQuestions.join('\n\n')}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    // JSON応答を解析
    const responseContent = completion.data.choices[0].message.content;
    let quizData;
    
    try {
      // JSON文字列を抽出して解析
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('レスポンスからJSONを抽出できませんでした');
      }
    } catch (jsonError) {
      console.error('JSONの解析に失敗:', jsonError);
      console.log('受信したレスポンス:', responseContent);
      throw new Error('問題データの形式が不正です');
    }
    
    return quizData;
  } catch (error) {
    console.error('問題生成エラー:', error);
    throw error;
  }
};

// 復習問題をFirebaseに保存する関数
export const saveQuizToFirebase = async (quiz, studyTopic, studyDuration) => {
  try {
    // 復習スケジュールを計算
    const now = new Date();
    const reviewSchedule = [
      { interval: '1d', dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), completed: false },
      { interval: '3d', dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), completed: false },
      { interval: '1w', dueDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), completed: false },
      { interval: '2w', dueDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), completed: false },
      { interval: '1m', dueDate: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000), completed: false }
    ];
    
    const quizData = {
      studyTopic,
      questions: quiz.questions,
      createdAt: Timestamp.now(),
      studyDuration,
      reviewSchedule,
      nextReviewDate: reviewSchedule[0].dueDate,
      reviewStatus: 'scheduled', // 'scheduled', 'in_progress', 'completed'
      currentReviewIndex: 0,     // 現在の復習ステップ（0から4）
    };
    
    const docRef = await addDoc(collection(db, 'reviewQuizzes'), quizData);
    return docRef.id;
  } catch (error) {
    console.error('問題の保存エラー:', error);
    throw error;
  }
}; 