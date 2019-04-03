// eslint-disable-next-line import/no-unresolved
import React, { useContext } from 'react';

import SnackbarHost, { SnackbarContext } from './SnackbarHost';
import SnackbarConsumer from './SnackbarConsumer';

const Snackbar = (props) => {
  const manager = useContext(SnackbarContext);
  return <SnackbarConsumer manager={manager}>{props.children}</SnackbarConsumer>;
};

Snackbar.Host = SnackbarHost;

export default Snackbar;
