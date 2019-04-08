/**
 * TransitionGroup component borrowed from 'react-transition-group
 * https://github.com/reactjs/react-transition-group/blob/master/src/TransitionGroup.js
 */

import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import React from 'react';

import { getChildMapping, getInitialChildMapping, getNextChildMapping } from './utils';

const values = Object.values || (obj => Object.keys(obj).map(k => obj[k]));
class TransitionGroup extends React.Component {
  constructor(props, context) {
    super(props, context);
    const handleExited = this.handleExited.bind(this);

    this.state = { handleExited, firstRender: true };
  }

  componentDidMount() {
    this.appeared = true;
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { children: prevChildMapping, handleExited, firstRender } = state;
    return {
      children: firstRender
        ? getInitialChildMapping(nextProps, handleExited)
        : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  }

  handleExited(child) {
    const currentChildMapping = getChildMapping(this.props.children);

    if (child.key in currentChildMapping) return;

    if (this.mounted) {
      this.setState((state) => {
        const children = { ...state.children };

        delete children[child.key];
        return { children };
      });
    }
  }

  render() {
    const children = values(this.state.children);

    return <React.Fragment>{children}</React.Fragment>;
  }
}

TransitionGroup.propTypes = {
  /**
   * A set of `<Transition>` components, that are toggled `in` and out as they
   * leave. the `<TransitionGroup>` will inject specific transition props, so
   * remember to spread them through if you are wrapping the `<Transition>` as
   * with our `<Fade>` example.
   *
   * While this component is meant for multiple `Transition` or `CSSTransition`
   * children, sometimes you may want to have a single transition child with
   * content that you want to be transitioned out and in when you change it
   * (e.g. routes, images etc.) In that case you can change the `key` prop of
   * the transition child as you change its content, this will cause
   * `TransitionGroup` to transition the child out and back in.
   */
  children: PropTypes.node
};

export default TransitionGroup;
