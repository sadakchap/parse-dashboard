/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import PropTypes from 'lib/PropTypes';
import React from 'react';
import styles from 'components/Fieldset/Fieldset.scss';

let Fieldset = ({ legend, description, children, width = '', error }) => (
  <div className={styles.fieldset}>
    <div className={styles.legend}>{legend}</div>
    <div className={styles.description}>{description}</div>
    <div className={styles.fields} style={{ width: width }}>
      {children}
    </div>
    {
      error &&
      <div className={styles.fields} style={{ width: width }}>
        <small className={styles.error}>*{error}</small>
      </div>
    }
  </div>
);

export default Fieldset;

Fieldset.propTypes = {
  legend: PropTypes.node.describe(
    'The main title of the Fieldset. It can be any renderable content.'
  ),
  description: PropTypes.node.describe(
    'The secondary header of the Fieldset. It can be any renderable content.'
  ),
  width: PropTypes.string.describe(
    'Optionally sets the explicit width of the FieldSet. This can be any valid CSS size.'
  )
};
