import PropTypes from 'prop-types'
import React from 'react'
import EmptyState from 'components/EmptyState/EmptyState.react'
import Icon from 'components/Icon/Icon.react'
import DashboardView from 'dashboard/DashboardView.react'
import HubDisconnectionDialog from 'dashboard/Hub/HubDisconnectionDialog.react'
import ParseApp from 'lib/ParseApp'
import styles from './HubConnections.scss'

class HubConnections extends DashboardView {
  constructor(props, context) {
    super(props, context);

    this.section = 'Core';
    this.subsection = 'Connections';

    this.state = {
      data: null,
      namespaceBeingDisconnected: '',
      showDisconnectDialog: false
    };
  }

  async componentDidMount() {
    const data = await this.context.currentApp.fetchHubConnections();
    this.setState({ data });
  }

  renderRows() {
    if (!this.state.data) {
      return null
    }
    return this.state.data.map(({ name, authorSlug, namespace, slug }) => {
      return (
        <tr key={namespace}>
          <td>{name}</td>
          <td>{namespace}</td>
          <td>
            <a href={`${b4aSettings.BACK4APP_SITE_PATH}/database/${authorSlug}/${slug}`}>
              View on Hub
            </a>
          </td>
          <td>
            <a onClick={() => this.setState({ namespaceBeingDisconnected: namespace, showDisconnectDialog: true })}>
              <Icon name='trash-solid' fill='red' width={18} height={18} role='button'/>
            </a>
          </td>
        </tr>
      )
    })
  }

  renderContent() {
    return (
      <div className={styles.hubConnections}>
        <div className={styles.headerContainer}>
          <div className={styles.headerDescriptionContainer}>
            <section className={styles.header}>
              <span className={styles.subtitle}>{(this.state.data && this.state.data.length) || 0} public databases connected</span>
              <div>
                <span className={styles.title}>Connections</span>
              </div>
            </section>
          </div>
        </div>
        {!this.state.data || this.state.data.length === 0
          ? <EmptyState
              action='http://www.back4app.com/database'
              description='Check the Database Hub and connect to public databases'
              icon='devices-solid'
              title='No connections were found'
            />
          : <>
              <div className={styles.connectionsTableContainer}>
                <table className={styles.connectionsTable}>
                  <thead>
                    <tr>
                      <th>Public database</th>
                      <th>Namespace</th>
                      <th>Database Hub Link</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderRows()}
                  </tbody>
                </table>
              </div>
              {this.state.showDisconnectDialog &&
                <HubDisconnectionDialog
                  namespace={this.state.namespaceBeingDisconnected}
                  onConfirm={async () => {
                    await this.context.currentApp.disconnectHubDatabase(this.state.namespaceBeingDisconnected);
                    this.setState({ showDisconnectDialog: false });
                  }}
                  onCancel={() => this.setState({ showDisconnectDialog: false })} />
              }
            </>
        }
      </div>
    )
  }
}

HubConnections.contextTypes = {
  currentApp: PropTypes.instanceOf(ParseApp)
}

export default HubConnections
