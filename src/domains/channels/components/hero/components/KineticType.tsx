import React from 'react';
import styles from '../ChannelHero.module.css';

export function KineticType() {
  return (
    <div className={styles.type} id="kinetic-type" aria-hidden="true">
      <div className={`${styles.typeLine} ${styles.odd}`}>focus focus focus</div>
      <div className={`${styles.typeLine} ${styles.even}`}>presence presence presence</div>
      <div className={`${styles.typeLine} ${styles.odd}`}>feel feel feel</div>
      <div className={`${styles.typeLine} ${styles.even}`}>focus focus focus</div>
      <div className={`${styles.typeLine} ${styles.odd}`}>presence presence presence</div>
      <div className={`${styles.typeLine} ${styles.even}`}>focus focus focus</div>
      <div className={`${styles.typeLine} ${styles.odd}`}>focus focus focus</div>
      <div className={`${styles.typeLine} ${styles.even}`}>presence presence presence</div>
      <div className={`${styles.typeLine} ${styles.odd}`}>feel feel feel</div>
      <div className={`${styles.typeLine} ${styles.even}`}>focus focus focus</div>
      <div className={`${styles.typeLine} ${styles.odd}`}>presence presence presence</div>
      <div className={`${styles.typeLine} ${styles.even}`}>focus focus focus</div>
    </div>
  );
}
