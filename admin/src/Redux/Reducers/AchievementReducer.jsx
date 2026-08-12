import { CREATE_ACHIEVEMENT_RED, DELETE_ACHIEVEMENT_RED, GET_ACHIEVEMENT_RED, UPDATE_ACHIEVEMENT_RED } from "../Constants"
export default function AchievementReducer(state = [], action) {
    switch (action.type) {
        case CREATE_ACHIEVEMENT_RED: {
            const record = action.payload?.data ?? action.payload
            return [record, ...state]
        }

        case GET_ACHIEVEMENT_RED:
            return action.payload?.data ?? action.payload

        case UPDATE_ACHIEVEMENT_RED: {
            const record = action.payload?.data ?? action.payload
            return state.map(item =>
                item._id === record._id ? record : item
            )
        }

        case DELETE_ACHIEVEMENT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}