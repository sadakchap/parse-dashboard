/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Icon from 'components/Icon/Icon.react';
import React from 'react';
import styles from 'components/MultiSelect/MultiSelect.scss';

const MultiSelectOption = ({ checked, children, dense, disabled, ...other }) => {
  const classes = [styles.option, disabled ? styles.disabled : undefined];

  const icon = <div className={checked ? styles.checked : styles.unchecked} />

  return (
    <div {...other} className={classes.join(' ')}>
      {children}
      {disabled ? <noscript /> : icon}
    </div>
  );
};

export default MultiSelectOption;
