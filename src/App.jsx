import React from "react";
import { BrowserRouter } from "react-router-dom";

import Loading from './components/loading/loading'
import Switch from './routes/switch';

const App = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Loading>
                <Switch/>
            </Loading>
        </BrowserRouter>
    );
}

export default App;
