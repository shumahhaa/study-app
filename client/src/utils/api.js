// バックエンドサーバーとの通信を担当するAPI関数
import { getAuthToken } from '../firebase';
import { getAuth } from 'firebase/auth';

// APIのベースURL（開発環境と本番環境で切り替え可能）
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// 開発環境か本番環境かを確認
const isDevelopment = process.env.NODE_ENV === 'development';

// エラーログ関数（本番環境ではコンソールログを制限）
const logError = (message, error) => {
  if (isDevelopment) {
    console.error(message, error);
  } else {
    // 本番環境では最小限のエラー情報のみ出力
    console.error(message);
  }
};

// APIエラーを処理する関数
const handleApiError = (error) => {
  logError('API Error:', error);
  if (error.response) {
    // サーバーからのエラーレスポンス
    throw new Error(error.response.data.error || 'サーバーエラーが発生しました');
  } else if (error.request) {
    // リクエストは送信されたがレスポンスがない
    throw new Error('サーバーに接続できませんでした');
  } else {
    // リクエスト設定中にエラーが発生
    throw new Error('リクエストの送信中にエラーが発生しました');
  }
};

// 認証済みリクエストヘッダーを取得する関数
const getAuthHeaders = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('認証が必要です。ログインしてください。');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  } catch (error) {
    logError('認証ヘッダー取得エラー:', error);
    throw new Error('認証情報の取得に失敗しました。再ログインしてください。');
  }
};

// OpenAI APIのチャット機能を呼び出す関数
export const fetchChatResponse = async (messages, studyTopic, model = 'gpt-3.5-turbo') => {
  let response;
  try {
    const headers = await getAuthHeaders();
    
    // タイムアウト設定（本番環境では長めに設定）
    const timeoutDuration = isDevelopment ? 30000 : 60000; // 開発:30秒, 本番:60秒
    
    // リクエストのタイムアウト処理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    response = await fetch(`${API_BASE_URL}/openai/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages, studyTopic, model }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `サーバーエラー (${response.status})` }));
      throw new Error(errorData.error || 'チャットレスポンスの取得に失敗しました');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logError('チャットAPI呼び出しエラー:', error);
    
    // AbortControllerによるタイムアウトの場合
    if (error.name === 'AbortError') {
      throw new Error('リクエストがタイムアウトしました。ネットワーク接続を確認してください。');
    }
    
    // ネットワークエラーの場合
    if (!navigator.onLine) {
      throw new Error('インターネット接続がありません。接続状態を確認してください。');
    }
    
    // レスポンスはあるがJSONとして解析できない場合
    if (response && !response.ok) {
      try {
        const text = await response.text();
        throw new Error(`サーバーエラー (${response.status}): ${text}`);
      } catch (textError) {
        throw new Error(`サーバーエラー (${response.status})`);
      }
    }
    
    // その他のエラー
    throw error.message ? error : new Error('チャットリクエスト中に予期せぬエラーが発生しました');
  }
};

// チャット使用回数を取得する関数
export const fetchChatUsage = async () => {
  let response;
  try {
    const headers = await getAuthHeaders();
    
    // タイムアウト設定（本番環境では長めに設定）
    const timeoutDuration = isDevelopment ? 10000 : 20000; // 開発:10秒, 本番:20秒
    
    // リクエストのタイムアウト処理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    response = await fetch(`${API_BASE_URL}/openai/chat-usage`, {
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `サーバーエラー (${response.status})` }));
      throw new Error(errorData.error || 'チャット使用回数の取得に失敗しました');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logError('チャット使用回数取得エラー:', error);
    
    // AbortControllerによるタイムアウトの場合
    if (error.name === 'AbortError') {
      throw new Error('リクエストがタイムアウトしました。ネットワーク接続を確認してください。');
    }
    
    // ネットワークエラーの場合
    if (!navigator.onLine) {
      throw new Error('インターネット接続がありません。接続状態を確認してください。');
    }
    
    // レスポンスはあるがJSONとして解析できない場合
    if (response && !response.ok) {
      try {
        const text = await response.text();
        logError(`サーバーエラー (${response.status}): ${text}`);
      } catch (textError) {
        logError(`サーバーエラー (${response.status})`);
      }
    }
    
    // エラー時はデフォルト値を返す（アプリの動作を継続させるため）
    return { dailyUsage: { current: 0, limit: 100 } };
  }
};

// OpenAI APIを使用してクイズを生成する関数
export const generateQuiz = async (userQuestions, studyTopic) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/openai/generate-quiz`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userQuestions, studyTopic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'クイズの生成に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 復習問題をFirestoreに保存する関数
export const saveQuizToFirestore = async (quiz, studyTopic) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/review-quizzes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quiz, studyTopic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '復習問題の保存に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 復習問題の一覧を取得する関数
export const fetchReviewQuizzes = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/review-quizzes`, {
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '復習問題の取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 復習問題の状態を更新する関数
export const updateReviewQuiz = async (quizId, updates) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/review-quizzes/${quizId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '復習問題の更新に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 復習問題を削除する関数
export const deleteReviewQuiz = async (quizId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/review-quizzes/${quizId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '復習問題の削除に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 学習セッションデータを保存する関数
export const saveStudySession = async (sessionData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/study-sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '学習セッションの保存に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 学習セッションの一覧を取得する関数
export const fetchStudySessions = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/study-sessions`, {
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '学習セッションの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// 学習セッションを削除する関数
export const deleteStudySession = async (sessionId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/firestore/study-sessions/${sessionId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '学習セッションの削除に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('学習セッション削除エラー:', error);
    throw error; // エラーを上位に伝播させる
  }
};

// 認証関連のAPI関数
// ユーザー情報を取得する関数
export const fetchUserProfile = async () => {
  try {
    const headers = await getAuthHeaders();
    
    // タイムアウト機能を追加した fetch 処理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒タイムアウト
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザー情報の取得に失敗しました');
      }
      
      return await response.json();
    } catch (fetchError) {
      // サーバー接続エラーの場合、最小限のプロファイルデータを返す
      if (fetchError.name === 'AbortError' || fetchError.message.includes('fetch')) {
        console.warn('サーバー接続エラー: デフォルトプロファイルを使用します');
        // ユーザーのメールアドレスを Firebase から取得
        const email = getAuth().currentUser?.email || 'ユーザー';
        // デフォルトプロファイルを返す
        return {
          email: email,
          displayName: email.split('@')[0],
          role: 'user'
        };
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    // エラーを上位に伝播
    throw error;
  }
};

// ユーザープロファイルを更新する関数
export const updateUserProfile = async (profileData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'プロファイルの更新に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// パスワードを変更する関数
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'パスワードの変更に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// ユーザープロファイルを削除する関数
export const deleteUserData = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'ユーザーデータの削除に失敗しました');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
}; 