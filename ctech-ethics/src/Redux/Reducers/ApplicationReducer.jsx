import {
    CREATE_APPLICATION_RED,
    GET_APPLICATION_RED,
    UPDATE_APPLICATION_RED,
    DELETE_APPLICATION_RED
} from "../Constants";

export default function ApplicationReducer(state = [], action) {
    switch (action.type) {

        case CREATE_APPLICATION_RED:
            return [
                action.payload,
                ...state
            ];

        case GET_APPLICATION_RED:
            return action.payload;

        case UPDATE_APPLICATION_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_APPLICATION_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}