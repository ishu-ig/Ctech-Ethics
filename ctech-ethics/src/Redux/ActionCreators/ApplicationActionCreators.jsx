import {
    CREATE_APPLICATION,
    GET_APPLICATION,
    UPDATE_APPLICATION,
    DELETE_APPLICATION
} from "../Constants";

export function createApplication(data) {
    return {
        type: CREATE_APPLICATION,
        payload: data
    };
}

export function getApplication() {
    return {
        type: GET_APPLICATION
    };
}

export function updateApplication(data) {
    return {
        type: UPDATE_APPLICATION,
        payload: data
    };
}

export function deleteApplication(data) {
    return {
        type: DELETE_APPLICATION,
        payload: data
    };
}