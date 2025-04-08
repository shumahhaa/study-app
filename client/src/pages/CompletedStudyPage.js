import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { generateQuizFromChatHistory, saveQuizToFirebase } from "../utils/quizGenerator";
import {
  CompletionHeader,
  StudySummary,
  ActionButtons,
  ErrorMessage,
  styles,
  addAnimationStyles
} from "../components/CompletedStudy";

const CompletedStudyPage = ({
  recordedStudyTopic,
  studyDuration,
  formatTime,
  recordedMotivation,
  studyStartTime,
  pausedTime,
  resetChatHistory
}) => {
  const navigate = useNavigate();
  
  // 問題生成関連の状態
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [quizError, setQuizError] = useState(null);

  // ページロード時の処理
  useEffect(() => {
    // 学習内容がなければホームページにリダイレクト
    if (!recordedStudyTopic) {
      navigate("/");
    }
    
    // アニメーションスタイルを追加
    addAnimationStyles();
  }, [recordedStudyTopic, navigate]);

  // 復習問題を生成する処理
  const handleGenerateQuiz = async () => {
    try {
      setIsGeneratingQuiz(true);
      setQuizError(null);
      
      // チャット履歴から問題を生成
      const quizData = await generateQuizFromChatHistory(recordedStudyTopic);
      
      // 生成した問題をFirebaseに保存
      await saveQuizToFirebase(quizData, recordedStudyTopic);
      
      // 問題生成完了
      setQuizGenerated(true);
      
      // 学習が完了したので、チャット履歴をリセット（すでにページロード時にリセット済み）
      
    } catch (error) {
      console.error('復習問題の生成中にエラーが発生しました:', error);
      setQuizError(error.message || '復習問題の生成に失敗しました');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <CompletionHeader />
          
          <StudySummary 
            recordedStudyTopic={recordedStudyTopic}
            recordedMotivation={recordedMotivation}
            studyDuration={studyDuration}
            pausedTime={pausedTime}
            studyStartTime={studyStartTime}
          />
          
          <ActionButtons 
            quizGenerated={quizGenerated}
            isGeneratingQuiz={isGeneratingQuiz}
            handleGenerateQuiz={handleGenerateQuiz}
          />
          
          <ErrorMessage quizError={quizError} />
        </div>
      </div>
    </Layout>
  );
};

export default CompletedStudyPage; 