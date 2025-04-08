import React from 'react';
import styles from './styles';

const MessageContent = () => {
  return (
    <>
      <h2 style={styles.title}>メンテナンス中</h2>
      <p style={styles.message}>
        申し訳ありませんが、AIチャット機能は現在メンテナンス中です。<br />
        しばらくしてからもう一度お試しください。
      </p>
    </>
  );
};

export default MessageContent; 