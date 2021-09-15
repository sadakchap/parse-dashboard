/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Modal     from 'components/Modal/Modal.react';
import TextInput from 'components/TextInput/TextInput.react';
import Field     from 'components/Field/Field.react';
import Label     from 'components/Label/Label.react';
import React     from 'react';
import styles    from './BlockChainPage.scss';

export default class MoveToBlockchainModal extends React.Component {
  constructor() {
    super()
    this.state = {
      name: ''
    }
  }

  valid() {
    let className = this.props.className[0] === '_' ? this.props.className.slice(1) : this.props.className;
    return this.state.name === className;
  }

  render() {
    let content = (
      <div>
        <div className={styles.modalHeadContent}>
          <h4>Do you really want to move these classes to Blockchain? This action could take a while.</h4>
          <span>*This action can only be performed by the App owner.</span>
        </div>
        <Field
          label={<Label text="Type the classname" />}
          input={
            <TextInput
              placeholder="Classname"
              onChange={(name) => this.setState({ name })}
            />
          }
        />
      </div>
    );

    return (
      <Modal
        type={Modal.Types.INFO}
        title='Move class to Blockchain?'
        subtitle='This action will move the selected class to Blockchain, and it could take a while.'
        confirmText='Move selected class to Blockchain'
        disabled={!this.valid()}
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
        progress={this.props.progress}
      >
        {content}
      </Modal>
    );
  }
}
