import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'react-toast-notifications';

const queryClient = new QueryClient();
ReactDOM.render(<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ToastProvider autoDismissTimeout={2000}>

    <App />
    </ToastProvider>
  </QueryClientProvider>
</React.StrictMode>, document.getElementById('root'));

