import { CREATE_TECHSTACK_RED, DELETE_TECHSTACK_RED, GET_TECHSTACK_RED, UPDATE_TECHSTACK_RED } from "../Constants"
export default function TechStackReducer(state = [], action) {
    switch (action.type) {
        case CREATE_TECHSTACK_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_TECHSTACK_RED:
            return action.payload

        case UPDATE_TECHSTACK_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            )

        case DELETE_TECHSTACK_RED:
            console.log("Delete Called")
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
