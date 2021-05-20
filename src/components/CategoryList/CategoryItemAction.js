/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React  from 'react';
import styles from 'components/CategoryList/CategoryList.scss';

export default class CategoryAction {
  constructor(text, fn) {
    this.text = text;
    this.fn = fn;
  }

  renderButton() {
    return (
      <a
        className={styles['category-action']}
        onClick={this.fn || function() {}}>
        {this.text}
      </a>
    );
  }
}
