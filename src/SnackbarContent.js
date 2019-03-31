// eslint-disable-next-line import/no-unresolved
import React, { useState, userRef } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const FLOW_STATE = {
  idle: '__idle__',
  measuring: '__measuring__',
  measured: '__measured__'
};

// eslint-disable-next-line no-underscore-dangle
let _animation = null;

const SnackbarContent = (props) => {
  const [flowState, setFlowState] = useState(FLOW_STATE.idle);
  const [animating, setAnimating] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [height] = useState(new Animated.Value(0));
  const contentHandle = userRef();

  const {
    children, show, style, enablePointerEvents
  } = props;

  const measureContent = (callback) => {
    // way to wait for the state change to be applied before subsequent statements are executed?
    setFlowState(FLOW_STATE.measuring);

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      if (!contentHandle.current) {
        setFlowState(FLOW_STATE.idle);
        callback(0);
      } else {
        this.contentHandle.getNode().measure((x, y, width, measuredHeight) => {
          setFlowState(FLOW_STATE.measured);
          setContentHeight(measuredHeight);
          callback(measuredHeight);
        });
      }
    });
  };

  const transitionToHeight = (targetHeight) => {
    const { duration } = props;
    if (_animation) _animation.stop();
    setAnimating(true);

    _animation = Animated.timing(height, {
      toValue: targetHeight,
      duration
    }).start(() => {
      setAnimating(false);
    });
  };

  const toggleShow = (showSnackbar) => {
    if (!showSnackbar) {
      transitionToHeight(0);
    } else if (!contentHandle.current) {
      if (flowState === FLOW_STATE.measured) {
        transitionToHeight(contentHandle);
      }
    } else {
      measureContent((measuredHeight) => {
        transitionToHeight(measuredHeight);
      });
    }
  };

  const handleLayoutChange = (event) => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (
      animating
      || flowState === FLOW_STATE.measuring
      || !show
      || measuredHeight === contentHeight
    ) return;

    height.setValue(measuredHeight);
    setContentHeight(measuredHeight);
  };

  if (!show) return null;

  const hasKnownHeight = flowState === FLOW_STATE.measured;
  const containerStyle = hasKnownHeight && { overflow: 'hidden', height };

  const contentStyle = {};
  if (flowState === FLOW_STATE.measuring) {
    contentStyle.position = 'absolute';
    contentStyle.opacity = 0;
  } else {
    contentStyle.transform = [
      {
        transformY: height.interpolate({
          inputRange: [0, contentHeight],
          outputRange: [-contentHeight, 0]
        })
      }
    ];
  }

  return (
    <Animated.View pointerEvents={!enablePointerEvents ? 'none' : 'auto'} style={containerStyle}>
      <Animated.View
        onLayout={animating ? undefined : handleLayoutChange}
        ref={contentHandle}
        style={[style, contentStyle]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

SnackbarContent.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  enablePointerEvents: PropTypes.bool,
  show: PropTypes.bool.isRequired
};
SnackbarContent.defaultProps = {
  duration: 300,
  enablePointerEvents: false
};

export default SnackbarContent;
