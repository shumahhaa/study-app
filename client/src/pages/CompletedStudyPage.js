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
  
  // モバイル画面かどうかを判定する状態
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // ページロード時の処理
  useEffect(() => {
    // 学習完了フラグをクリア（既に存在する場合）
    sessionStorage.removeItem('completingStudy');
    
    // 学習内容がなければホームページにリダイレクト
    if (!recordedStudyTopic) {
      navigate("/");
      return;
    }
    
    // アニメーションスタイルを追加
    addAnimationStyles();
    
    // 画面サイズの変更を監視
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const responsiveCardStyle = {
    ...styles.completionCard,
    ...(isMobile && { padding: "15px" })
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={responsiveCardStyle}>
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
            isMobile={isMobile}
          />
          
          <ErrorMessage quizError={quizError} />
        </div>
      </div>
    </Layout>
  );
};

export default CompletedStudyPage; 