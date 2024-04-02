import React, { useState } from 'react';
import Field from 'components/Field/Field.react';
import Label from 'components/Label/Label.react';
import B4aModal from 'components/B4aModal/B4aModal.react'
import TextInput from 'components/TextInput/TextInput.react';

const HubDisconnectionDialog = ({ isDisconnecting, namespace, onCancel, onConfirm }) => {
  const [ namespaceInputVal, setNamespaceInputVal ] = useState('');
  return (
    <B4aModal
      type={B4aModal.Types.DANGER}
      disabled={namespace !== namespaceInputVal}
      title='Delete this connection'
      subtitle='This action cannot be undone'
      confirmText='Yes, delete'
      onConfirm={onConfirm}
      onCancel={onCancel}
      progress={isDisconnecting}>
      <Field
        labelWidth={48}
        label={<Label text='Confirm this action' description='Enter the database namespace in order to proceed' />}
        input={<TextInput dark={false} padding="0 1rem" placeholder='Input the connection namespace' value={namespaceInputVal} onChange={value => setNamespaceInputVal(value)} />} />
    </B4aModal>
  );
};

export default HubDisconnectionDialog;
