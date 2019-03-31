/**
 * TransitionGroup component borrowed from 'react-transition-group
 * https://github.com/reactjs/react-transition-group/blob/master/src/TransitionGroup.js
 */

/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import React from 'react';

import { getChildMapping, getInitialChildMapping, getNextChildMapping } from './utils';

const values = Object.values || (obj => Object.keys(obj).map(k => obj[k]));
class TransitionGroup extends React.Component {
  constructor(props, context) {
    super(props, context);
    const handleExited = this.handleExited.bind(this);

    // Initial children should all be entering, dependent on appear
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

  handleExited(child, node) {
    const currentChildMapping = getChildMapping(this.props.children);

    if (child.key in currentChildMapping) return;

    if (child.props.onExited) {
      child.props.onExited(node);
    }

    if (this.mounted) {
      this.setState((state) => {
        const children = { ...state.children };

        delete children[child.key];
        return { children };
      });
    }
  }

  render() {
    const { component: Component, childFactory, ...props } = this.props;
    const children = values(this.state.children).map(childFactory);

    delete props.appear;
    delete props.enter;
    delete props.exit;

    if (Component === null) {
      return children;
    }
    return <Component {...props}>{children}</Component>;
  }
}

TransitionGroup.propTypes = {
  /**
   * `<TransitionGroup>` renders a `<div>` by default. You can change this
   * behavior by providing a `component` prop.
   * If you use React v16+ and would like to avoid a wrapping `<div>` element
   * you can pass in `component={null}`. This is useful if the wrapping div
   * borks your css styles.
   */
  component: PropTypes.any,
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
  children: PropTypes.node,

  /**
   * A convenience prop that enables or disables appear animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  appear: PropTypes.bool,
  /**
   * A convenience prop that enables or disables enter animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  enter: PropTypes.bool,
  /**
   * A convenience prop that enables or disables exit animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  exit: PropTypes.bool,

  /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */
  childFactory: PropTypes.func
};

export default TransitionGroup;
