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
import ParseApp           from 'lib/ParseApp';
import PropTypes          from 'lib/PropTypes';
import React              from 'react';
import TextInput          from 'components/TextInput/TextInput.react';
import Toolbar            from 'components/Toolbar/Toolbar.react';
import styles             from './BlockChainPage.scss' ;
import subscribeTo        from 'lib/subscribeTo';

@subscribeTo('Schema', 'schema')
class BlockChainPage extends DashboardView {
  constructor() {
    super();
    this.section = 'Database';
    this.subsection = 'BlockChain';

    this.state = {
      loading: true,
      classes: [],
      blockChainClasses: [],
      showAddClassModal: false,
      showRemoveClassModal: false
    };
  }

  componentWillMount() {
    this.props.schema.dispatch(ActionTypes.FETCH).then(() => {
      if (this.props.schema.data.get('classes')) {
        let classes = this.props.schema.data.get('classes').keySeq().toArray();
        this.setState({ classes });  
      }
    });

    // this.context.currentApp.getBlockchainClassNames().then((classes) => {
    //   this.setState({ loading: false, blockChainClasses: classes });
    // });
  }

  renderForm() {
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
              <TextInput
                value="1.0 ETH (Development)"
                disabled
                onChange={() => {}}
              />
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
                onChange={() => {}}
              />
            }
          />
        </Fieldset>
      </div>
    );
  }

  renderContent() {

    let extra = null;
    if (this.state.showAddClassModal) {
      
    } else if (this.state.showRemoveClassModal) {

    }

    return <div>
      {this.renderForm()}
      {extra}
      <Toolbar details='Settings' subsection='BlockChain' />
    </div>;
  }
}

BlockChainPage.contextTypes = {
  currentApp: PropTypes.instanceOf(ParseApp),
};

export default BlockChainPage