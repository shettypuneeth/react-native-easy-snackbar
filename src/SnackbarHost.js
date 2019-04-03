// eslint-disable-next-line import/no-unresolved
import React, { useRef, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { StyleSheet, View } from 'react-native';

import SnackbarManager from './SnackbarManager';

export const SnackbarContext = React.createContext();

let nextKey = 0;
const queue = [];

const SnackbarHost = (props) => {
  const manager = useRef(null);

  useEffect(() => {
    while (queue.length && manager.current) {
      const action = queue.pop();
      const { key, type, children } = action;

      // eslint-disable-next-line default-case
      switch (type) {
        case 'mount':
          manager.current.mount({ key, children });
          break;
        case 'update':
          manager.current.update({ key, children });
          break;
        case 'unmount':
          manager.current.unmount(key);
          break;
      }
    }
  }, []);

  const mount = (children) => {
    const key = nextKey++;
    if (manager.current) {
      manager.current.mount({ key, children });
    } else {
      queue.push({ type: 'mount', key, children });
    }
    return key;
  };

  const update = ({ key, children }) => {
    if (manager.current) {
      manager.current.update({ key, children });
    } else {
      const op = { type: 'update', key, children };
      const index = queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );
      if (index > -1) {
        queue[index] = op;
      } else {
        queue.push(op);
      }
    }
  };

  const unmount = (key) => {
    if (manager.current) {
      manager.current.unmount(key);
    } else {
      queue.push({ type: 'unmount', key });
    }
  };

  return (
    <SnackbarContext.Provider value={{ mount, update, unmount }}>
      <View style={styles.container} collapsable={false}>
        {props.children}
      </View>
      <SnackbarManager ref={manager} />
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SnackbarHost;
