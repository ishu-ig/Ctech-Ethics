import {
    CREATE_BANNER_RED,
    GET_BANNER_RED,
    UPDATE_BANNER_RED,
    DELETE_BANNER_RED
} from "../Constants";

export default function BannerReducer(state = [], action) {
    switch (action.type) {

        case CREATE_BANNER_RED:
            return [
                action.payload,
                ...state
            ];

        case GET_BANNER_RED:
            return action.payload;

        case UPDATE_BANNER_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_BANNER_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}