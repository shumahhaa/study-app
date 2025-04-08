import React from 'react';
import styles from './styles';

// 削除確認ダイアログのコンポーネント
const ConfirmDelete = ({ onCancel, onConfirm }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3 style={styles.dialogTitle}>
          復習問題を削除しますか？
        </h3>
        <p style={styles.dialogText}>
          削除すると元に戻すことはできません。
        </p>
        <div style={styles.dialogButtons}>
          <button
            onClick={onCancel}
            style={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            style={styles.confirmButton}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete; 