import {
    CREATE_PLACEMENTAPPLICATION_RED,
    GET_PLACEMENTAPPLICATION_RED,
    UPDATE_PLACEMENTAPPLICATION_RED,
    DELETE_PLACEMENTAPPLICATION_RED
} from "../Constants";

export default function PlacementApplicationReducer(state = [], action) {
    switch (action.type) {

        case CREATE_PLACEMENTAPPLICATION_RED:
            return [
                action.payload,
                ...state
            ];

        case GET_PLACEMENTAPPLICATION_RED:
            return action.payload;

        case UPDATE_PLACEMENTAPPLICATION_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            );

        case DELETE_PLACEMENTAPPLICATION_RED:
            return state.filter(
                item => item._id !== action.payload._id
            );

        default:
            return state;
    }
}