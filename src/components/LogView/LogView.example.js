/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import LogViewEntry from 'components/LogView/LogViewEntry.react';
import LogView from 'components/LogView/LogView.react';

export const component = LogView;

export const demos = [
  {
    render() {
      const type = {
        info: 'info',
        error: 'error'
      }

      const logs = [
        {
          text: `Deployed v1 with triggers:
            Item:
              before_save
              after_save
            OtherItem:
              before_delete
              after_delete
            Cloud Functions:
              functionName
              anotherFunction
              WillError`,
          timestamp: '2015-09-30T00:25:26.950Z',
          type: type.info
        },
        {
          text: `v2 before_save triggered for Item:
            Input: {"original":null,"update":{"name":"i"}}
            Result: Update changed to {"name":"i","count":12}`,
          timestamp: '2015-09-30T00:35:42.336Z',
          type: type.info
        },
        {
          text: `v4 Ran cloud function doSomething with:
            Input: {}
            Result: {}`,
          timestamp: '2015-10-06T22:39:11.029Z',
          type: type.info
        },
        {
          text: `ParseError { code: 141, message: 'Function not found.' }`,
          timestamp: '2019-05-23T16:25:27.123Z',
          type: type.error
        },
      ];

      return (
        <LogView>
          {logs.map(({text, timestamp, type}) => <LogViewEntry text={text} timestamp={timestamp} type={type} />)}
        </LogView>
      );
    }
  }
];
