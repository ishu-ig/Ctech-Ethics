import { CREATE_PLACEMENT_RED, DELETE_PLACEMENT_RED, GET_PLACEMENT_RED, UPDATE_PLACEMENT_RED } from "../Constants"
export default function PlacementReducer(state=[], action) {
    switch (action.type) {
        case CREATE_PLACEMENT_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_PLACEMENT_RED:
            return action.payload

        case UPDATE_PLACEMENT_RED:
    return state.map(item =>
        item._id === action.payload._id
            ? action.payload
            : item
    )

        case DELETE_PLACEMENT_RED:
            console.log("Delete Called")
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
