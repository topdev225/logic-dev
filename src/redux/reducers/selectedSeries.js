const defaultState = {}

const selectedSeries = (state = {}, action) => {
  switch(action.type){
    case "ADD_SERIES":
      return {
        ...state,
        [action.payload.service]: [...state[action.payload.service], action.payload.series]
      }
    case "REMOVE_SERIES":
      return {
        ...state,
        [action.payload.service]: [...state[action.payload.service].filter(series => series !== action.payload.series)]
      }
    case "ADD_ALL_SERIES":
      return action.payload
    case "ADD_SERVICES_TO_SELECTED_SERIES":
      return {
        ...state,
        [action.payload]: []
      }
    case "RESET_SERIES":
      return defaultState
    default:
      return state
  }
}

export default selectedSeries
