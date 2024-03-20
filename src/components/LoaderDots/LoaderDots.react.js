/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import styles from 'components/LoaderDots/B4aLoaderDots.scss';

export default class LoaderDots extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={`${styles.loaderDots} ${this.props.dark ? styles.dark : ''}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }
}
