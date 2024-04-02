/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import PropTypes from 'lib/PropTypes';
import React from 'react';
import ReactDOM from 'react-dom';
import styles from 'components/BrowserMenu/B4aBrowserMenu.scss';
import Popover from 'components/Popover/Popover.react';
import Position from 'lib/Position';

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
    if (this.state.open && this.props.disabled) {
      classes.push(styles.open);
    }
    if (this.props.active) {
      classes.push(styles.active);
    }
    if (this.props.disabled) {
      classes.push(styles.disabled);
    }

    let popover = null;
    if (this.state.open) {
      const position = Position.inDocument(this.node);
      position.x -= this.node ? (this.node.clientWidth + 1) : 196;
      position.x += 14; // padding
      popover = (
        <Popover
          fixed={true}
          position={position}
          parentContentId={this.props.parentContentId}
        >
          <div
            className={styles.subMenuBody}
            style={{
              minWidth: this.node ? this.node.clientWidth : '0'
            }}
          >
            {React.Children.map(this.props.children, (child) =>
              React.cloneElement(child, {
                ...child.props,
                onClick: (e) => {
                  e.stopPropagation();
                  this.setState({ open: false }); // close submenu
                  this.props.onClose(); // close top menu
                  child.props.onClick();
                },
              })
            )}
          </div>
        </Popover>
      )
    } else {
      popover = null;
    }

    return (
      <div>
        <div
          className={classes.join(' ')}
          onMouseEnter={() => this.setState({ open: true })}
          onMouseLeave={() => this.setState({ open: false })}
          // onClick={this.toggle}
          title={this.props.title}
        >
          {this.props.title}
          {popover}
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
