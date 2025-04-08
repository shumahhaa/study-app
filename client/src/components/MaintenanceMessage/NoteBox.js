import React from 'react';
import styles from './styles';

const NoteBox = () => {
  return (
    <div style={styles.noteContainer}>
      <p style={styles.note}>
        メンテナンス中も学習の記録は可能です。<br />
        チャット機能以外のサービスは通常通りご利用いただけます。
      </p>
    </div>
  );
};

export default NoteBox; 