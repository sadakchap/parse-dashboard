/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import PropTypes from 'lib/PropTypes';
import React from 'react';
import styles from 'components/B4aLoaderContainer/B4aLoaderContainer.scss';
import Lottie from 'lottie-react';
import b4aLoadingAnimation from './b4aLoadingAnimation.json';

//Loader wrapper component
//Wraps child component with a layer and <Loader/> centered
const B4aLoaderContainer = ({ loading, hideAnimation, children, solid = true }) => {
  return(<div className={styles.loaderContainer}>
    <div className={styles.children}>{children}</div>
    <div
      className={[
        styles.loaderParent,
        loading ? styles.visible : '',
        solid ? styles.solid : '',
      ].join(' ')}
    >
      {hideAnimation || !loading ? null : <div className={styles.loader}>
        <Lottie animationData={b4aLoadingAnimation} loop={true} height={100} />
        <div className={styles.text}>Loading</div>
      </div>}
    </div>
  </div>
  )
};

export default B4aLoaderContainer;

B4aLoaderContainer.propTypes = {
  loading: PropTypes.bool.describe(
    'State of the loader (true displays loader, false hides loader).'
  ),
  hideAnimation: PropTypes.bool.describe('Whether to hide the animation within the container.'),
  solid: PropTypes.bool.describe(
    'Optional flag to have an solid background. Defaults to true. If false an opacity of 70% is used.'
  ),
};
