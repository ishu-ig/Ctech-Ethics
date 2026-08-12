import {
    CREATE_WHYCHOOSEUS,
    GET_WHYCHOOSEUS,
    UPDATE_WHYCHOOSEUS,
    DELETE_WHYCHOOSEUS
} from "../Constants";

export function createWhyChooseUs(data) {
    return {
        type: CREATE_WHYCHOOSEUS,
        payload: data
    };
}

export function getWhyChooseUs() {
    return {
        type: GET_WHYCHOOSEUS
    };
}

export function updateWhyChooseUs(data) {
    return {
        type: UPDATE_WHYCHOOSEUS,
        payload: data
    };
}

export function deleteWhyChooseUs(data) {
    return {
        type: DELETE_WHYCHOOSEUS,
        payload: data
    };
}