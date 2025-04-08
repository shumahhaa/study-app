import React from 'react';
import styles from './styles';

const ErrorMessage = ({ quizError }) => {
  if (!quizError) return null;
  
  return (
    <div style={styles.errorMessage}>
      <span style={styles.errorIcon}>⚠️</span> {quizError}
    </div>
  );
};

export default ErrorMessage; 