// eslint-disable-next-line import/no-unresolved
import React from 'react';

import TransitionGroup from './TransitionGroup';
import SnackbarContent from './SnackbarContent';

export default class SnackbarManager extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { snackbars: [] };
    this.mount = this.mount.bind(this);
    this.update = this.update.bind(this);
    this.unmount = this.unmount.bind(this);
  }

  mount(key, children) {
    this.setState(state => ({
      snackbars: [...state.snackbars, { key, children }]
    }));
  }

  update(key, children) {
    this.setState(state => ({
      snackbars: state.snackbars.map((item) => {
        if (item.key === key) {
          return { ...item, children };
        }
        return item;
      })
    }));
  }

  unmount(key) {
    this.setState(state => ({
      snackbars: state.snackbars.filter(item => item.key !== key)
    }));
  }

  render() {
    return (
      <TransitionGroup>
        {this.state.snackbars.map(({ key, children }) => (
          <SnackbarContent key={key}>{children}</SnackbarContent>
        ))}
      </TransitionGroup>
    );
  }
}
