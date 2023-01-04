import React from 'react';
import ReactDOM from 'react-dom/client';

import { StateProvider } from './contexts/store';
// import { isMobile } from 'react-device-detect';
// import Mouse from './components/mouse/mouse'

import App from './App';

import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <StateProvider>
            {/* <Mouse isMobile={isMobile}/> */}
            <App />
        </StateProvider>
    </React.StrictMode>
);
