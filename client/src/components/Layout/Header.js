import React from 'react';
import styles from './styles';
import Logo from './Logo';
import Navigation from './Navigation';

const Header = ({ currentUser, pathname, logoLinkPath }) => {
  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Logo 
          logoLinkPath={logoLinkPath} 
          currentUser={currentUser} 
        />
        <Navigation 
          pathname={pathname} 
          currentUser={currentUser} 
        />
      </div>
    </header>
  );
};

export default Header; 