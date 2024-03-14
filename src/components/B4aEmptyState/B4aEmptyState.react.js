import React from 'react';
import Icon from 'components/Icon/Icon.react';
import styles from 'components/B4aEmptyState/B4aEmptyState.scss';
import stylesButton from 'components/Button/Button.scss';

const ctaButton = (cta, action, primary = true) => {
  const actionStyles = primary ? styles.cta : styles.secondaryCta;
  if (cta) {
    if (action.constructor === String) {
      return (
        <a
          href={action}
          className={[stylesButton.button, actionStyles, styles.link].join(' ')}
          target="_blank"
        >
          {cta}
        </a>
      );
    } else {
      return <button className={actionStyles} onClick={action}>{cta}</button>;
    }
  } else {
    return null;
  }
};


const B4aEmptyState = ({ icon = 'ghost-icon', title, description, cta = '', action = () => {}, secondaryCta = '', secondaryAction = () => {}, fill = '#C1E2FF'}) => {
  return (
    <div className={styles.content}>
      <Icon className={styles.icon} name={icon} width={32} height={40} fill={fill} />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.actionBtns}>
        {ctaButton(cta, action, true)}
        {ctaButton(secondaryCta, secondaryAction, false)}
      </div>
    </div>
  )
}

export default B4aEmptyState;
