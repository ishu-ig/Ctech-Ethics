import { put, takeEvery, call } from "redux-saga/effects";

import {
    CREATE_PLACEMENT,
    CREATE_PLACEMENT_RED,
    DELETE_PLACEMENT,
    DELETE_PLACEMENT_RED,
    GET_PLACEMENT,
    GET_PLACEMENT_RED,
    UPDATE_PLACEMENT,
    UPDATE_PLACEMENT_RED
} from "../Constants";

import {
    createMultipartRecord,
    createRecord,
    deleteRecord,
    getRecord,
    updateMultipartRecord,
    updateRecord
} from "./Service/ApiCallingService";

function* createSaga(action) {
    try {
        let response = yield call(
            createMultipartRecord,
            "placement",
            action.payload
        );

        if (response?.result === "Done" && response?.data) {
            yield put({
                type: CREATE_PLACEMENT_RED,
                payload: response.data
            });
        } else {
            console.error("Create placement failed:", response?.reason || response);
        }

    } catch (error) {
        console.log(error);
    }
}

function* getSaga() {
    try {
        let response = yield call(
            getRecord,
            "placement"
        );

        if (response?.result === "Done" && Array.isArray(response?.data)) {
            yield put({
                type: GET_PLACEMENT_RED,
                payload: response.data
            });
        } else {
            console.error("Fetch placements failed:", response?.reason || response);
        }

    } catch (error) {
        console.log(error);
    }
}

function* updateSaga(action) {
    try {
        let response = yield call(
            updateMultipartRecord,
            "placement",
            action.payload
        );

        if (response?.result === "Done" && response?.data) {
            yield put({
                type: UPDATE_PLACEMENT_RED,
                payload: response.data
            });
        } else {
            console.error("Update placement failed:", response?.reason || response);
        }

    } catch (error) {
        console.log(error);
    }
}

function* deleteSaga(action) {
    try {
        yield call(
            deleteRecord,
            "placement",
            action.payload
        );

        yield put({
            type: DELETE_PLACEMENT_RED,
            payload: action.payload
        });

    } catch (error) {
        console.log(error);
    }
}

export default function* placementSagas() {
    yield takeEvery(CREATE_PLACEMENT, createSaga);
    yield takeEvery(GET_PLACEMENT, getSaga);
    yield takeEvery(UPDATE_PLACEMENT, updateSaga);
    yield takeEvery(DELETE_PLACEMENT, deleteSaga);
}