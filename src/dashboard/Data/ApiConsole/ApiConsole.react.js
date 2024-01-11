/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import React from 'react';
import CategoryList from 'components/CategoryList/CategoryList.react';
import DashboardView from 'dashboard/DashboardView.react';

export default class ApiConsole extends DashboardView {
  constructor() {
    super();
    this.section = 'API';
    this.subsection = 'Console';
  }

  renderSidebar() {
    const { path } = this.props.match;
    const current = path.substr(path.lastIndexOf('/') + 1, path.length - 1);
    return (
      <CategoryList
        current={current}
        linkPrefix={'api_console/'}
        categories={[
          { name: 'REST', id: 'rest' },
          { name: 'GraphQL', id: 'graphql' },
          { name: 'Javascript', id: 'js_console' }
        ]}
      />
    );
  }

  renderContent() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, { ...child.props });
  }
}
