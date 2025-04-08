import React from 'react';
import styles from './styles';
import { formatDuration } from './utils';

// 確認ダイアログコンポーネント
const ConfirmationDialog = ({ 
  confirmationType, 
  studyDuration, 
  onCancel, 
  onConfirm 
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3 style={styles.dialogTitle}>
          {confirmationType === "stop" 
            ? "学習を終了しますか？" 
            : "学習を放棄しますか？"}
        </h3>
        <p style={styles.dialogText}>
          {confirmationType === "stop" 
            ? `学習時間: ${formatDuration(studyDuration)}` 
            : "放棄すると、この学習セッションは記録されません。"}
        </p>
        <div style={styles.dialogButtons}>
          <button
            onClick={onCancel}
            className="cancel-button"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className={`confirm-button ${confirmationType === "stop" ? "stop" : "abandon"}`}
          >
            {confirmationType === "stop" ? "終了する" : "放棄する"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog; 