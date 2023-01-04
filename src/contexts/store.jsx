import React, { useReducer, useContext } from 'react';
import { initialState, reducer } from './state';

const Store = React.createContext(initialState)

const useStore = () => useContext(Store)

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>
}

export {useStore, StateProvider}