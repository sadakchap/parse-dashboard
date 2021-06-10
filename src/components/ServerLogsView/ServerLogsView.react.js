/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import PropTypes from 'lib/PropTypes';
import React     from 'react';
import styles    from './ServerLogsView.scss';


const ServerLogsView = ({type, logs}) => {
    return (
      <div className={styles.content}>
        <h4 className={styles.title}>Server {type[0].toUpperCase() + type.slice(1)} Log:</h4>
        <div>
          <pre className={styles.prettyprint}>{logs}</pre>
        </div>
      </div>
    );    
}

export default ServerLogsView;