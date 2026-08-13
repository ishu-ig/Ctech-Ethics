import {
    CREATE_PLACEMENTAPPLICATION,
    GET_PLACEMENTAPPLICATION,
    UPDATE_PLACEMENTAPPLICATION,
    DELETE_PLACEMENTAPPLICATION
} from "../Constants";

export function createPlacementApplication(data) {
    return {
        type: CREATE_PLACEMENTAPPLICATION,
        payload: data
    };
}

export function getPlacementApplication() {
    return {
        type: GET_PLACEMENTAPPLICATION
    };
}

export function updatePlacementApplication(data) {
    return {
        type: UPDATE_PLACEMENTAPPLICATION,
        payload: data
    };
}

export function deletePlacementApplication(data) {
    return {
        type: DELETE_PLACEMENTAPPLICATION,
        payload: data
    };
}