import { CREATE_PORTFOLIO_RED, DELETE_PORTFOLIO_RED, GET_PORTFOLIO_RED, UPDATE_PORTFOLIO_RED } from "../Constants"

export default function PortfolioReducer(state = [], action) {
    switch (action.type) {
        case CREATE_PORTFOLIO_RED: {
            const record = action.payload?.data ?? action.payload
            return [record, ...state]
        }

        case GET_PORTFOLIO_RED:
            return action.payload?.data ?? action.payload

        case UPDATE_PORTFOLIO_RED: {
            const record = action.payload?.data ?? action.payload
            return state.map(item =>
                item._id === record._id ? record : item
            )
        }

        case DELETE_PORTFOLIO_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}