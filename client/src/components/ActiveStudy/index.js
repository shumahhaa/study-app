import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import styles from "./styles";
import StudyPanel from "./StudyPanel";
import ChatPanel from "./ChatPanel";
import ConfirmationDialog from "./ConfirmationDialog";

const ActiveStudyPage = ({
  recordedStudyTopic,
  studyDuration,
  formatTime,
  isPaused,
  pauseStudy,
  resumeStudy,
  stopStudy,
  abandonStudy,
  recordedMotivation,
  isStudying,
  resetChatHistory
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState("stop");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // 環境変数からメンテナンスモードの設定を取得
  const isMaintenanceMode = process.env.REACT_APP_AI_CHAT_MAINTENANCE_MODE === "true";

  // ウィンドウサイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // ページロード時の処理
  useEffect(() => {
    // 学習完了中の場合は何もしない
    const isCompletingStudy = sessionStorage.getItem('completingStudy') === 'true';
    
    // 学習中でない場合かつ学習完了処理中でない場合、ホームページに戻る
    if (!isStudying && !isCompletingStudy) {
      navigate('/');
      return;
    }
    
    // リロードフラグをチェック
    const isReloaded = sessionStorage.getItem('pageReloaded');
    
    if (isReloaded === 'true') {
      // リロードされた場合、学習を放棄してホームに戻る
      abandonStudy();
      navigate('/');
      // フラグをリセット
      sessionStorage.removeItem('pageReloaded');
    } else {
      // 初回アクセス時はフラグを設定
      sessionStorage.setItem('pageReloaded', 'true');
    }
    
    // beforeunloadイベントのリスナーを設定
    const handleBeforeUnload = (e) => {
      if (isStudying) {
        const message = "学習中です。ページを離れると学習データが保存されません。";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // コンポーネントがアンマウントされる時（正常な遷移時）はフラグを削除
      sessionStorage.removeItem('pageReloaded');
    };
  }, [abandonStudy, navigate, isStudying]);

  const handleStopStudy = () => {
    setConfirmationType("stop");
    setShowConfirmation(true);
  };

  const handleAbandonStudy = () => {
    setConfirmationType("abandon");
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    setShowConfirmation(false); // まず確認ダイアログを閉じる
    
    if (confirmationType === "stop") {
      try {
        // isStudyingの変更による自動リダイレクトを防ぐために一時的なフラグを設定
        sessionStorage.setItem('completingStudy', 'true');
        
        // 学習終了処理を実行
        await stopStudy();
        
        // 完了ページへ遷移（チャット履歴のリセットは完了ページで行う）
        navigate("/completed");
        
        // フラグをクリア
        sessionStorage.removeItem('completingStudy');
      } catch (error) {
        console.error("学習終了エラー:", error);
        alert("学習の終了処理中にエラーが発生しました。もう一度お試しください。");
        sessionStorage.removeItem('completingStudy');
      }
    } else {
      // 学習放棄時にチャット履歴をリセット
      if (recordedStudyTopic) {
        resetChatHistory(recordedStudyTopic);
      }
      abandonStudy();
      navigate("/");
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Layout isStudying={isStudying}>
      <div style={isMobile ? styles.containerMobile : styles.container}>
        {/* 左側：学習管理パネル */}
        <StudyPanel
          isPaused={isPaused}
          recordedStudyTopic={recordedStudyTopic}
          studyDuration={studyDuration}
          recordedMotivation={recordedMotivation}
          pauseStudy={pauseStudy}
          resumeStudy={resumeStudy}
          onStopStudy={handleStopStudy}
          onAbandonStudy={handleAbandonStudy}
          isMobile={isMobile}
        />
        
        {/* 右側：AIチャットまたはメンテナンス画面 */}
        <ChatPanel 
          recordedStudyTopic={recordedStudyTopic}
          isMaintenanceMode={isMaintenanceMode}
          isMobile={isMobile}
        />
        
        {/* 確認ダイアログ */}
        {showConfirmation && (
          <ConfirmationDialog
            confirmationType={confirmationType}
            studyDuration={studyDuration}
            onCancel={cancelConfirmation}
            onConfirm={confirmAction}
          />
        )}
      </div>
    </Layout>
  );
};

export default ActiveStudyPage; 