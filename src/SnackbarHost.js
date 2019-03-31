// eslint-disable-next-line import/no-unresolved
import React, { useRef } from 'react';
// eslint-disable-next-line import/no-unresolved
import { StyleSheet, View } from 'react-native';

import SnackbarManager from './SnackbarManager';

export const SnackbarContext = React.createContext();

let nextKey = 0;
const queue = [];

const SnackbarHost = (props) => {
  const manager = useRef(null);

  const mount = (children) => {
    const key = nextKey++;
    if (manager) {
      manager.mount({ key, children });
    } else {
      queue.push({ type: 'mount', key, children });
    }
    return key;
  };

  const update = (key, children) => {
    if (manager) {
      manager.update({ key, children });
    } else {
      const op = { type: 'mount', key, children };
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
    if (manager) {
      manager.unmount({ key });
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
