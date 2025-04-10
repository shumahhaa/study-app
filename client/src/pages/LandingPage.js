import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const LandingPage = () => {
  const styles = {
    hero: {
      background: 'linear-gradient(135deg, #2196F3 0%, #26A69A 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '60px 30px',
      marginBottom: '40px',
      textAlign: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    heroTitle: {
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '20px',
    },
    heroSubtitle: {
      fontSize: '1.4rem',
      marginBottom: '30px',
      fontWeight: '400',
      opacity: '0.9',
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#2196F3',
      padding: '12px 30px',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      margin: '0 10px',
    },
    featureSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '50px',
    },
    featureCard: {
      background: 'white',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    featureIcon: {
      fontSize: '2.5rem',
      color: '#26A69A',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#333',
    },
    featureDesc: {
      color: '#666',
      lineHeight: '1.6',
    },
    secondaryButton: {
      backgroundColor: '#26A69A',
      color: 'white',
      padding: '12px 30px',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      margin: '0 10px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    buttonContainer: {
      marginTop: '20px',
    }
  };

  return (
    <Layout>
      <div>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>LearnTime</h1>
          <p style={styles.heroSubtitle}>
            学習管理と復習クイズ生成のためのスマートなアプリケーション
          </p>
          <div style={styles.buttonContainer}>
            <Link to="/login" style={styles.ctaButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 7px 20px rgba(0,0,0,0.15)';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}>
              ログイン
            </Link>
            <Link to="/register" style={styles.secondaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 7px 20px rgba(0,0,0,0.15)';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}>
              新規登録
            </Link>
          </div>
        </section>

        <section style={styles.featureSection}>
          <div style={styles.featureCard} className="feature-card"
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>学習時間の記録</h3>
            <p style={styles.featureDesc}>
              学習トピックと学習時間を簡単に記録し、進捗を追跡します。
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card"
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureTitle}>AIチャットアシスタント</h3>
            <p style={styles.featureDesc}>
              OpenAI APIを使用したAIチャットアシスタントが学習をサポートします。
            </p>
          </div>

          <div style={styles.featureCard} className="feature-card"
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
            <div style={styles.featureIcon}>🧠</div>
            <h3 style={styles.featureTitle}>復習問題生成</h3>
            <p style={styles.featureDesc}>
              学習内容から自動的に復習問題を生成し、効率的な記憶定着をサポートします。
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage; 