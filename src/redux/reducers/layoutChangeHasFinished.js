const layoutChangeHasFinished = (state = {value: true}, action) => {
  switch(action.type){
    case "IS_LAYOUT_CHANGE_FINISHED":
      return {
        ...state,
        value: action.payload
      }
    default:
      return state
  }
}

export default layoutChangeHasFinished
