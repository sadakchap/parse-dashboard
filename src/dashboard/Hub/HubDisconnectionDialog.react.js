import React, { useState } from 'react';
import Field from 'components/Field/Field.react';
import Label from 'components/Label/Label.react';
import Modal from 'components/Modal/Modal.react'
import TextInput from 'components/TextInput/TextInput.react';

const HubDisconnectionDialog = ({ isDisconnecting, namespace, onCancel, onConfirm }) => {
  const [ namespaceInputVal, setNamespaceInputVal ] = useState('');
  return (
    <Modal
      type={Modal.Types.DANGER}
      disabled={namespace !== namespaceInputVal}
      title='Delete this connection'
      subtitle='This action cannot be undone'
      confirmText='Yes, delete'
      onConfirm={onConfirm}
      onCancel={onCancel}
      progress={isDisconnecting}>
        <Field
          labelWidth={35}
          label={<Label text='Confirm this action' description='Enter the database namespace in order to proceed' />}
          input={<TextInput placeholder='Input the connection namespace' value={namespaceInputVal} onChange={value => setNamespaceInputVal(value)} />} />
    </Modal>
  );
};

export default HubDisconnectionDialog;
