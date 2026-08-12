import { CREATE_SERVICE_RED, DELETE_SERVICE_RED, GET_SERVICE_RED, UPDATE_SERVICE_RED } from "../Constants"
export default function ServiceReducer(state = [], action) {
    switch (action.type) {
        case CREATE_SERVICE_RED: {
            const record = action.payload?.data ?? action.payload
            return [record, ...state]
        }

        case GET_SERVICE_RED:
            return action.payload?.data ?? action.payload

        case UPDATE_SERVICE_RED: {
            const record = action.payload?.data ?? action.payload
            return state.map(item =>
                item._id === record._id ? record : item
            )
        }

        case DELETE_SERVICE_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}