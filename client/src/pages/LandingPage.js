import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 0px',
      overflow: 'hidden',
      width: '100%',
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
      fontSize: isMobile ? '3.6rem' : '4.5rem',
      fontWeight: '800',
      marginTop: '0px',
      marginBottom: '30px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      letterSpacing: '1px',
    },
    heroSubtitle: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
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
      padding: isMobile ? '12px 25px' : '14px 36px',
      borderRadius: '50px',
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      border: 'none',
      cursor: 'pointer',
      margin: isMobile ? '0 6px' : '0 12px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
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
      height: '490px',
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
      padding: isMobile ? '12px 25px' : '14px 36px',
      borderRadius: '50px',
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: '700',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
      margin: isMobile ? '0 6px' : '0 12px',
      transition: 'background-color 0.3s ease',
    },
    buttonContainer: {
      marginTop: '50px',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
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
                  e.currentTarget.style.backgroundColor = '#f0f8ff';
                  e.currentTarget.style.color = '#1976D2';
                }} 
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#2196F3';
                }}>
                ログイン
              </Link>
              <Link to="/register" style={styles.secondaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#00a547';
                }} 
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#00C853';
                }}>
                新規登録
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.featureSection}>
          <div style={{
            ...styles.featureCard,
            background: 'white',
            borderLeft: '4px solid #2196F3'
          }}>
            <h3 style={styles.featureTitle}>AIチャットアシスタント</h3>
            <p style={styles.featureDesc}>
              AIアシスタントが学習をサポートします。質問への回答や、学習内容の理解を深めるための会話が可能です。学習中に生じた疑問点を解決しアドバイスを提供します。
            </p>
            <img src="/AIChat-icon.png" alt="AIチャット" style={{width: '120px', height: '120px', marginTop: '30px', alignSelf: 'center'}} />
          </div>

          <div style={{
            ...styles.featureCard,
            background: 'white',
            borderLeft: '4px solid #26A69A'
          }}>
            <h3 style={styles.featureTitle}>復習とインターバル</h3>
            <p style={styles.featureDesc}>
              AIが学習中のチャット履歴から復習問題を作成し、記憶の定着を向上させるために最適なインターバル（1日、3日、7日、14日、30日）を空けて復習することが可能です。
            </p>
            <img src="/ReviewQuiz-icon.png" alt="復習クイズ" style={{width: '120px', height: '120px', marginTop: '30px', alignSelf: 'center'}} />
          </div>

          <div style={{
            ...styles.featureCard,
            background: 'white',
            borderLeft: '4px solid #00BCD4'
          }}>
            <h3 style={styles.featureTitle}>学習の可視化</h3>
            <p style={styles.featureDesc}>
              学習トピックとモチベーション、学習時間などを記録し、学習パターンを可視化します。勉強時間や勉強サイクルを可視化することで、学習計画の改善や学習習慣の向上に役立ちます。
            </p>
            <img src="/Analytics-icon.png" alt="分析" style={{width: '120px', height: '120px', marginTop: '30px', alignSelf: 'center'}} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage; 