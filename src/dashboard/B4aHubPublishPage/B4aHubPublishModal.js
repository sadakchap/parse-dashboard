import React                from 'react'
import ReactDOMServer       from 'react-dom/server'
import Swal                 from 'sweetalert2'
import styles               from 'dashboard/B4aHubPublishPage/B4aHubPublishPage.scss'

const show = (currentApp, onPublished) => {
  let result;

  Swal.mixin({
    confirmButtonText: 'Publish',
    showCancelButton: true,
    reverseButtons: true,
    padding: '2.5em'
  }).queue([
    {
      title: 'Publish on Database Hub',
      html: ReactDOMServer.renderToStaticMarkup(
        <div className={styles['elements-wrapper']}>
          <div className={styles['input-wrapper']}>
            <input name="confirmHubPublish" id="confirmHubPublish" type="checkbox" />
          </div>
          <div className={styles['label-wrapper']}>
            <label htmlFor="confirmHubPublish">
              I understand that the data of this app will become public, and I confirm that there is no private or sensitive data in any class of this app.
            </label>
          </div>
        </div>
      ),
      preConfirm: async () => {
        const confirmHubPublishButton = document.getElementById('confirmHubPublish');

        if (!confirmHubPublishButton.checked) {
          Swal.showValidationMessage('Please read and mark the box to agree.');
          return;
        }

        confirmHubPublishButton.disabled = true;

        Swal.showLoading()

        try {
          result = await currentApp.publishOnHub()
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

        onPublished(result);
      }
    },
    {
      type: 'success',
      html: ReactDOMServer.renderToStaticMarkup(
        <div className={`${styles['elements-wrapper']} ${styles['congrats-box']}`}>
          <p className={styles['congrats-message']}>
            Congratulations, your app is now public on Database Hub!
          </p>
          <a className={styles['anchor-url']} target='_blank' href="https://www.back4app.com/database/back4app/list-of-all-continents-countries-cities">
            https://www.back4app.com/database/back4app/list-of-all-continents-countries-cities
          </a>
        </div>
      ),
      showCancelButton: false,
      confirmButtonText: 'Got it!',
      onBeforeOpen: () => {
        const a = Swal.getContent().querySelector('a')
        if (a) a.href = a.text = `https://www.back4app.com/database/${result.author.slug}/${result.database.slug}`
      }
    }
  ])
}

export default  { show }
