const seriesColors = (state = {}, action) => {
  switch(action.type){
    case "ADD_SERVICE_TO_SERIES_COLORS":
      return {
        ...state,
        [action.payload]: {}
      }
    case "SET_SERIES_COLOR":
      return {
        ...state,
        [action.payload.service]: {
          ...state[action.payload.service],
          [action.payload.series]: action.payload.color
        }
      }
    case "RESTORE_SERIES_COLORS":
      return  action.payload
    default:
      return state
  }
}

export default seriesColors
