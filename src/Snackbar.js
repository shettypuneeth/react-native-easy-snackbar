// eslint-disable-next-line import/no-unresolved
import React, { useContext } from 'react';

import { SnackbarContext } from './SnackbarHost';
import SnackbarConsumer from './SnackbarConsumer';

const Snackbar = (props) => {
  const manager = useContext(SnackbarContext);
  return <SnackbarConsumer manager={manager}>{props.children}</SnackbarConsumer>;
};

export default Snackbar;
