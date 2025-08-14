import React from 'react';

import styles from '../ChannelHero.module.css';

export function MainText() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.slicedContainer}>
        <div className={styles.textRow} data-row-id="focus">
          <div className={styles.textContent} data-text="FOCUS">
            FOCUS
          </div>
          <div className={styles.interactiveArea}></div>
        </div>

        <div className={styles.textRow} data-row-id="presence">
          <div className={styles.textContent} data-text="PRESENCE">
            PRESENCE
          </div>
          <div className={styles.interactiveArea}></div>
        </div>

        <div className={styles.textRow} data-row-id="feel">
          <div className={styles.textContent} data-text="FEEL">
            FEEL
          </div>
          <div className={styles.interactiveArea}></div>
        </div>
      </div>
    </div>
  );
}
