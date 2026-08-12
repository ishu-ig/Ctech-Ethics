import {
    CREATE_TECHSTACK,
    GET_TECHSTACK,
    UPDATE_TECHSTACK,
    DELETE_TECHSTACK
} from "../Constants";

export function createTechStack(data) {
    return {
        type: CREATE_TECHSTACK,
        payload: data
    };
}

export function getTechStack() {
    return {
        type: GET_TECHSTACK
    };
}

export function updateTechStack(data) {
    return {
        type: UPDATE_TECHSTACK,
        payload: data
    };
}

export function deleteTechStack(data) {
    return {
        type: DELETE_TECHSTACK,
        payload: data
    };
}