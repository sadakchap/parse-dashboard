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
  render() {
    let content = (
      <div>
        <div className={styles.modalHeadContent}>
          <h4>Do you really want to add this class to the Blockchain?</h4>
        </div>
      </div>
    );

    return (
      <Modal
        type={Modal.Types.INFO}
        title='Add class to Blockchain?'
        subtitle='This action will add the selected class to the Blockchain and it can take a while to complete.'
        confirmText='Add selected class to blockchain'
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
        progress={this.props.progress}
        buttonsInCenter={true}
      >
        {content}
      </Modal>
    );
  }
}
