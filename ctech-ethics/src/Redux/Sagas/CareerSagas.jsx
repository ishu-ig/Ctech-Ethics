import { put, takeEvery, call } from "redux-saga/effects";

import {
    CREATE_CAREER,
    CREATE_CAREER_RED,
    DELETE_CAREER,
    DELETE_CAREER_RED,
    GET_CAREER,
    GET_CAREER_RED,
    UPDATE_CAREER,
    UPDATE_CAREER_RED
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
            createRecord,
            "career",
            action.payload
        );

        if (response?.result === "Done" && response?.data) {
            yield put({
                type: CREATE_CAREER_RED,
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
            "career"
        );

        if (response?.result === "Done" && Array.isArray(response?.data)) {
            yield put({
                type: GET_CAREER_RED,
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
            updateRecord,
            "career",
            action.payload
        );

        if (response?.result === "Done" && response?.data) {
            yield put({
                type: UPDATE_CAREER_RED,
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
            "career",
            action.payload
        );

        yield put({
            type: DELETE_CAREER_RED,
            payload: action.payload
        });

    } catch (error) {
        console.log(error);
    }
}

export default function* careerSagas() {
    yield takeEvery(CREATE_CAREER, createSaga);
    yield takeEvery(GET_CAREER, getSaga);
    yield takeEvery(UPDATE_CAREER, updateSaga);
    yield takeEvery(DELETE_CAREER, deleteSaga);
}