import {
    CREATE_CONSULTANCY,
    DELETE_CONSULTANCY,
    GET_CONSULTANCY,
    UPDATE_CONSULTANCY
} from "../Constants";

export function createConsultancy(data) {
    return {
        type: CREATE_CONSULTANCY,
        payload: data
    };
}

export function getConsultancy() {
    return {
        type: GET_CONSULTANCY
    };
}

export function updateConsultancy(data) {
    return {
        type: UPDATE_CONSULTANCY,
        payload: data
    };
}

export function deleteConsultancy(data) {
    return {
        type: DELETE_CONSULTANCY,
        payload: data
    };
}
