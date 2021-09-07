/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Dropdown           from 'components/Dropdown/Dropdown.react';
import Field              from 'components/Field/Field.react';
import Label              from 'components/Label/Label.react';
import Modal              from 'components/Modal/Modal.react';
import Option             from 'components/Dropdown/Option.react';
import React              from 'react';
import { SpecialClasses } from 'lib/Constants';
import styles             from './Browser.scss';
import TextInput          from 'components/TextInput/TextInput.react';
import history            from 'dashboard/history';

function validClassName(name) {
  return !!name.match(/^[a-zA-Z][_a-zA-Z0-9]*$/);
}

export default class CreateClassDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      type: 'Custom',
      name: '',
      isProtected: true
    };
  }

  valid() {
    if (this.state.type !== 'Custom') {
      return true;
    }
    if (this.state.name.length === 0) {
      return false;
    }
    if (!validClassName(this.state.name)) {
      return false;
    }
    if (this.props.currentClasses.indexOf(this.state.name) > -1) {
      return false;
    }
    return true;
  }

  render() {
    let availableClasses = ['Custom'];
    for (let raw in SpecialClasses) {
      if (raw !== '_Session' && raw !== '_PushStatus' && this.props.currentClasses.indexOf(raw) < 0) {
        availableClasses.push(SpecialClasses[raw]);
      }
    }

    let typeDropdown = (
      <Dropdown
        value={this.state.type}
        onChange={(type) => this.setState({ type: type, name: '' })}>
        {availableClasses.map((t) => <Option key={t} value={t}>{t}</Option>)}
      </Dropdown>
    );
    return (
      <Modal
        type={Modal.Types.INFO}
        icon='plus'
        iconSize={40}
        title='Add a new class'
        subtitle='Create a new collection of objects.'
        disabled={!this.valid()}
        confirmText='Create class'
        cancelText={'Cancel'}
        continueText={'Create class & add columns'}
        onCancel={this.props.onCancel}
        showContinue={true}
        onContinue={async () => {
          let type = this.state.type;
          let className = type === 'Custom' ? this.state.name : '_' + type;
          await this.props.onConfirm(className);
          history.push(`/apps/${this.props.currentAppSlug}/browser/${className}`);
          this.props.onAddColumn();
        }}
        onConfirm={() => {
          let type = this.state.type;
          let className = type === 'Custom' ? this.state.name : '_' + type;
          this.props.onConfirm(className, this.state.isProtected);
        }}>
        {availableClasses.length > 1 ?
          <Field
          label={
            <Label
              text='What type of class do you need?' />
          }
          input={typeDropdown} /> : null
        }
        {this.state.type === 'Custom' ?
          (<>
            <Field
              label={<Label text='What should we call it?' description={'Don\u2019t use any special characters, and start your name with a letter.'} />}
              input={<TextInput placeholder='Give it a good name...' value={this.state.name} onChange={(name) => this.setState({ name })} />}/> 
            <Field
              label={<Label text='Add in Protected mode' description={'Your class data is private by default. Client read/write access will only be granted as specified by your CLPs/ACLs security rules.'} />}
              input={
                <div className={styles.radiobuttonWrapper} >
                  <input 
                    id="CLP_Protected" 
                    name="CLP"
                    type="radio"
                    onChange={() => this.setState({ isProtected: !this.state.isProtected })}
                    defaultChecked={this.state.isProtected}
                  /> Protected
                </div>
              }
            />
            <Field
              label={<Label text='Add in Public mode' description={'Your class data is open by default. However, you must update your security rules to enable long-term client read/write access.'} />}
              input={
                <div className={styles.radiobuttonWrapper}>
                  <input 
                    id="CLP_Public" 
                    name="CLP" 
                    type="radio"
                    onChange={() => this.setState({ isProtected: !this.state.isProtected })}
                    defaultChecked={!this.state.isProtected}
                  /> Public read and write Enabled
                </div>
              }
            /> 
            </>
          )
            : null
        }
        <div style={{ display: "flex", flexDirection: "column", textAlign: "center", borderBottom: "1px solid #e3e3e3" }}>
          <span style={{ margin: '1rem' }}>or</span>
          <a style={{ color: "#169cee" }} href={b4aSettings.HUB_URL} target="_blank">Find a public dataset to connect</a>
          <span style={{ margin: '1rem' }}>e.g. jobs, countries, industries, colors, zip codes and more...</span>
        </div>
      </Modal>
    );
  }
}
