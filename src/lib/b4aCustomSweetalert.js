import Swal from 'sweetalert2';

import buttonStyles from 'components/Button/Button.scss';
import baseStyles from 'stylesheets/base.scss';
import modalStyles from 'components/B4aModal/B4aModal.scss';
import styles from 'stylesheets/b4aCustomSweetalert.scss';


export const customDangerSwl = Swal.mixin({
  customClass: {
    header: '',
    title: `${modalStyles.title} ${styles.sweetalertTitle}`,
    htmlContainer: `${styles.sweetalertContainer}`,
    closeButton: styles.sweetalertCloseBtn,
    icon: styles.sweetalertIcon,
    input: styles.sweetalertInput,
    actions: `${styles.sweetalertActions}`,
    confirmButton: [buttonStyles.button, baseStyles.unselectable, buttonStyles.primary, buttonStyles.red].join(' '),
    cancelButton: [buttonStyles.button, baseStyles.unselectable, buttonStyles.white].join(' '),
    loader: styles.sweetalertLoader,
  },
  buttonsStyling: false,
});


export const customGreenSwl = Swal.mixin({
  customClass: {
    header: '',
    title: `${modalStyles.title} ${styles.sweetalertTitle}`,
    htmlContainer: `${styles.sweetalertContainer}`,
    closeButton: styles.sweetalertCloseBtn,
    icon: styles.sweetalertIcon,
    input: styles.sweetalertInput,
    actions: `${styles.sweetalertActions}`,
    confirmButton: [buttonStyles.button, baseStyles.unselectable, buttonStyles.primary, buttonStyles.green].join(' '),
    cancelButton: [buttonStyles.button, baseStyles.unselectable, buttonStyles.white].join(' '),
    loader: styles.sweetalertLoader,
  },
  buttonsStyling: false,
});
