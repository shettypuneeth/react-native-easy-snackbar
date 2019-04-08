// eslint-disable-next-line import/no-unresolved
import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const FLOW_STATE = {
  idle: '__idle__',
  measuring: '__measuring__',
  measured: '__measured__'
};

const SnackbarContent = (props) => {
  const [flowState, setFlowState] = useState(FLOW_STATE.idle);
  const [animating, setAnimating] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [height] = useState(new Animated.Value(0));
  const contentHandle = useRef(null);
  const isMounted = useRef(false);

  const {
    children, show, style, enablePointerEvents
  } = props;

  const measureContent = (callback) => {
    // way to wait for the state change to be applied before subsequent statements are executed?
    setFlowState(FLOW_STATE.measuring);

    requestAnimationFrame(() => {
      if (!contentHandle.current) {
        setFlowState(FLOW_STATE.idle);
        callback(0);
      } else {
        contentHandle.current.getNode().measure((x, y, width, measuredHeight) => {
          setFlowState(FLOW_STATE.measured);
          setContentHeight(measuredHeight);
          callback(measuredHeight);
        });
      }
    });
  };

  const transitionToHeight = (targetHeight, callback) => {
    if (!isMounted.current) return;
    const { duration } = props;
    setAnimating(true);

    Animated.timing(height, {
      toValue: targetHeight,
      duration
    }).start(() => {
      setAnimating(false);
      if (callback) {
        callback();
      }
    });
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

  const performEnter = () => {
    if (!isMounted.current) return;
    if (!contentHandle.current) {
      if (flowState === FLOW_STATE.measured) {
        transitionToHeight(contentHeight);
      }
    } else {
      measureContent((measuredHeight) => {
        transitionToHeight(measuredHeight);
      });
    }
  };

  const performExit = () => {
    if (!isMounted.current) return;
    transitionToHeight(0, props.onExited);
  };

  useEffect(() => {
    if (!isMounted.current) isMounted.current = true;

    if (props.show) {
      performEnter();
    } else {
      performExit();
    }
    return () => {
      isMounted.current = false;
    };
  }, [show]);

  const hasKnownHeight = flowState === FLOW_STATE.measured;
  const containerStyle = hasKnownHeight && { overflow: 'hidden', height };

  const contentStyle = {};
  if (flowState === FLOW_STATE.measuring) {
    contentStyle.position = 'absolute';
    contentStyle.opacity = 0;
  } else {
    contentStyle.transform = [
      {
        translateY: height.interpolate({
          inputRange: [0, contentHeight],
          outputRange: [contentHeight, 0]
        })
      }
    ];
  }

  return (
    <Animated.View
      pointerEvents={!enablePointerEvents ? 'none' : 'auto'}
      style={[styles.container, containerStyle]}
    >
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 0,
    left: 0,
    bottom: 0,
    width: '100%'
  }
});

SnackbarContent.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  enablePointerEvents: PropTypes.bool,
  onExited: PropTypes.func,
  show: PropTypes.bool
};
SnackbarContent.defaultProps = {
  duration: 300,
  enablePointerEvents: false
};

export default SnackbarContent;
