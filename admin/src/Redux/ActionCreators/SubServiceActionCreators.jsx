import { CREATE_SUBSERVICE, DELETE_SUBSERVICE, GET_SUBSERVICE, UPDATE_SUBSERVICE } from "../Constants"

export function createSubService(data) {
    return {
        type: CREATE_SUBSERVICE,
        payload: data
    }
}

export function getSubService() {
    return {
        type: GET_SUBSERVICE
    }
}

export function updateSubService(data) {
    return {
        type: UPDATE_SUBSERVICE,
        payload: data
    }
}

export function deleteSubService(data) {
    return {
        type: DELETE_SUBSERVICE,
        payload: data
    }
}