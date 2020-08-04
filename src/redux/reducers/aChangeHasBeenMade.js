const aChangeHasBeenMade = (state = {value: false}, action) => {
  switch(action.type){
    case "A_CHANGE_HAS_BEEN_MADE":
      return {
        ...state,
        value: action.payload
      }
    default:
      return state
  }
}

export default aChangeHasBeenMade
