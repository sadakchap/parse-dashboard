/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import PropTypes  from 'lib/PropTypes';
import ParseApp   from 'lib/ParseApp';
import React      from 'react';

export default class SettingsData extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: undefined,
      loadingSettings: true
    };
  }

  componentDidMount() {
    this.context.currentApp.fetchSettingsFields().then(({ fields }) => {
      this.setState({ ...fields, loadingSettings: false });
    });
  }

  componentWillReceiveProps(props, context) {
    if (this.context !== context) {
      this.setState({ fields: undefined });
      context.currentApp.fetchSettingsFields().then(({ fields }) => {
        this.setState({ ...fields, loadingSettings: false });
      });
    }
  }

  saveChanges(changes) {
    let promise = this.context.currentApp.saveSettingsFields(changes)
    promise.then(({successes}) => {
      let newFields = {...this.state.fields, ...successes};
      this.setState({fields: newFields});
    });
    return promise;
  }

  render() {
    return this.props.children({
      initialFields: this.state.fields,
      saveChanges: this.saveChanges.bind(this),
      loadingSettings: this.state.loadingSettings
    })
  }
}

SettingsData.contextTypes = {
  currentApp: PropTypes.instanceOf(ParseApp)
};
