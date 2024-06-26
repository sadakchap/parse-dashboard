/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Popover from 'components/Popover/Popover.react';
import Icon from 'components/Icon/Icon.react';
import Position from 'lib/Position';
import PropTypes from 'lib/PropTypes';
import React from 'react';
import styles from 'components/BrowserMenu/BrowserMenu.scss';

export default class BrowserMenu extends React.Component {
  constructor() {
    super();

    this.state = { open: false };
    this.wrapRef = React.createRef();
  }

  render() {
    let menu = null;
    if (this.state.open) {
      const position = Position.inDocument(this.wrapRef.current);
      const titleStyle = [styles.title];
      // if (this.props.active) {
      //   titleStyle.push(styles.active);
      // }
      menu = (
        <Popover
          fixed={true}
          position={position}
          onExternalClick={() => this.setState({ open: false })}
        >
          <div className={styles.menu}>
            <div className={titleStyle.join(' ')} onClick={() => this.setState({ open: false })}>
              <Icon name={this.props.icon} width={35} height={24} />
              {/* <span>{this.props.title}</span> */}
            </div>
            <div className={styles.body} style={{ minWidth: this.wrapRef.current.clientWidth }}>
              {React.Children.map(this.props.children, child =>
                React.cloneElement(child, {
                  ...child.props,
                  onClick: () => {
                    this.setState({ open: false });
                    child.props.onClick();
                  },
                  onClose: () => this.setState({ open: false }), 
                })
              )}
            </div>
          </div>
        </Popover>
      );
    }
    const classes = [styles.entry];
    if (this.props.active && !this.state.open) {
      classes.push(styles.active);
    }
    if (this.props.disabled) {
      classes.push(styles.disabled);
    }
    let onClick = null;
    if (!this.props.disabled) {
      onClick = () => {
        this.setState({ open: true });
        this.props.setCurrent(null);
      };
    }
    return (
      <div className={styles.wrap} ref={this.wrapRef}>
        <div className={classes.join(' ')} onClick={onClick} title={this.props.title}>
          <Icon name={this.props.icon} width={35} height={24} />
          {/* <span>{this.props.title}</span> */}
        </div>
        {menu}
      </div>
    );
  }
}

BrowserMenu.propTypes = {
  icon: PropTypes.string.isRequired.describe('The name of the icon to place in the menu.'),
  title: PropTypes.string.isRequired.describe('The title text of the menu.'),
  children: PropTypes.arrayOf(PropTypes.node).describe(
    'The contents of the menu when open. It should be a set of MenuItem and Separator components.'
  ),
  active: PropTypes.bool.describe(
    'Indicates whether it has any active item or not.'
  ),
};
