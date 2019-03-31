// eslint-disable-next-line
import React, { useEffect, useRef } from 'react';

const SnackbarConsumer = (props) => {
  const didMount = useRef(false);
  const key = useRef();

  useEffect(() => {
    if (didMount.current) {
      requestAnimationFrame(() => {
        key.current = props.manager.mount(props.children);
      });
    } else {
      props.manager.update({ key: key.current, children: props.children });
    }
    return () => props.manager.unmount({ key: key.current, children: props.children });
  });

  return null;
};

export default SnackbarConsumer;
