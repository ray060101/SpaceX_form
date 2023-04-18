import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';

import client from './client';
import Launches from './launches';

ReactDOM.render(
  <ApolloProvider client={client}>
    <Launches />
  </ApolloProvider>,
  document.getElementById('root')
)