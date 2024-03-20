/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Button from 'components/Button/Button.react';
import Dropdown from 'components/Dropdown/Dropdown.react';
import Field from 'components/Field/Field.react';
import Fieldset from 'components/Fieldset/Fieldset.react';
import FlowFooter from 'components/FlowFooter/FlowFooter.react';
import FormNote from 'components/FormNote/FormNote.react';
import generateCurl from 'dashboard/Data/ApiConsole/generateCurl';
import JsonPrinter from 'components/JsonPrinter/JsonPrinter.react';
import Label from 'components/Label/Label.react';
import B4aModal from 'components/B4aModal/B4aModal.react';
import Option from 'components/Dropdown/Option.react';
import Parse from 'parse';
import React, { Component } from 'react';
import request from 'dashboard/Data/ApiConsole/request';
import styles from 'dashboard/Data/ApiConsole/RestConsole.scss';
import TextInput from 'components/TextInput/TextInput.react';
import B4aToggle from 'components/Toggle/B4aToggle.react';
import Toolbar from 'components/Toolbar/Toolbar.react';
import { CurrentApp } from 'context/currentApp';

export default class RestConsole extends Component {
  static contextType = CurrentApp;
  constructor() {
    super();

    this.state = {
      method: 'GET',
      endpoint: '',
      useMasterKey: false,
      runAsIdentifier: '',
      sessionToken: null,
      parameters: '',
      response: { results: [] },
      fetchingUser: false,
      inProgress: false,
      error: false,
      curlModal: false,
    };
  }

  fetchUser() {
    if (this.state.runAsIdentifier.length === 0) {
      this.setState({ error: false, sessionToken: null });
      return;
    }
    Parse.Query.or(
      new Parse.Query(Parse.User).equalTo('username', this.state.runAsIdentifier),
      new Parse.Query(Parse.User).equalTo('objectId', this.state.runAsIdentifier)
    )
      .first({ useMasterKey: true })
      .then(
        found => {
          if (found) {
            if (found.getSessionToken()) {
              this.setState({
                sessionToken: found.getSessionToken(),
                error: false,
                fetchingUser: false,
              });
            } else {
              // Check the Sessions table
              new Parse.Query(Parse.Session)
                .equalTo('user', found)
                .first({ useMasterKey: true })
                .then(
                  session => {
                    if (session) {
                      this.setState({
                        sessionToken: session.getSessionToken(),
                        error: false,
                        fetchingUser: false,
                      });
                    } else {
                      this.setState({
                        error: 'Unable to find any active sessions for that user.',
                        fetchingUser: false,
                      });
                    }
                  },
                  () => {
                    this.setState({
                      error: 'Unable to find any active sessions for that user.',
                      fetchingUser: false,
                    });
                  }
                );
            }
          } else {
            this.setState({
              error: 'Unable to find that user.',
              fetchingUser: false,
            });
          }
        },
        () => {
          this.setState({
            error: 'Unable to find that user.',
            fetchingUser: false,
          });
        }
      );
    this.setState({ fetchingUser: true });
  }

  makeRequest() {
    const endpoint =
      this.state.endpoint + (this.state.method === 'GET' ? `?${this.state.parameters}` : '');
    const payload =
      this.state.method === 'DELETE' || this.state.method === 'GET' ? null : this.state.parameters;
    const options = {};
    if (this.state.useMasterKey) {
      options.useMasterKey = true;
    }
    if (this.state.sessionToken) {
      options.sessionToken = this.state.sessionToken;
    }
    request(this.context, this.state.method, endpoint, payload, options).then(response => {
      this.setState({ response });
      document.body.scrollTop = 540;
    });
  }

  showCurl() {
    this.setState({ curlModal: true });
  }

  render() {
    const methodDropdown = (
      <Dropdown onChange={method => this.setState({ method })} value={this.state.method} dark={true}>
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
      </Dropdown>
    );

    const hasError =
      this.state.fetchingUser ||
      this.state.endpoint.length === 0 ||
      (this.state.runAsIdentifier.length > 0 && !this.state.sessionToken);
    let parameterPlaceholder = 'where={"username":"johndoe"}';
    if (this.state.method === 'POST' || this.state.method === 'PUT') {
      parameterPlaceholder = '{"name":"John"}';
    }

    let modal = null;
    if (this.state.curlModal) {
      const payload = this.state.method === 'DELETE' ? null : this.state.parameters;
      const options = {};
      if (this.state.useMasterKey) {
        options.useMasterKey = true;
      }
      if (this.state.sessionToken) {
        options.sessionToken = this.state.sessionToken;
      }
      const content = generateCurl(
        this.context,
        this.state.method,
        this.state.endpoint,
        payload,
        options
      );
      modal = (
        <B4aModal
          title="cURL Request"
          subtitle="Use this to replicate the request"
          onCancel={() => this.setState({ curlModal: false })}
          customFooter={
            <div className={styles.footer}>
              <Button
                primary={true}
                value="Close"
                onClick={() => this.setState({ curlModal: false })}
              />
            </div>
          }
        >
          <div className={styles.curl}>{content}</div>
        </B4aModal>
      );
    }

    return (
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.title}>Send a test query</div>
            <div className={styles.subtitle}>Try out some queries, and take a look at what they return.</div>
          </div>
          <Fieldset
            legend=""
            description=""
          >
            <Field label={<Label text="What type of request?" dark={true} />} input={methodDropdown} theme={Field.Theme.BLUE} />
            <Field
              label={
                <Label
                  text="Which endpoint?"
                  description={
                    <span>
                      Not sure what endpoint you need?
                      <br />
                      Take a look at our{' '}
                      <a href="http://docs.parseplatform.org/rest/guide/" className={styles.helpLink}>REST API guide</a>.
                    </span>
                  }
                  dark={true}
                />
              }
              input={
                <div style={{ padding: '0 1rem', width: '100%' }}>
                  <TextInput
                    value={this.state.endpoint}
                    monospace={true}
                    placeholder={'classes/_User'}
                    onChange={endpoint => this.setState({ endpoint })}
                  />
                </div>
              }
              theme={Field.Theme.BLUE}
            />
            <Field
              label={<Label text="Use Master Key?" description={'This will bypass any ACL/CLPs.'} dark={true} />}
              input={
                <div style={{ padding: '1rem', width: '100%' }}>
                  <B4aToggle
                    type={B4aToggle.Types.TRUE_FALSE}
                    value={this.state.useMasterKey}
                    onChange={useMasterKey => this.setState({ useMasterKey })}
                  />
                </div>
              }
              theme={Field.Theme.BLUE}
            />
            <Field
              label={
                <Label
                  text="Run as..."
                  description={
                    'Send your query as a specific user. You can use their username or Object ID.'
                  }
                  dark={true}
                />
              }
              input={
                <div style={{ padding: '0 1rem', width: '100%' }}>
                  <TextInput
                    value={this.state.runAsIdentifier}
                    monospace={true}
                    placeholder={'Username or ID'}
                    onChange={runAsIdentifier => this.setState({ runAsIdentifier })}
                    onBlur={this.fetchUser.bind(this)}
                  />
                </div>
              }
              theme={Field.Theme.BLUE}
            />
            <FormNote color="red" show={!!this.state.error}>
              {this.state.error}
            </FormNote>
            <Field
              label={
                <Label
                  text="Query parameters"
                  description={
                    <span>
                      Learn more about query parameters in our{' '}
                      <a href="http://docs.parseplatform.org/rest/guide/#queries" className={styles.helpLink}>REST API guide</a>.
                    </span>
                  }
                  dark={true}
                />
              }
              input={
                <div style={{ padding: '0 1rem', width: '100%' }}>
                  <TextInput
                    value={this.state.parameters}
                    monospace={true}
                    multiline={true}
                    placeholder={parameterPlaceholder}
                    onChange={parameters => this.setState({ parameters })}
                    className={styles.textarea}
                  />
                </div>
              }
              theme={Field.Theme.BLUE}
            />
          </Fieldset>
          <div className={styles.results}>
            <div className={styles.title}>Result</div>
            <div className={styles.resultContent}><JsonPrinter object={this.state.response} /></div>
          </div>
        </div>
        <Toolbar section="API" subsection="Console > REST">
          <FlowFooter
            borderTop="none"
            primary={
              <Button
                primary={true}
                disabled={hasError}
                value="Send Query"
                progress={this.state.inProgress}
                onClick={this.makeRequest.bind(this)}
              />
            }
            secondary={
              <Button disabled={hasError} color="white" value="Export to cURL" width="auto" dark={true} onClick={this.showCurl.bind(this)} />
            }
          />
        </Toolbar>
        {modal}
      </div>
    );
  }
}
