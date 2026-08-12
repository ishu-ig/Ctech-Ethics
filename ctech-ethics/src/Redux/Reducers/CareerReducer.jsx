import { CREATE_CAREER_RED, DELETE_CAREER_RED, GET_CAREER_RED, UPDATE_CAREER_RED } from "../Constants"
export default function CareerReducer(state=[], action) {
    switch (action.type) {
        case CREATE_CAREER_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_CAREER_RED:
            return action.payload

        case UPDATE_CAREER_RED:
    return state.map(item =>
        item._id === action.payload._id
            ? action.payload
            : item
    )

        case DELETE_CAREER_RED:
            console.log("Delete Called")
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
