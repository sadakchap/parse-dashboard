import React            from 'react'
import ReactDOMServer       from 'react-dom/server'
import DashboardView    from 'dashboard/DashboardView.react'
import Toolbar          from 'components/Toolbar/Toolbar.react'
import Fieldset         from 'components/Fieldset/Fieldset.react';
import styles           from 'dashboard/B4aHubPublishPage/B4aHubPublishPage.scss'
import ReactPlayer      from 'react-player';
import Label            from 'components/Label/Label.react';
import Button           from 'components/Button/Button.react';
import Field            from 'components/Field/Field.react';
import B4aHubPublishModal    from 'dashboard/B4aHubPublishPage/B4aHubPublishModal'
import Swal                 from 'sweetalert2'

class B4aHubPublishPage extends DashboardView {
  constructor() {
    super()
    this.section = 'Publish on Hub'
    this.state = {
      url: undefined
    }
  }

  renderContent() {
    return (
      <div className={styles['hub-publish-page']}>
        <Toolbar section="Publish on Hub" />
        <Fieldset
          legend="Publish on Hub"
          description="Database Hub is the place where the developers can share, connect, and clone datasets and app templates."
        >
          <ReactPlayer
            url="https://www.youtube.com/watch?v=JKuwDLIrJ-0&t=6s"
            controls
            width="650px"
            style={{
              border: "1px solid #000",
              borderRadius: "4px",
              marginBottom: "20"
            }}
          />
          <Field
            height='120px'
            textAlign='center'
            label={<Label text="Publish this app on Database Hub" description="By publishing this app on Database Hub you will make it available for other developers to clone or connect." />}
            input={<div className={styles['input']}>
              <Button
                onClick={() => {
                  if (!this.context.currentApp.custom.isOwner) {
                    Swal.queue([{
                      type: 'error',
                      html: ReactDOMServer.renderToStaticMarkup(
                        <div className={`${styles['elements-wrapper']} ${styles['congrats-box']}`}>
                          <p className={styles['congrats-message']}>
                            Sorry, you must be the app owner to publish it on Database Hub.
                          </p>
                        </div>
                      )
                    }])
                    return;
                  }
                  B4aHubPublishModal.show(result => {
                    this.setState({
                      url: `https://www.back4app.com/database/${result.author.slug}/${result.database.slug}`
                    })
                  })
                }}
                value='Publish on Hub'
                primary={true}
                className={styles['input-child']}
              />
            </div>}
          />
        </Fieldset>
      </div>
    )
  }
}

export default B4aHubPublishPage
