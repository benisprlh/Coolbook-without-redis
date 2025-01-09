import { ApolloProvider } from '@apollo/client';
import client from './config/apollo';
import { LoginProvider } from './context/loginContext';
import MainStack from './pages/mainStack';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <MainStack />
      </LoginProvider>
    </ApolloProvider>
  );
}
