import React                from 'react'
import ReactDOMServer       from 'react-dom/server'
import Swal                 from 'sweetalert2'
import styles               from 'dashboard/B4aHubPublishPage/B4aHubPublishPage.scss'

const show = (currentApp, onUnpublished) => {
  Swal.mixin({
    confirmButtonText: 'Yes, unpublish',
    confirmButtonColor: '#E02424',
    showCancelButton: true,
    reverseButtons: true,
    padding: '2.5em'
  }).queue([
    {
      type: 'warning',
      title: 'Unpublish on Database Hub',
      html: ReactDOMServer.renderToStaticMarkup(
        <div className={styles['elements-wrapper']}>
          <div className={styles['label-wrapper']}>
            Are you sure that you want to unpublish this app from Database Hub? Nobody will be able to connect or clone to it anymore and all customizations will be lost.
          </div>
        </div>
      ),
      preConfirm: async () => {
        Swal.showLoading()

        try {
          await currentApp.unpublishFromHub()
        } catch (e) {
          Swal.deleteQueueStep(1);
          Swal.insertQueueStep({
            type: 'error',
            html: ReactDOMServer.renderToStaticMarkup(
              <div className={`${styles['elements-wrapper']} ${styles['congrats-box']}`}>
                <p className={styles['congrats-message']}>
                  {e.message || 'Something wrong happened in our side. Please try again later.'}
                </p>
              </div>
            ),
            showConfirmButton: false,
            cancelButtonText: 'Got it!',
          });
          return;
        }

        onUnpublished();
      }
    },
    {
      type: 'success',
      html: ReactDOMServer.renderToStaticMarkup(
        <div className={`${styles['elements-wrapper']} ${styles['congrats-box']}`}>
          <p className={styles['congrats-message']}>
            Your app was successfully unpublished from Database Hub.
          </p>
        </div>
      ),
      showCancelButton: false,
      confirmButtonText: 'Got it!',
    }
  ])
}

export default  { show }
