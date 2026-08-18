import {
    CREATE_CONSULTANCY_RED,
    DELETE_CONSULTANCY_RED,
    GET_CONSULTANCY_RED,
    UPDATE_CONSULTANCY_RED
} from "../Constants";

export default function ConsultancyReducer(state = [], action) {
    switch (action.type) {
        case CREATE_CONSULTANCY_RED: {
            let newState = [...state];
            newState.unshift(action.payload);
            return newState;
        }

        case GET_CONSULTANCY_RED:
            return action.payload || [];

        case UPDATE_CONSULTANCY_RED: {
            let index = state.findIndex((x) => x._id === action.payload._id);
            if (index !== -1) {
                let newState = [...state];
                newState[index] = { ...newState[index], ...action.payload };
                return newState;
            }
            return state;
        }

        case DELETE_CONSULTANCY_RED:
            return state.filter((x) => x._id !== action.payload._id);

        default:
            return state;
    }
}
