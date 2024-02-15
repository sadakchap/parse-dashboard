
import React from 'react';
import styles from 'components/B4aLoaderContainer/B4aLoaderContainer.scss';
import Lottie from 'lottie-react';
import b4aLoadingAnimation from './b4aLoadingAnimation.json';

const B4aLoader = () => {
  return (
    <>
      <Lottie animationData={b4aLoadingAnimation} loop={true} height={100} />
      <div className={styles.text}>Loading</div>
    </>
  )
}

export default B4aLoader
