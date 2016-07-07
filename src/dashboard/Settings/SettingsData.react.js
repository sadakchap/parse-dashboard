/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import ParseApp from 'lib/ParseApp';
import React    from 'react';

export default class SettingsData extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: undefined
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.context.currentApp.fetchSettingsFields().then(( fields ) => {
      this.setState({ fields });
    });
  }

  componentWillReceiveProps(props, context) {
    console.log('componentWillReceiveProps')
    if (this.context !== context) {
      this.setState({ fields: undefined });
      context.currentApp.fetchSettingsFields().then(({ fields }) => {
        fields = {"success":true,"fields":{"client_class_creation_enabled":true,"client_push_enabled":false,"rest_push_enabled":true,"require_revocable_session":true,"expire_revocable_session":true,"revoke_on_password_reset":true,"subdomain_name":null,"host_name_key":"a17777dada61","host_name":null,"send_email_address":"no-reply@parseapps.com","sender_display_name":null,"verify_emails":false,"email_verification_mail_subject":"Please verify your e-mail for %appname%","email_verification_mail_body":"Hi,\n\nYou are being asked to confirm the e-mail address %email% with %appname%\n\nClick here to confirm it:\n%link%","reset_password_mail_subject":"Password Reset Request for %appname%","reset_password_mail_body":"Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%","choose_password_link":"/apps/choose_password","password_updated_link":"/apps/password_reset_success.html","email_verification_link":"/apps/verify_email_success.html","invalid_link_link":"/apps/invalid_link.html","external_frame_link":null,"pricing_plan":{"base_price":0,"base_request_limit":30,"created_at":"2016-01-29T19:23:04Z","data_transfer_limit":2000,"file_storage_limit":20,"id":1178087,"max_file_size":20971520,"max_push_certificates":6,"mongo_limit":20,"parse_app_id":1218042,"push_limit":1000000,"request_limit":30,"updated_at":"2016-01-29T19:23:04Z"},"collaborators":[],"owner_email":"seiji_akiyama@live.com","owner_name":"seijiakiyama","urls":[{"platform":"other","url":"https://back4app.com"}],"auth_options_attributes":{"_enable_by_default":true,"username":{"enabled":true},"facebook":{"enabled":true},"twitter":{"enabled":true},"anonymous":{"enabled":true},"custom":{"enabled":true}},"gcm_credentials":[]}}
        this.setState({ fields });
      });
    }
  }

  saveChanges(changes) {
    console.log('saveChanges')
    let promise = this.context.currentApp.saveSettingsFields(changes)
    promise.then(({successes, failures}) => {
      let newFields = {...this.state.fields, ...successes};
      newFields = {"success":true,"fields":{"client_class_creation_enabled":true,"client_push_enabled":false,"rest_push_enabled":true,"require_revocable_session":true,"expire_revocable_session":true,"revoke_on_password_reset":true,"subdomain_name":null,"host_name_key":"a17777dada61","host_name":null,"send_email_address":"no-reply@parseapps.com","sender_display_name":null,"verify_emails":false,"email_verification_mail_subject":"Please verify your e-mail for %appname%","email_verification_mail_body":"Hi,\n\nYou are being asked to confirm the e-mail address %email% with %appname%\n\nClick here to confirm it:\n%link%","reset_password_mail_subject":"Password Reset Request for %appname%","reset_password_mail_body":"Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%","choose_password_link":"/apps/choose_password","password_updated_link":"/apps/password_reset_success.html","email_verification_link":"/apps/verify_email_success.html","invalid_link_link":"/apps/invalid_link.html","external_frame_link":null,"pricing_plan":{"base_price":0,"base_request_limit":30,"created_at":"2016-01-29T19:23:04Z","data_transfer_limit":2000,"file_storage_limit":20,"id":1178087,"max_file_size":20971520,"max_push_certificates":6,"mongo_limit":20,"parse_app_id":1218042,"push_limit":1000000,"request_limit":30,"updated_at":"2016-01-29T19:23:04Z"},"collaborators":[],"owner_email":"seiji_akiyama@live.com","owner_name":"seijiakiyama","urls":[{"platform":"other","url":"https://back4app.com"}],"auth_options_attributes":{"_enable_by_default":true,"username":{"enabled":true},"facebook":{"enabled":true},"twitter":{"enabled":true},"anonymous":{"enabled":true},"custom":{"enabled":true}},"gcm_credentials":[]}}
      this.setState({fields: newFields});
    });
    return promise;
  }

  render() {
    let child = React.Children.only(this.props.children);
    console.log('render this.state', this.state)
    return React.cloneElement(
      child,
      {
        ...child.props,
        initialFields: this.state.fields,
        saveChanges: this.saveChanges.bind(this)
      }
    );
  }
}

SettingsData.contextTypes = {
  currentApp: React.PropTypes.instanceOf(ParseApp)
};
