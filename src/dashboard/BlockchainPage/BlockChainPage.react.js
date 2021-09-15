/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { ActionTypes }    from 'lib/stores/SchemaStore';
import DashboardView      from 'dashboard/DashboardView.react';
import Dropdown           from 'components/Dropdown/Dropdown.react';
import Field              from 'components/Field/Field.react';
import Fieldset           from 'components/Fieldset/Fieldset.react';
import Label              from 'components/Label/Label.react';
import LoaderContainer    from 'components/LoaderContainer/LoaderContainer.react';
import Option             from 'components/Dropdown/Option.react';
import ParseApp           from 'lib/ParseApp';
import PropTypes          from 'lib/PropTypes';
import React              from 'react';
import TextInput          from 'components/TextInput/TextInput.react';
import Toolbar            from 'components/Toolbar/Toolbar.react';
import styles             from './BlockChainPage.scss' ;
import subscribeTo        from 'lib/subscribeTo';
import MoveToBlockchainModal from './MoveToBlockchainModal.react';

const BLOCKCHAIN_CLASS_STATUS = {
  SUCCESS: 'success',
  PROGRESS: 'progress'
}

@subscribeTo('Schema', 'schema')
class BlockChainPage extends DashboardView {
  constructor() {
    super();
    this.section = 'Database';
    this.subsection = 'BlockChain';

    this.state = {
      loading: true,
      appBalanceLoading: true,
      blockChainClassesLoading: true,
      classes: [],
      appBalance: '',
      blockChainClasses: [],
      selectedClass: '',
      showAddClassModal: false,
      showRemoveClassModal: false
    };
    this.moveClassToBlockChain = this.moveClassToBlockChain.bind(this);
  }

  componentWillMount() {
    this.props.schema.dispatch(ActionTypes.FETCH).then(() => {
      if (this.props.schema.data.get('classes')) {
        let classes = this.props.schema.data.get('classes').keySeq().toArray();
        this.setState({ loading: false, classes });  
      }
    });

    this.context.currentApp.getAppBalance().then(({ balance }) => {
      this.setState({ appBalanceLoading: false, appBalance: balance });
    });

    this.context.currentApp.getBlockchainClassNames().then(({ classNames }) => {
      const classes = classNames.map((name) => ({
        name,
        status: BLOCKCHAIN_CLASS_STATUS.SUCCESS
      }))
      this.setState({ blockChainClassesLoading: false, blockChainClasses: classes });
    });
  }

  moveClassToBlockChain() {

  }

  renderForm() {
    // filter classes
    
    return (
      <div className={styles.content}>
        <Fieldset
          legend="Settings"
          description="Select your app Ethereum Network and see the amount of Ethereum you have in your account."
        >
          <Field
            label={<Label text="BlockChain Network" />}
            input={
              <TextInput
                value="Back4App ETH Development"
                disabled
                onChange={() => {}}
              />
            }
          />
          <Field
            label={<Label text="Balance" />}
            input={
              this.state.appBalanceLoading ? (
                <div className={styles.spinnerWrapper}>
                  <div className={styles.spinner}></div>
                </div>
              ) : (
                <TextInput
                  value={this.state.appBalance}
                  disabled
                  onChange={() => {}}
                />
              )
            }
          />
        </Fieldset>
        <Fieldset
          legend="Classes in blockchain"
          description="Select the classes you want to move  to blockchain."
        >
          <Field
            label={<Label text="Classes at BlockChain" />}
            input={
              <Dropdown
                placeHolder="Select a class to replicate into blockchain"
                onChange={(value) => this.setState({ selectedClass: value, showAddClassModal: true })}
                value={this.state.selectedClass}
              >
                {this.state.classes.map((cls, idx) => (
                  <Option key={idx} value={cls}>{cls}</Option>
                ))}
              </Dropdown>
            }
          />
        </Fieldset>
      </div>
    );
  }

  renderContent() {

    let extra = null;
    if (this.state.showAddClassModal) {
      extra = <MoveToBlockchainModal 
        className={this.state.selectedClass}
        onConfirm={this.moveClassToBlockChain}
        onCancel={() => this.setState({ selectedClass: '', showAddClassModal: false })}
      />
    } else if (this.state.showRemoveClassModal) {

    }

    return <div>
      <LoaderContainer loading={this.state.loading}>
        {this.renderForm()}
        {extra}
      </LoaderContainer>
      <Toolbar details='Settings' subsection='BlockChain' />
    </div>;
  }
}

BlockChainPage.contextTypes = {
  currentApp: PropTypes.instanceOf(ParseApp),
};

export default BlockChainPage