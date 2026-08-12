import {
    CREATE_PLACEDSTUDENT_RED,
    GET_PLACEDSTUDENT_RED,
    UPDATE_PLACEDSTUDENT_RED,
    DELETE_PLACEDSTUDENT_RED
} from "../Constants";

export default function PlacedStudentReducer(state = [], action) {
    switch (action.type) {

        case CREATE_PLACEDSTUDENT_RED:
            return [
                action.payload,
                ...state
            ];

        case GET_PLACEDSTUDENT_RED:
            return action.payload;

        case UPDATE_PLACEDSTUDENT_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_PLACEDSTUDENT_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}