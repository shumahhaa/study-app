import React from 'react';
import styles from './styles';
import MarkdownContent from './MarkdownContent';

// 問題項目を表示するコンポーネント
const QuestionItem = ({ question, index, showAnswer, onToggleAnswer }) => {
  return (
    <div key={index} style={{
      ...styles.questionCard,
      backgroundColor: '#fff',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.07)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <h3 style={styles.questionNumber}>問題 {index + 1}</h3>
      <div style={styles.questionText}>
        <MarkdownContent content={question.question} />
      </div>
      
      <button 
        style={{
          ...styles.toggleAnswerButton,
          ...(showAnswer ? styles.activeToggleButton : {})
        }}
        onClick={onToggleAnswer}
        className={`toggle-answer-button ${showAnswer ? 'active-toggle-button' : ''}`}
      >
        {showAnswer ? (
          <>
            <span style={{ marginRight: '6px', fontSize: '14px' }}>▲</span>
            解答を隠す
          </>
        ) : (
          <>
            <span style={{ marginRight: '6px', fontSize: '14px' }}>▼</span>
            解答を表示
          </>
        )}
      </button>
      
      {showAnswer && (
        <div style={styles.answerContainer}>
          <div style={styles.answerText}>
            <MarkdownContent content={question.answer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem; 