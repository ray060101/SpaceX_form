import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({//開心抓資料
  uri: 'https://spacex-production.up.railway.app/',
  cache: new InMemoryCache(),
});
export default client;