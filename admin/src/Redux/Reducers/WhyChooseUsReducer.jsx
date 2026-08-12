import {
    CREATE_WHYCHOOSEUS_RED,
    GET_WHYCHOOSEUS_RED,
    UPDATE_WHYCHOOSEUS_RED,
    DELETE_WHYCHOOSEUS_RED
} from "../Constants";

export default function WhyChooseUSReducer(state = [], action) {
    switch (action.type) {

        case CREATE_WHYCHOOSEUS_RED:
            let newState = [...state];
            newState.unshift(action.payload);
            return newState;

        case GET_WHYCHOOSEUS_RED:
            return action.payload;

        case UPDATE_WHYCHOOSEUS_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_WHYCHOOSEUS_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}