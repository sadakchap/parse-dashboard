import React from 'react';
import Icon from 'components/Icon/Icon.react';
import styles from 'components/EmptyGhostState/EmptyGhostState.scss';

const EmptyGhostState = ({ title, description, cta, action }) => {
  return (
    <div className={styles.content}>
      <Icon className={styles.icon} name="ghost-icon" width={32} height={40} fill="#C1E2FF" />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      {cta ? (
        <button className={styles.cta} onClick={action}>{cta}</button>
      ) : null}
    </div>
  )
}

export default EmptyGhostState;
