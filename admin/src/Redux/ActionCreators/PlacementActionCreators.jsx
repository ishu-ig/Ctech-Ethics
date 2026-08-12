import {
    CREATE_PLACEMENT,
    GET_PLACEMENT,
    UPDATE_PLACEMENT,
    DELETE_PLACEMENT
} from "../Constants";

export function createPlacement(data) {
    return {
        type: CREATE_PLACEMENT,
        payload: data
    };
}

export function getPlacement() {
    return {
        type: GET_PLACEMENT
    };
}

export function updatePlacement(data) {
    return {
        type: UPDATE_PLACEMENT,
        payload: data
    };
}

export function deletePlacement(data) {
    return {
        type: DELETE_PLACEMENT,
        payload: data
    };
}