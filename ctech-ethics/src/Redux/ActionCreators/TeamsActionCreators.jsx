import {
    CREATE_TEAMS,
    GET_TEAMS,
    UPDATE_TEAMS,
    DELETE_TEAMS
} from "../Constants";

export function createTeams(data) {
    return {
        type: CREATE_TEAMS,
        payload: data
    };
}

export function getTeams() {
    return {
        type: GET_TEAMS
    };
}

export function updateTeams(data) {
    return {
        type: UPDATE_TEAMS,
        payload: data
    };
}

export function deleteTeams(data) {
    return {
        type: DELETE_TEAMS,
        payload: data
    };
}