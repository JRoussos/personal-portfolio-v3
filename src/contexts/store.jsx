import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialState, reducer } from './state'

const StoreContext = createContext(null)

export const useStore = () => {
    const context = useContext(StoreContext)

    if (!context) {
        throw new Error('useStore must be used within a StateProvider')
    }

    return context
}

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = useMemo(() => ({ state, dispatch }), [state])

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}
