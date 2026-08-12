import {
    CREATE_PLACEDSTUDENT,
    GET_PLACEDSTUDENT,
    UPDATE_PLACEDSTUDENT,
    DELETE_PLACEDSTUDENT
} from "../Constants";

export function createPlacedStudent(data) {
    return {
        type: CREATE_PLACEDSTUDENT,
        payload: data
    };
}

export function getPlacedStudent() {
    return {
        type: GET_PLACEDSTUDENT
    };
}

export function updatePlacedStudent(data) {
    return {
        type: UPDATE_PLACEDSTUDENT,
        payload: data
    };
}

export function deletePlacedStudent(data) {
    return {
        type: DELETE_PLACEDSTUDENT,
        payload: data
    };
}