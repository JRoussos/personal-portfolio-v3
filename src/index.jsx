import React from 'react';
import ReactDOM from 'react-dom/client';

import { HelmetProvider } from 'react-helmet-async';
import { StateProvider } from '@contexts/store';

import App from './App';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <StateProvider>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </StateProvider>
    </React.StrictMode>
);
