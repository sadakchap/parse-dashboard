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

export default class RemoveFromBlockchainModal extends React.Component {
  constructor() {
    super()
    this.state = {
      name: ''
    }
  }

  valid() {
    return this.state.name === this.props.className;
  }

  render() {
    let content = (
      <div>
        <div className={styles.modalHeadContent}>
          <h4>Do you really want to remove this class from Back4App ETH Development?</h4>
        </div>
        <Field
          label={<Label text='Type the class name' />}
          input={
            <TextInput
              placeholder='Class name'
              onChange={(name) => this.setState({ name })}
            />
          }
        />
      </div>
    );

    return (
      <Modal
        type={Modal.Types.DANGER}
        title='Remove class from blockchain'
        subtitle='This action will remove this class from Back4App ETH Development.'
        confirmText='Remove'
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
