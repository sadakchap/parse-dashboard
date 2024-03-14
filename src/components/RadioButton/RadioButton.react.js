/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import styles from 'components/RadioButton/B4aRadioButton.scss';

const RadioButton = props => {
  const parentClassName = props.parentClassName || '';
  props = Object.assign({}, props);
  delete props.parentClassName;
  return (
    <div className={[styles.radiobutton, parentClassName, props.dark ? styles.dark : ''].join(' ')}>
      <input {...props} type="radio" />
      <span></span>
    </div>
  );
};

export default RadioButton;
