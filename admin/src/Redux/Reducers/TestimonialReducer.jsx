import { CREATE_TESTIMONIAL_RED, DELETE_TESTIMONIAL_RED, GET_TESTIMONIAL_RED, UPDATE_TESTIMONIAL_RED } from "../Constants"
export default function TestimonialReducer(state = [], action) {
    switch (action.type) {
        case CREATE_TESTIMONIAL_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_TESTIMONIAL_RED:
            return action.payload

        case UPDATE_TESTIMONIAL_RED:
            return state.map(x =>
                x._id === action.payload._id ? { ...x, ...action.payload } : x
            )

        case DELETE_TESTIMONIAL_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}