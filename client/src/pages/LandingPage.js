import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    hero: {
      background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 30%, #00BFA5 70%, #00897B 100%)',
      color: 'white',
      borderRadius: '16px',
      padding: '80px 40px',
      marginBottom: '70px',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      position: 'relative',
      overflow: 'hidden',
      backgroundSize: '200% 200%',
      animation: 'gradientAnimation 15s ease infinite',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 80%)',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    },
    heroTitle: {
      fontSize: '4.5rem',
      fontWeight: '800',
      marginTop: '0px',
      marginBottom: '30px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      letterSpacing: '1px',
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      fontWeight: '500',
      opacity: '1',
      maxWidth: '700px',
      marginTop: 0,
      marginRight: 'auto',
      marginBottom: '100px',
      marginLeft: 'auto',
      lineHeight: '1.6',
      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#2196F3',
      padding: '14px 36px',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '0 12px',
    },
    featureSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '40px',
      marginBottom: '80px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s',
    },
    featureCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px 30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.04)',
      height: '450px',
      justifyContent: 'flex-start',
    },
    featureIconWrapper: {
      height: '80px',
      width: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '30px',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #E0F2F1 100%)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
      alignSelf: 'center',
    },
    featureIcon: {
      fontSize: '2.8rem',
    },
    featureTitle: {
      fontSize: '1.6rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: '#333',
      height: '40px',
      display: 'flex',
      alignItems: 'flex-start',
      textAlign: 'left',
      width: '100%',
    },
    featureDesc: {
      color: '#666',
      lineHeight: '1.8',
      fontSize: '1.05rem',
      flex: 1,
      marginBottom: '20px',
      textAlign: 'left',
      width: '100%',
    },
    secondaryButton: {
      backgroundColor: '#00C853',
      color: 'white',
      padding: '14px 36px',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '700',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      margin: '0 12px',
      transition: 'all 0.3s ease',
    },
    buttonContainer: {
      marginTop: '50px',
    },
    circleDecoration: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
    },
    circle1: {
      width: '300px',
      height: '300px',
      top: '-100px',
      right: '-100px',
    },
    circle2: {
      width: '200px',
      height: '200px',
      bottom: '-50px',
      left: '-50px',
    }
  };

  // グラデーションアニメーションのキーフレーム
  const keyframes = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50% }
      50% { background-position: 100% 50% }
      100% { background-position: 0% 50% }
    }
  `;

  return (
    <Layout>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroOverlay}></div>
          <div style={{...styles.circleDecoration, ...styles.circle1}}></div>
          <div style={{...styles.circleDecoration, ...styles.circle2}}></div>
          
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>LearnTime</h1>
            <p style={styles.heroSubtitle}>
              学習効率を向上させるAIチャットと復習インターバル、学習管理を実現するアプリケーション
            </p>
            <div style={styles.buttonContainer}>
              <Link to="/login" style={styles.ctaButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 25px rgba(0,0,0,0.2)';
                }} 
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                }}>
                ログイン
              </Link>
              <Link to="/register" style={styles.secondaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 25px rgba(0,0,0,0.2)';
                }} 
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                }}>
                新規登録
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.featureSection}>
          <div style={{
            ...styles.featureCard,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)',
            borderLeft: '4px solid #2196F3'
          }}>
            <h3 style={styles.featureTitle}>AIチャットアシスタント</h3>
            <p style={styles.featureDesc}>
              AIアシスタントが学習をサポートします。質問への回答や、学習内容の理解を深めるための会話が可能です。学習中に生じた疑問点を解決しアドバイスを提供します。
            </p>
            <div style={{...styles.featureIconWrapper, background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'}}>
              <div style={styles.featureIcon}>💬</div>
            </div>
          </div>

          <div style={{
            ...styles.featureCard,
            background: 'linear-gradient(135deg, rgba(38, 166, 154, 0.05) 0%, rgba(38, 166, 154, 0.1) 100%)',
            borderLeft: '4px solid #26A69A'
          }}>
            <h3 style={styles.featureTitle}>復習とインターバル</h3>
            <p style={styles.featureDesc}>
              AIが学習中のチャット履歴から復習問題を作成し、記憶の定着を向上させるために最適なインターバル（1日、3日、7日、14日、30日）を空けて復習することが可能です。
            </p>
            <div style={{...styles.featureIconWrapper, background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)'}}>
              <div style={styles.featureIcon}>🧠</div>
            </div>
          </div>

          <div style={{
            ...styles.featureCard,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, rgba(38, 166, 154, 0.08) 100%)',
            borderLeft: '4px solid #00BCD4'
          }}>
            <h3 style={styles.featureTitle}>学習の可視化</h3>
            <p style={styles.featureDesc}>
              学習トピックとモチベーション、学習時間などを簡単に記録し、データ分析によって学習パターンを可視化します。勉強時間や自身の勉強サイクルを可視化することで、学習計画の改善や学習習慣の向上に役立ちます。
            </p>
            <div style={{...styles.featureIconWrapper, background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)'}}>
              <div style={styles.featureIcon}>📊</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage; 