import {
    CREATE_CAREER,
    GET_CAREER,
    UPDATE_CAREER,
    DELETE_CAREER
} from "../Constants";

export function createCareer(data) {
    return {
        type: CREATE_CAREER,
        payload: data
    };
}

export function getCareer() {
    return {
        type: GET_CAREER
    };
}

export function updateCareer(data) {
    return {
        type: UPDATE_CAREER,
        payload: data
    };
}

export function deleteCareer(data) {
    return {
        type: DELETE_CAREER,
        payload: data
    };
}