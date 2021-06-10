/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import CategoryList    from 'components/CategoryList/CategoryList.react';
import DashboardView   from 'dashboard/DashboardView.react';
import EmptyState      from 'components/EmptyState/EmptyState.react';
import LogView         from 'components/LogView/LogView.react';
import LogViewEntry    from 'components/LogView/LogViewEntry.react';
import React           from 'react';
import ReleaseInfo     from 'components/ReleaseInfo/ReleaseInfo';
import Toolbar         from 'components/Toolbar/Toolbar.react';
import LoaderContainer from 'components/LoaderContainer/LoaderContainer.react';
import Icon            from 'components/Icon/Icon.react';

import styles          from 'dashboard/Data/Logs/Logs.scss';

let subsections = {
  access: 'Access',
  info: 'Info',
  error: 'Error',
  system: 'System'
};

export default class Logs extends DashboardView {
  constructor() {
    super();
    this.section = 'Cloud Code';
    this.subsection = 'Logs';

    this.state = {
      loading: false,
      logs: [],
      release: undefined
    };

    this.refreshLogs = this.refreshLogs.bind(this);
  }

  componentDidMount() {
    this.fetchLogs(this.context.currentApp, this.props.params.type);
    // this.fetchRelease(this.context.currentApp);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context !== nextContext) {
      this.fetchLogs(nextContext.currentApp, nextProps.params.type);
      // this.fetchRelease(nextContext.currentApp);
    }
  }

  fetchLogs(app, type) {
    // set loading true
    this.setState({
      loading: true
    });
    let serverLogType = ['access', 'system'];
    if (serverLogType.includes(type)) {
      app.fetchServerLogs().then(res => {
        this.setState({
          logs: type === 'access' ? res.access : res.docker,
          loading: false
        });
      }, err => this.setState({ logs: [], loading: false }));
      return;
    }
    
    let typeParam = (type || 'INFO').toUpperCase();
    app.getLogs(typeParam).then(
      (logs) => {
        this.setState({ logs, loading: false });
      },
      () => this.setState({ logs: [], loading: false })
    );
  }

  refreshLogs(e) {
    e.preventDefault();
    this.setState({ logs: undefined });
    this.fetchLogs(this.context.currentApp, this.props.params.type);
  }

  // As parse-server doesn't support (yet?) versioning, we are disabling
  // this call in the meantime.

  /*
  fetchRelease(app) {
    app.getLatestRelease().then(
      ({ release }) => this.setState({ release }),
      () => this.setState({ release: null })
    );
  }
  */

  renderSidebar() {
    let current = this.props.params.type || '';
    return (
      <CategoryList current={current} linkPrefix={'logs/'} categories={[
        { name: 'Access', id: 'access' },
        { name: 'Info', id: 'info' },
        { name: 'Error', id: 'error' },
        { name: 'System', id: 'system' },
      ]} />
    );
  }

  renderContent() {
    // Send track event
    back4AppNavigation && back4AppNavigation.atParseLogsEvent()

    let toolbar = null;
    if (subsections[this.props.params.type]) {
      toolbar = (
        <Toolbar
          section='Logs'
          subsection={subsections[this.props.params.type]}
          details={ReleaseInfo({ release: this.state.release })}
          >
          <a className={styles.toolbarButton} onClick={this.refreshLogs} title='Refresh'>
            <Icon name='refresh' width={30} height={26} />
          </a>
        </Toolbar>
      );
    }
    let content = null;
    content = (
      <LoaderContainer loading={this.state.loading} solid={false}>
        {this.state.logs.length === 0 && !this.state.loading ? (
          <div className={styles.content}>
            <EmptyState
              icon='files-outline'
              title='No logs in the last 30 days'
              description='When you start using Cloud Code, your logs will show up here.'
              cta='Learn more'
              action={() => window.location = 'http://docs.parseplatform.org/cloudcode/guide'} />
          </div>
        ) : (
          <div className={styles.content}>
            <LogView>
              {this.state.logs.map(({ message, timestamp }) => <LogViewEntry
                key={timestamp}
                text={message}
                timestamp={timestamp} />)}
            </LogView>
          </div>
        )}
      </LoaderContainer>
    );
    return (
      <div>
        {content}
        {toolbar}
      </div>
    );
  }
}
