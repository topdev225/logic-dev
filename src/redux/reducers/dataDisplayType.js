const dataDisplayType = (state = {num: 0}, action) => {
  switch(action.type){
    case "SET_DATA_DISPLAY_TYPE":
      return {
        ...state,
        num: action.payload
      }
    default:
      return state
  }
}

export default dataDisplayType
