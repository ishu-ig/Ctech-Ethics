import { CREATE_SUBSERVICE_RED, DELETE_SUBSERVICE_RED, GET_SUBSERVICE_RED, UPDATE_SUBSERVICE_RED } from "../Constants"
export default function SubServiceReducer(state = [], action) {
    switch (action.type) {
        case CREATE_SUBSERVICE_RED: {
            const record = action.payload?.data ?? action.payload
            return [record, ...state]
        }

        case GET_SUBSERVICE_RED:
            return action.payload?.data ?? action.payload

        case UPDATE_SUBSERVICE_RED: {
            const record = action.payload?.data ?? action.payload
            return state.map(item =>
                item._id === record._id ? record : item
            )
        }

        case DELETE_SUBSERVICE_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}