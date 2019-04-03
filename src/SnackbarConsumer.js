// eslint-disable-next-line
import React, { useEffect, useRef } from 'react';

const SnackbarConsumer = (props) => {
  const didMount = useRef(false);
  const key = useRef();

  useEffect(() => {
    if (!didMount.current) {
      requestAnimationFrame(() => {
        key.current = props.manager.mount(props.children);
      });
    } else {
      if (!didMount.current) didMount.current = true;
      props.manager.update({ key: key.current, children: props.children });
    }
    return () => props.manager.unmount(key.current);
  });

  return null;
};

export default SnackbarConsumer;
