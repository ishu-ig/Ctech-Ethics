import {
    CREATE_TEAMS_RED,
    DELETE_TEAMS_RED,
    GET_TEAMS_RED,
    UPDATE_TEAMS_RED
} from "../Constants";

export default function TeamsReducer(state = [], action) {
    switch (action.type) {

        case CREATE_TEAMS_RED:
            return [
                action.payload,
                ...state
            ];

        case GET_TEAMS_RED:
            return action.payload;

        case UPDATE_TEAMS_RED:
            return state.map((team) =>
                team._id === action.payload._id
                    ? {
                        ...team,
                        image: action.payload.image,
                        name: action.payload.name,
                        role: action.payload.role,
                        badge: action.payload.badge,
                        bio: action.payload.bio,
                        skills: action.payload.skills,
                        social: action.payload.social,
                        status: action.payload.status
                    }
                    : team
            );

        case DELETE_TEAMS_RED:
            return state.filter(
                (team) => team._id !== action.payload._id
            );

        default:
            return state;
    }
}