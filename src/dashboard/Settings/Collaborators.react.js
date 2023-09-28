/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import AccountManager from 'lib/AccountManager';
import Field from 'components/Field/Field.react';
import Fieldset from 'components/Fieldset/Fieldset.react';
import FormTableCollab from 'components/FormTableCollab/FormTableCollab.react';
import FormNote from 'components/FormNote/FormNote.react';
import InlineSubmitInput from 'components/InlineSubmitInput/InlineSubmitInput.react';
import Label from 'components/Label/Label.react';
import PropTypes from 'lib/PropTypes';
import React from 'react';
import TextInput from 'components/TextInput/TextInput.react';
import validateEmailFormat from 'lib/validateEmailFormat';
import { CurrentApp } from 'context/currentApp';
import PermissionsCollaboratorDialog from 'components/PermissionsCollaboratorDialog/PermissionsCollaboratorDialog.react';
import Swal                from 'sweetalert2'

import lodash from 'lodash'

// Component for displaying and modifying an app's collaborator emails.
// There is a single input field for new collaborator emails. As soon as the
// user types a valid email format (and not already existing collaborator), we
// will show an ADD button. When the user clicks the ADD button, we make a call
// to the server to check that the email is a valid Parse account. If so, then
// we'll invoke the onAdd handler of this component. Please note that this
// component does NOT actually add the collaborator to your app on the server;
// the parent component is responsible for doing that when onAdd is invoked.
// The parent also is responsible for passing onRemove, which is called when the
// users removes a collaborator.
export default class Collaborators extends React.Component {
  static contextType = CurrentApp;
  constructor() {
    super();

    const defaultFeaturesPermissions = {
      "coreSettings" : "Read",
      "manageParseServer" : "Read",
      "logs" : "Read",
      "cloudCode" : "Write",
      "jobs" : "Write",
      "webHostLiveQuery" : "Write",
      "verificationEmails" : "Write",
      "oauth" : "Write",
      "twitterOauth" : "Write",
      "pushAndroidSettings" : "Write",
      "pushIOSSettings" : "Write"
    }

    this.defaultFeaturesPermissions = defaultFeaturesPermissions
    this.validateEmail = this.validateEmail.bind(this)

    this.state = {
      lastError: '',
      currentEmail: '',
      currentPermission: {},
      currentCollab: {},
      showDialog: false,
      toAdd: false,
      toEdit: false,
      waiting_collaborators: '',
      editInvitePermission: '',
      lastSuccess: '',
      currentEmailInput: '',
      inviteCollab: false,
      showBtnCollaborator: false
    };
  }

  getDefaultClasses() {
    return this.context.currentApp.classCounts &&
      this.context.currentApp.classCounts.counts &&
      lodash.mapValues(this.context.currentApp.classCounts.counts, () => 'Write' )
  }

  handleAdd() {
    //TODO: Show some in-progress thing while the collaborator is being validated, or maybe have some sort of
    //async validator in the parent form. Currently if you mash the add button, they same collaborator gets added many times.
    return this.context
      .validateCollaborator(newEmail)
      .then(response => {
        // lastError logic assumes we only have 1 input field
        if (response.success) {
          const newCollaborators = this.props.collaborators.concat({
            userEmail: newEmail,
          });
          this.setState({ lastError: '' });
          this.props.onAdd(newEmail, newCollaborators);
          return true;
        } else if (response.error) {
          this.setState({ lastError: response.error });
          return false;
        }
      })
      .catch(({ error }) => {
        this.setState({ lastError: error });
      });
  }

  handleDelete(collaborator) {
    const newCollaborators = this.props.collaborators.filter(
      oldCollaborator => oldCollaborator.userEmail !== collaborator.userEmail
    );
    Swal.mixin().queue([
      {
        html: `<p style="text-align: center; margin-bottom: 16px;">Are you sure you want to remove <span style="font-weight: bold; color: #169cee">${collaborator.userEmail}</span> as a collaborator.</p>`,
        type: "warning",
        confirmButtonText: "Delete",
        confirmButtonColor: "#ff395e",
        showCancelButton: true,
        reverseButtons: true,
        preConfirm: () => {
          this.props.onRemove(collaborator, newCollaborators);
          Swal.close();
        }
      }
    ]);
  }

  handleEdit(collaborator) {
    this.setState(
      {
        toEdit: true,
        currentFeaturesPermissions: collaborator.featuresPermission,
        currentClassesPermissions: collaborator.classesPermission || this.getDefaultClasses(),
        currentEmailInput: collaborator.userEmail,
        currentCollab: collaborator,
        showDialog: true
      }
    )
  }

  validateEmail(email) {
    // We allow mixed-case emails for Parse accounts
    let collabs = this.props.collaborators;
    let waitCollabs = this.state.waiting_collaborators;
    let allEmails = collabs.concat(waitCollabs);
    // We allow mixed-case emails for Parse accounts
    const isExistingCollaborator = !!allEmails.find(
      collab => email.toLowerCase() === collab.userEmail.toLowerCase()
    );
    return (
      validateEmailFormat(email) &&
      !isExistingCollaborator &&
      AccountManager.currentUser().email.toLowerCase() !== email.toLowerCase()
    );
  }

  setCollabPermissions() {
    return (
      <PermissionsCollaboratorDialog
        role='User'
        email={this.state.currentEmail || this.state.currentEmailInput }
        description='Configure how this user can access the App features.'
        advanced={false}
        confirmText='Save'
        isGDPR={this.context.currentApp.custom && this.context.currentApp.custom.isGDPR}
        customFeaturesPermissions={
          (
            (this.state.toEdit || this.state.editInvitePermission && this.state.currentFeaturesPermissions) ?
              this.state.currentFeaturesPermissions : this.defaultFeaturesPermissions
          )
        }
        defaultFeaturesPermissions={this.defaultFeaturesPermissions}
        features={{
          label: [
            'Core Settings',
            'Manage Parse Server',
            'Logs',
            'Cloud Code',
            'Background Jobs',
            'Web Hosting and Live Query',
            'Verification Emails',
            'Facebook Login',
            'Twitter Login',
            'Android Push notification',
            'iOS Push notification'
          ],
          description: [
            'Edit your keys, delete, transfer, clone and restart your app',
            'Change the Parse Server version',
            'See server, accesses and cloud code logs',
            'Deploy your own JavaScript functions',
            'Schedule and run background jobs',
            'Host your web-site without all the hassle\nBuild real time apps',
            'Send automatic emails',
            'Make your app social using Facebook',
            'Make your app social using Twitter',
            'Get your message across with Android push',
            'Get your message across with iOS push'
          ],
          collaboratorsCanWrite: [
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }}
        classesPermissions={this.state.currentClassesPermissions ? this.state.currentClassesPermissions : this.getDefaultClasses()}
        onCancel={() => {
          this.setState({
            showDialog: false
          });
        }}
        onConfirm={(featuresPermission, classesPermission) => {
          if (this.state.toAdd) {
            let newCollaborators = this.props.collaborators.concat(
              { userEmail: this.state.currentEmail || this.state.currentEmailInput, featuresPermission, classesPermission })
            this.props.onAdd(this.state.currentEmail || this.state.currentEmailInput, newCollaborators);
            this.setState(
              {
                lastError: '',
                showDialog: false,
                toAdd: false,
                currentEmail: ''
              }
            );
          }
          else if (this.state.toEdit) {
            let editedCollab = Object.assign({}, this.state.currentCollab);
            let newCollabs = []

            editedCollab.featuresPermission = featuresPermission;
            editedCollab.classesPermission = classesPermission;
            editedCollab.isEdited = true;
            this.props.collaborators.forEach(c => {
              if (c.userEmail === editedCollab.userEmail) c = editedCollab
              newCollabs.push(c)
            })
            this.props.onEdit(editedCollab, newCollabs);
            this.setState(
              {
                lastError: '',
                showDialog: false,
                toEdit: false,
                currentCollab: {}
              }
            );
          }
          else if (this.state.inviteCollab){
            this.sendInvite(featuresPermission, classesPermission, this.props.owner_email);
          }
          else if (this.state.editInvitePermission){
            this.editInvite(featuresPermission, classesPermission)
          }
        }} />
    )
  }

  addCollaboratorField() {
    return (
      <Fieldset legend={this.props.legend} description={this.props.description}>
        {this.props.viewer_email === this.props.owner_email ? (
          <Field
            labelWidth={62}
            label={
              <Label
                text="Add new collaborator"
                description={
                  <span>
                    Collaborators will have read/write access but cannot <br /> delete the app or
                    add more collaborators.
                  </span>
                }
              />
            }
            input={
              <InlineSubmitInput
                validate={email => this.validateEmail(email)}
                placeholder="What&#39;s their email?"
                onSubmit={this.handleAdd.bind(this)}
                submitButtonText="ADD"
              />
            }
          />
        ) : (
          <Field
            labelWidth={62}
            label={<Label text="App Owner" />}
            input={<TextInput value={this.props.owner_email} onChange={() => {}} disabled={true} />}
          />
        )}
        {this.state.lastError !== '' ? (
          <FormNote show={true} color={'red'}>
            <div>{this.state.lastError}</div>
          </FormNote>
        ) : null}
        {this.props.collaborators.length > 0 ? (
          <Field
            label={<Label text="Existing collaborators" />}
            labelWidth={62}
            input={
              <FormTable
                items={this.props.collaborators.map(collaborator => {
                  const canDelete =
                    this.props.viewer_email === this.props.owner_email ||
                    collaborator.userEmail === this.props.viewer_email;
                  //TODO(drewgross): add a warning modal for when you are removing yourself as a collaborator, as that is irreversable
                  return {
                    title: collaborator.userName || collaborator.userEmail,
                    color: 'green',
                    onDelete: canDelete ? this.handleDelete.bind(this, collaborator) : undefined,
                    notes: [
                      {
                        key: 'Email',
                        value: collaborator.userEmail,
                      },
                    ],
                  };
                })}
              />
            }
          />
        ) : null}
      </Fieldset>
    );
  }
}

Collaborators.propTypes = {
  legend: PropTypes.string.isRequired.describe('Title of this section'),
  description: PropTypes.string.isRequired.describe(
    'Description fo this section (shows below title)'
  ),
  collaborators: PropTypes.arrayOf(PropTypes.any).isRequired.describe(
    'An array of current collaborators of this app'
  ),
  owner_email: PropTypes.string.describe(
    'The email of the owner, to be displayed if the viewer is a collaborator.'
  ),
  viewer_email: PropTypes.string.describe(
    'The email of the viewer, if the viewer is a collaborator, they will not be able to remove collaborators except themselves.'
  ),
  onAdd: PropTypes.func.isRequired.describe(
    'A function that will be called whenever a user adds a valid collaborator email. It receives the new email and an updated array of all collaborators for this app.'
  ),
  onRemove: PropTypes.func.isRequired.describe(
    'A function that will be called whenever a user removes a valid collaborator email. It receives the removed email and an updated array of all collaborators for this app.'
  ),
};
