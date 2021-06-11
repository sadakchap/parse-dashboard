/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import CategoryList from "components/CategoryList/CategoryList.react";
import DashboardView from "dashboard/DashboardView.react";
import EmptyState from "components/EmptyState/EmptyState.react";
import LogView from "components/LogView/LogView.react";
import LogViewEntry from "components/LogView/LogViewEntry.react";
import React from "react";
import ReleaseInfo from "components/ReleaseInfo/ReleaseInfo";
import Toolbar from "components/Toolbar/Toolbar.react";
import LoaderContainer from "components/LoaderContainer/LoaderContainer.react";
import Icon from "components/Icon/Icon.react";
import ServerLogsView from "components/ServerLogsView/ServerLogsView.react";

import styles from "dashboard/Data/Logs/Logs.scss";

export default class SystemLogs extends DashboardView {
  constructor() {
    super();
    this.section = "Cloud Code";
    this.subsection = "Logs";

    this.state = {
      loading: false,
      logs: "",
      release: undefined
    };

    this.refreshLogs = this.refreshLogs.bind(this);
  }

  componentDidMount() {
    this.fetchLogs(this.context.currentApp);
    // this.fetchRelease(this.context.currentApp);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context !== nextContext) {
      this.fetchLogs(nextContext.currentApp);
      // this.fetchRelease(nextContext.currentApp);
    }
  }

  fetchLogs(app) {
    // set loading true
    this.setState({
      loading: true
    });
    app.fetchServerLogs().then(
      res => {
        this.setState({
          logs: res.docker,
          loading: false
        });
      },
      err => this.setState({ logs: '', loading: false })
    );
  }

  refreshLogs(e) {
    e.preventDefault();
    this.fetchLogs(this.context.currentApp);
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
    let { path } = this.props.match;
    const current = path.substr(path.lastIndexOf("/") + 1, path.length - 1);
    return (
      <CategoryList
        current={current}
        linkPrefix={"logs/"}
        categories={[
          { name: "System", id: "system" },
          { name: "Info", id: "info" },
          { name: "Error", id: "error" },
          { name: "Access", id: "access" }
        ]}
      />
    );
  }

  renderContent() {
    // Send track event
    back4AppNavigation && back4AppNavigation.atParseLogsEvent()

    let refreshIconStyles = styles.toolbarButton;
    if (this.state.loading) {
      refreshIconStyles += ` ${styles.toolbarButtonDisabled}`;
    }
    let toolbar = null;
    toolbar = (
      <Toolbar
        section="Logs"
        subsection="Server System"
        details={ReleaseInfo({ release: this.state.release })}
      >
        <a
          className={refreshIconStyles}
          onClick={!this.state.loading ? this.refreshLogs : undefined}
          title="Refresh"
        >
          <Icon name="refresh" width={30} height={26} />
        </a>
      </Toolbar>
    );
    let content = null;
    content = (
      <LoaderContainer loading={this.state.loading} solid={false}>
        {!this.state.loading && this.state.logs === "" ? (
          <div className={styles.content}>
            <EmptyState
              icon="files-outline"
              title="No System logs in the last 30 days"
              description="When you start using Cloud Code, your logs will show up here."
              cta="Learn more"
              action={() =>
                (window.location =
                  "http://docs.parseplatform.org/cloudcode/guide")
              }
            />
          </div>
        ) : (
          <div className={styles.content}>
            <ServerLogsView type="system" logs={this.state.logs} />
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