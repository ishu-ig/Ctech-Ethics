import { CREATE_BLOG_RED, DELETE_BLOG_RED, GET_BLOG_RED, UPDATE_BLOG_RED } from "../Constants"
export default function BlogReducer(state = [], action) {
    switch (action.type) {
        case CREATE_BLOG_RED:
            // Guard against malformed/undefined payloads (e.g. a failed
            // request that still resolved instead of rejecting)
            if (!action.payload || !action.payload._id) return state
            return [action.payload, ...state]

        case GET_BLOG_RED:
            // Backend responds with { result, count, data }; normalize so
            // this slice of state is always a plain array
            return Array.isArray(action.payload) ? action.payload : (action.payload?.data || [])

        case UPDATE_BLOG_RED:
            return state.map(item =>
                item._id === action.payload._id
                    ? action.payload
                    : item
            )

        case DELETE_BLOG_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}