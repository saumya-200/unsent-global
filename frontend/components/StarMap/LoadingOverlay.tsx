import React from 'react';
import styles from './StarMap.module.css';

const LoadingOverlay: React.FC = () => {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <div className={styles.pulse}>OBSERVING THE CONSTELLATIONS...</div>
        </div>
    );
};

export default LoadingOverlay;
