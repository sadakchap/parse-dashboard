import React from 'react';
import ghostImg from './ghost.png';
import styles from 'components/EmptyGhostState/EmptyGhostState.scss';

const EmptyGhostState = ({ title, description, cta = '', action = () => {}, secondaryCta = '', secondaryAction = () => {}, fill = '#C1E2FF'}) => {
  return (
    <div className={styles.content}>
      <img src={ghostImg} alt="empty state" />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.actionBtns}>
        {cta ? (
          <button className={styles.cta} onClick={action}>{cta}</button>
        ) : null}
        {secondaryCta ? (
          <button className={styles.secondaryCta} onClick={secondaryAction}>{secondaryCta}</button>
        ) : null}
      </div>
    </div>
  )
}

export default EmptyGhostState;
