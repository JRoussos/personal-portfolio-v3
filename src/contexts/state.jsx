const initialState = {
    canvasReady: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CANVAS_LOADED':
            return { ...state, canvasReady: action.canvasReady }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export { initialState, reducer }
