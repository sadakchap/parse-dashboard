import React from "react";
import styles from "components/Sidebar/Sidebar.scss";
import Tooltip from 'components/Tooltip/SimpleTooltip.react';

const AppName = ({ name, pin, onClick }) => (
  <div className={styles.currentApp}>
    <div className={styles.currentAppNameGroup} onClick={onClick}>
      <Tooltip 
        className={styles.Tooltip}
        value={(
          <span>{name}</span>
        )}
      >
        <div className={styles.currentAppName}>{name}</div>
      </Tooltip>
      <div className={styles.appsSelectorArrow}></div>
    </div>
    {pin}
  </div>
);

export default AppName;
