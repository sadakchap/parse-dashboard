/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { ActionTypes }            from 'lib/stores/SchemaStore';
import DashboardView              from 'dashboard/DashboardView.react';
import Dropdown                   from 'components/Dropdown/Dropdown.react';
import Field                      from 'components/Field/Field.react';
import Fieldset                   from 'components/Fieldset/Fieldset.react';
import Icon                       from 'components/Icon/Icon.react';
import Label                      from 'components/Label/Label.react';
import LoaderContainer            from 'components/LoaderContainer/LoaderContainer.react';
import Option                     from 'components/Dropdown/Option.react';
import ParseApp                   from 'lib/ParseApp';
import PropTypes                  from 'lib/PropTypes';
import React                      from 'react';
import TextInput                  from 'components/TextInput/TextInput.react';
import Toolbar                    from 'components/Toolbar/Toolbar.react';
import styles                     from './BlockChainPage.scss' ;
import subscribeTo                from 'lib/subscribeTo';
import MoveToBlockchainModal      from './MoveToBlockchainModal.react';
import RemoveFromBlockchainModal  from './RemoveFromBlockchainModal.react';
import Notification               from '../Data/Browser/Notification.react';

@subscribeTo("Schema", "schema")
class BlockChainPage extends DashboardView {
  constructor() {
    super();
    this.section = "Database";
    this.subsection = "BlockChain";

    this.state = {
      loading: true,
      appBalanceLoading: true,
      blockChainClassesLoading: true,
      classes: [],
      appBalance: "",
      blockChainClasses: [],
      selectedClass: "",
      showAddClassModal: false,
      showRemoveClassModal: false,
      inProgress: false,
      lastError: "",
      lastNote: "",
    };
    this.moveClassToBlockChain = this.moveClassToBlockChain.bind(this);
    this.removeClassFromBlockChain = this.removeClassFromBlockChain.bind(this);
    this.showNote = this.showNote.bind(this);
  }

  componentWillMount() {
    this.props.schema.dispatch(ActionTypes.FETCH).then(() => {
      if (this.props.schema.data.get("classes")) {
        let classes = this.props.schema.data.get("classes").keySeq().toArray();
        this.setState({ loading: false, classes });
      }
    });

    this.context.currentApp.getAppBalance().then(({ balance }) => {
      this.setState({ appBalanceLoading: false, appBalance: balance });
    });

    this.context.currentApp.getBlockchainClassNames().then(({ classNames }) => {
      this.setState({
        blockChainClassesLoading: false,
        blockChainClasses: classNames,
      });
    });
  }

  showNote(message, isError) {
    if (!message) {
      return;
    }

    clearTimeout(this.noteTimeout);

    if (isError) {
      this.setState({ lastError: message, lastNote: null });
    } else {
      this.setState({ lastNote: message, lastError: null });
    }

    this.noteTimeout = setTimeout(() => {
      this.setState({ lastError: null, lastNote: null });
    }, 3500);
  }

  moveClassToBlockChain() {
    let selectedClassName = this.state.selectedClass;
    this.setState({
      inProgress: true,
    });
    this.context.currentApp
      .moveClassToBlockchain(selectedClassName)
      .then(() => {
        this.setState({
          blockChainClasses: [ ...this.state.blockChainClasses, selectedClassName ],
          classes: this.state.classes.filter(name => name !== selectedClassName)
        });
      })
      .catch((err) => {
        console.log(err);
        this.showNote(err.response?.data || err.message, true);
      })
      .finally(() => {
        this.setState({
          inProgress: false,
          showAddClassModal: false,
          selectedClass: ''
        });
      })
  }

  removeClassFromBlockChain() {
    let selectedClassName = this.state.selectedClass;
    this.setState({
      inProgress: true,
    });
    this.context.currentApp
      .removeFromBlockchain(selectedClassName)
      .then(() => {
        this.setState({
          blockChainClasses: this.state.blockChainClasses.filter(name => name !== selectedClassName),
          classes: [...this.state.classes, selectedClassName]
        });
      })
      .catch((err) => {
        console.log(err);
        this.showNote(err.response?.data || err.message, true);
      })
      .finally(() => {
        this.setState({
          inProgress: false,
          showRemoveClassModal: false,
          selectedClass: ''
        })
      })
  }

  renderClassesAtBlockchain() {
    return (
      <div>
        <div className={styles.headerRow}>
          <div className={styles.className}>Class</div>
          <a className={styles.action}>
            <Icon name="delete-icon" fill="#169CEE" width={24} height={20} />
          </a>
        </div>
        {this.state.blockChainClasses.map((name, idx) => (
          <div key={idx} className={styles.row}>
            <div className={styles.className}>{name}</div>
            <a
              className={styles.action}
              onClick={() =>
                this.setState({
                  showRemoveClassModal: true,
                  selectedClass: name,
                })
              }
            >
              <Icon name="delete-icon" fill="#169CEE" width={24} height={20} />
            </a>
          </div>
        ))}
      </div>
    );
  }

  renderForm() {
    const classes = this.state.classes.filter(name => !this.state.blockChainClasses.includes(name));

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
                onChange={(value) =>
                  this.setState({
                    selectedClass: value,
                    showAddClassModal: true,
                  })
                }
                value={this.state.selectedClass}
              >
                {classes.map((cls, idx) => (
                  <Option key={idx} value={cls}>
                    {cls}
                  </Option>
                ))}
              </Dropdown>
            }
          />
          {this.renderClassesAtBlockchain()}
        </Fieldset>
      </div>
    );
  }

  renderContent() {
    let extra = null;
    if (this.state.showAddClassModal) {
      extra = (
        <MoveToBlockchainModal
          className={this.state.selectedClass}
          onConfirm={this.moveClassToBlockChain}
          onCancel={() =>
            this.setState({ selectedClass: "", showAddClassModal: false })
          }
          progress={this.state.inProgress}
        />
      );
    } else if (this.state.showRemoveClassModal) {
      extra = (
        <RemoveFromBlockchainModal
          className={this.state.selectedClass}
          onConfirm={this.removeClassFromBlockChain}
          onCancel={() =>
            this.setState({ selectedClass: "", showRemoveClassModal: false })
          }
          progress={this.state.inProgress}
        />
      );
    }

    let notification = null;
    if (this.state.lastError) {
      notification = (
        <Notification note={this.state.lastError} isErrorNote={true} />
      );
    } else if (this.state.lastNote) {
      notification = (
        <Notification note={this.state.lastNote} isErrorNote={false} />
      );
    }

    return (
      <div>
        <LoaderContainer loading={this.state.loading}>
          {this.renderForm()}
          {extra}
          {notification}
        </LoaderContainer>
        <Toolbar details="Settings" subsection="BlockChain" />
      </div>
    );
  }
}

BlockChainPage.contextTypes = {
  currentApp: PropTypes.instanceOf(ParseApp),
};

export default BlockChainPage