/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Popover      from 'components/Popover/Popover.react';
import Icon         from 'components/Icon/Icon.react';
import Position     from 'lib/Position';
import PropTypes    from 'lib/PropTypes';
import React        from 'react';
import ReactDOM     from 'react-dom';
import styles       from 'components/BrowserMenu/BrowserMenu.scss';

export default class SubMenuItem extends React.Component {
  constructor() {
    super();

    this.state = { open: false };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
  }

  toggle() {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
      this.props.setCurrent(null);
    }
  }

  render() {    
    const classes = [styles.item, styles.rightArrowIcon];
    if (this.state.open) {
      classes.push(styles.active);
    }
    if (this.props.disabled) {
      classes.push(styles.disabled);
    }

    return (
      <div>
        <div className={classes.join(' ')} onClick={this.toggle} title={this.props.title}>
          {this.props.title}
          {this.state.open ? (
            <div onClick={(e) => e.stopPropagation()}>
              <div
                className={styles.subMenuBody}
                style={{ minWidth: this.node ? this.node.clientWidth : '0', left: this.node ? `-${this.node.clientWidth + 2}px` : '-196px' }}
              >
                {React.Children.map(this.props.children, (child) =>
                  React.cloneElement(child, {
                    ...child.props,
                    onClick: () => {
                      child.props.onClick();
                    },
                  })
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

SubMenuItem.propTypes = {
  title: PropTypes.string.isRequired.describe(
    'The title text of the menu.'
  ),
  children: PropTypes.arrayOf(PropTypes.node).describe(
    'The contents of the menu when open. It should be a set of MenuItem and Separator components.'
  ),
};
